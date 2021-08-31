'use strict';
// app/service/user.js
const Service = require('egg').Service;
class UserService extends Service {
  async fetch() {
    const { ctx } = this;
    const shopList = await ctx.model.Fulin.ShopList.findAll();
    const authToken = ctx.cookies.get('auth-token');
    const pResult = [];
    for (let i = 0; i < shopList.length; i++) {
      const result = await ctx.curl('https://fulintech.lingxing.com/api/advertising/ads_portfolio/selectItems', {
        // 必须指定 method
        method: 'GET',
        // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
        contentType: 'json',
        headers: {
          cookie: 'auth-token=' + authToken,
        },
        data: {
          profile_id: shopList[i].dataValues.profile_id,
          req_time_sequence: '/api/advertising/ads_portfolio/selectItems$$5',
        },
        // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
        dataType: 'json',
      });

      const resultArray = result.data.data.list;

      for (let j = 0; j < resultArray.length; j++) {

        const sbResult = await ctx.curl('https://fulintech.lingxing.com/api/ads_sb_campaign/listSbCampaigns', {
          // 必须指定 method
          method: 'GET',
          // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
          contentType: 'json',
          headers: {
            cookie: 'auth-token=' + authToken,
          },
          data: {
            offset: 0,
            length: 50,
            start_date: '2021-05-04',
            end_date: '2021-05-04',
            search_field: 'name',
            search_type: 1,
            profile_id: shopList[i].dataValues.profile_id,
            sid: shopList[i].sid,
            portfolio_id: resultArray[j].portfolio_id,
            extend_search: [],
            filter_parent: 1,
            req_time_sequence: '/api/ads_sb_campaign/listSbCampaigns$$51',
          },
          // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
          dataType: 'json',
        });

        if (sbResult.data.total > 0) { // 广告分组里头有活动的，才列为SB或者SBV的广告组合
          const obj = {
            sid: shopList[i].sid,
            profile_id: shopList[i].dataValues.profile_id,
            ...resultArray[j],
          };
          if (sbResult.data.list[0].ad_format === 'video') {
            // sbv组合
            obj.type = 'sbv';

          } else if (sbResult.data.list[0].ad_format === 'productCollection') {
            // sb组合
            obj.type = 'sb';

          }

          const profitObj = await ctx.model.Fulin.SbGroup.findByPk(obj.portfolio_id);

          if (!profitObj) {
            await ctx.model.Fulin.SbGroup.create(obj);
          }
          pResult.push(obj);
        }


        const spResult = await ctx.curl('https://fulintech.lingxing.com/api/ads_campaign/listCampaigns', {
          // 必须指定 method
          method: 'GET',
          // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
          contentType: 'json',
          headers: {
            cookie: 'auth-token=' + authToken,
          },
          data: {
            offset: 0,
            length: 50,
            start_date: '2021-05-04',
            end_date: '2021-05-04',
            search_field: 'name',
            search_type: 1,
            profile_id: shopList[i].dataValues.profile_id,
            sid: shopList[i].sid,
            portfolio_id: resultArray[j].portfolio_id,
            extend_search: [],
            filter_parent: 1,
            req_time_sequence: '/api/ads_campaign/listCampaigns$$10',
          },
          // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
          dataType: 'json',
        });

        if (spResult.data.total > 0) { // 广告分组里头有活动的，才列为SB或者SBV的广告组合
          const obj = {
            sid: shopList[i].sid,
            profile_id: shopList[i].dataValues.profile_id,
            ...resultArray[j],
          };

          obj.type = 'sp';
          const profitObj = await ctx.model.Fulin.SpGroup.findByPk(obj.portfolio_id);
          if (!profitObj) {
            await ctx.model.Fulin.SpGroup.create(obj);
          }


          pResult.push(obj);
        }


      }
    }

    return [];
  }
}
module.exports = UserService;

