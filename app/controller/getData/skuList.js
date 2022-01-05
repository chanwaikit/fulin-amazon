'use strict';

const Controller = require('egg').Controller;

// /api/advertising/ads_portfolio/selectItems

class ProfitController extends Controller {
  async getCookie() {
    const ctx = this.ctx;
    const result = await ctx.curl('https://fulintech.lingxing.com/api/passport/login', {
      // 必须指定 method
      method: 'POST',
      // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
      contentType: 'json',
      data: {
        account: '15919799197',
        auto_login: 1,
        pwd: '584621379fulin',
        req_time_sequence: '/api/passport/login$$1',
        uuid: 'da91fd94-ba7f-437d-8d97-9cfa319b9d6c',
        verify_code: '',
      },
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
      headers: {
        'x-ak-company-id': '90136223568253440',
        'x-ak-env-key': 'fulintech',
        'x-ak-request-id': 'f2ba4047-81b0-4bbc-a759-aa3024d5fc3d',
        'x-ak-request-source': 'erp',
        'x-ak-version': '2.8.5.1.2.033',
        'x-ak-zid': 1,
      },
    });

    const authToken = result.headers['set-cookie'][0].split(';')[0].slice(11);

    ctx.cookies.set('auth-token', authToken);

  }

  async getSku() {
    const ctx = this.ctx;
    if (!ctx.cookies.get('auth-token')) {
      await this.getCookie();
    }

    ctx.body = await ctx.service.lingxing.sku.fetch();
  }

  async getSkuMid() {
    const ctx = this.ctx;
    if (!ctx.cookies.get('auth-token')) {
      await this.getCookie();
    }

    ctx.body = await ctx.service.lingxing.sku.getSkuMid();
  }
}

module.exports = ProfitController;
