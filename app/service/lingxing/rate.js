'use strict';
// app/service/user.js
const dayjs = require('dayjs');
// 从 egg 上获取（推荐）
const Service = require('egg').Service;
const { QueryTypes, Op } = require('sequelize');

class UserService extends Service {
  async getRate(authToken) {
    const { ctx } = this;
    // const authToken = ctx.cookies.get('auth-token');
    const ms = new Date().getTime();
    const date = dayjs(ms).format('YYYY-MM');
    const data = await ctx.curl('https://fulintech.lingxing.com/api/currency/lists', {
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
        date,
        req_time_sequence: '/api/currency/lists$$5',

      },
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
    });
    const data2Mysql = [];
    data.data.list.map(item => {
      data2Mysql.push({
        code_date: item.code + '_' + item.date,
        ...item,
      });
    });
    await ctx.model.Fulin.RateList.bulkCreate(data2Mysql, { updateOnDuplicate: [
      'code_date',
      'name',
      'icon',
      'rate',
      'date',
      'code',
    ] });

    return data;
  }

}
module.exports = UserService;

