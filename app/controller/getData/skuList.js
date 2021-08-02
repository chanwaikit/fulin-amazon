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
        account: '13530178494',
        auto_login: 1,
        pwd: 'abc123',
        req_time_sequence: '/api/passport/login$$1',
        uuid: 'da91fd94-ba7f-437d-8d97-9cfa319b9d6c',
        verify_code: '',
      },
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
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
}

module.exports = ProfitController;
