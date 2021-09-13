'use strict';
// app/service/user.js
const dayjs = require('dayjs');

const Service = require('egg').Service;
class UserService extends Service {
  async fetch() {
    const { ctx } = this;
    const adGroup = await ctx.model.Fulin.LocalSkuMidSbGroup.findAll();
    const authToken = ctx.state.authToken;
    const pResult = [];
    const nowTime = new Date().getTime();
    for (let k = 0; k < 15; k++) {
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

