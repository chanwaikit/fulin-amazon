'use strict';
// app/service/user.js
const dayjs = require('dayjs');

const Service = require('egg').Service;
class UserService extends Service {
  async fetch() {
    const { ctx } = this;
    const adGroup = await ctx.model.Fulin.LocalSkuMidSbGroup.findAll();
    const shopList = await ctx.model.Fulin.ShopList.findAll();

    const sids = [];
    shopList.map(element => {
      if (element.teika_open == 1) {
        sids.push(Number(element.sid));
      }
    });
    console.log(sids);

    const authToken = ctx.state.authToken;
    const pResult = [];
    const nowTime = new Date().getTime();
    for (let k = 0; k < 30; k++) {
      // console.log(14, k);
      for (let i = 0; i < adGroup.length; i++) {
        const date_str = dayjs(nowTime - 24 * 60 * 60 * 1000 * k).format('YYYY-MM-DD');
        const result = await ctx.curl('https://fulintech.lingxing.com/api/ads_sb_campaign/listSbCampaigns', {
          // 必须指定 method
          method: 'GET',
          // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
          contentType: 'json',
          headers: {
            cookie: 'auth-token=' + authToken,
            'x-ak-company-id': '90136223568253440',
            'x-ak-env-key': 'fulintech',
            'x-ak-request-id': 'f2ba4047-81b0-4bbc-a759-aa3024d5fc3d',
            'x-ak-request-source': 'erp',
            'x-ak-version': '2.8.5.1.2.033',
            'x-ak-zid': 1,
          },
          data: {
            offset: 0,
            length: 1000,
            start_date: date_str,
            end_date: date_str,
            search_field: 'name',
            search_type: 1,
            profile_id: adGroup[i].dataValues.profile_id,
            sid: adGroup[i].dataValues.sid,
            portfolio_id: adGroup[i].dataValues.portfolio_id,
            extend_search: [],
            filter_parent: 1,
            req_time_sequence: '/api/ads_sb_campaign/listSbCampaigns$$6',
          },
          // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
          dataType: 'json',
        });
        const statistics = result.data.statistics;

        if (statistics.impressions > 0) {
          const obj = {
            id: adGroup[i].dataValues.profile_id + '_' + adGroup[i].dataValues.portfolio_id + '_' + date_str,
            clicks: statistics.clicks || 0,
            cost: statistics.cost || 0,
            currency_code: statistics.currency_code || 0,
            impressions: statistics.impressions || 0,
            order_num: statistics.order_num || 0,
            sales_amount: statistics.sales_amount || 0,
            profile_id: adGroup[i].dataValues.profile_id,
            portfolio_id: adGroup[i].dataValues.portfolio_id,
            group_name: adGroup[i].dataValues.name,
            date_str,
          };


          if (sids.indexOf(Number(adGroup[i].dataValues.sid)) > -1) {
            obj.teika_cost = (obj.cost * 0.03).toFixed(2);
          }


          const profitObj = await ctx.model.Fulin.SbCampaign.findByPk(obj.id);
          if (!profitObj) {
            await ctx.model.Fulin.SbCampaign.create(obj);
          } else {
            await ctx.model.Fulin.SbCampaign.update(obj, {
              where: {
                id: obj.id,
              },
            });

          }
          pResult.push(obj);

        }
      }


    }

    return pResult;
  }
}
module.exports = UserService;

