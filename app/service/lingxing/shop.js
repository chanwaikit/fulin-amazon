'use strict';
// app/service/user.js
const dayjs = require('dayjs');
// 从 egg 上获取（推荐）
const Service = require('egg').Service;
class UserService extends Service {
  async fetch(authToken) {
    const { ctx } = this;
    // const authToken = ctx.cookies.get('auth-token');


    const result = await ctx.curl('https://fulintech.lingxing.com/api/ads_profile/getProfileList', {
      // 必须指定 method
      method: 'GET',
      // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
      contentType: 'json',
      headers: {
        cookie: 'auth-token=' + authToken,
      },
      data: {
        req_time_sequence: '/api/ads_profile/getProfileList$$1',
      },
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
    });


    const result2 = await ctx.curl('https://fulintech.lingxing.com/sc/data/seller/lists', {
      // 必须指定 method
      method: 'GET',
      // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
      contentType: 'json',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer 1df89lYIY+J9i0xVBrqxroXOhq/yGcG1tD8kc3eiWT++Ss5RrredrVr6gqsBGFMPR6BvtRmIq4ggfBZE+futlE7gcKnLBsUBmHadvSLBoAdm0dbryA',
        // cookie: 'auth-token=' + authToken,
        //
      },
      data: {
        req_time_sequence: '/api/ads_profile/getProfileList$$1',
      },
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
    });

    console.log(result);

    const resultArray = result.data.list;
    for (let i = 0; i < resultArray.length; i++) {
      const obj = {
        ...resultArray[i],
      };
      const profitObj = await ctx.model.Fulin.ShopList.findByPk(obj.sid);
      if (!profitObj) {
        await ctx.model.Fulin.ShopList.create(obj);
      } else {
        await ctx.model.Fulin.ShopList.update(obj, {
          where: {
            sid: obj.sid,
          },
        });

      }
    }

    return result2;
  }
}
module.exports = UserService;

