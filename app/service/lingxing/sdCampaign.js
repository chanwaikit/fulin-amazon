'use strict';
// app/service/user.js
const dayjs = require('dayjs');

const Service = require('egg').Service;
class UserService extends Service {
  async fetch() {
    const { ctx } = this;
    const SkuList = await ctx.model.Fulin.SkuList.findAll();
    const ShopList = await ctx.model.Fulin.ShopList.findAll();

    let sids = [];
    ShopList.map(element => {
      if(element.teika_open == 1){
        sids.push(Number(element.sid))
      }
    })  

    const authToken = ctx.state.authToken;
    const pResult = [];
    const nowTime = new Date().getTime();
    for (let k = 0; k < 30; k++) {
      // console.log(14, k);
      for (let i = 0; i < SkuList.length; i++) {
        const date_str = dayjs(nowTime - 24 * 60 * 60 * 1000 * k).format('YYYY-MM-DD');
        const result = await ctx.curl('https://fulintech.lingxing.com/api/ads_sd_report_product/list', {
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
            sort_field: 'cost',
            sort_type: 'desc',
            sid: SkuList[i].sid,
            start_date: date_str,
            end_date: date_str,
            search_value: SkuList[i].local_sku,
            search_field: 'asin',
            extend_search: [],
            req_time_sequence: '/api/ads_sd_report_product/list$$6',
          },
          // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
          dataType: 'json',
        });
        const statistics = result.data.statistics;
        // console.log(444, statistics.total_clicks);
        const {
          acos,
          clicks,
          cost,
          cpa,
          cpc,
          ctr,
          cvr,
          impressions,
          order_quantity,
          sales_amount,
        } = statistics;
        if (impressions > 0) {
          const shopObj = ShopList.filter(item => {
            return item.sid == SkuList[i].sid;
          })[0] || {};
          const obj = {
            local_sku_sid: SkuList[i].local_sku + '_' + SkuList[i].sid,
            local_sku: SkuList[i].local_sku,
            local_name: SkuList[i].local_name,
            sid: SkuList[i].sid,
            id: SkuList[i].local_sku + '_' + SkuList[i].sid + '_' + date_str,
            total_acos: acos,
            total_cost: cost,
            total_cpa: cpa,
            total_ctr: ctr,
            total_cvr: cvr,
            total_clicks: clicks,
            total_cpc: cpc,
            total_impressions: impressions,
            total_order_quantity: order_quantity,
            total_sales_amount: sales_amount,
            mid: shopObj.mid,
            currency_icon: shopObj.currency_icon,
            currency_code: shopObj.currency_code,
            date_str,
          };

          if(sids.indexOf(Number(SkuList[i].sid))> -1 ){
            obj.teika_cost = ((obj.total_cost || 0) * 0.03).toFixed(2)
          }

          const profitObj = await ctx.model.Fulin.SdCampaign.findByPk(obj.id);
          if (!profitObj) {
            await ctx.model.Fulin.SdCampaign.create(obj);
          } else {
            await ctx.model.Fulin.SdCampaign.update(obj, {
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

