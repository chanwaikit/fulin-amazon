'use strict';

const Controller = require('egg').Controller;
const dayjs = require('dayjs');
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

  async updatePrice() {
    const ctx = this.ctx;
    if (!ctx.cookies.get('auth-token')) {
      await this.getCookie();
    }
    const authToken = ctx.cookies.get('auth-token');
    const { profile_id, sid, bid, keyword_id } = ctx.request.body;

    const result = await ctx.curl('https://fulintech.lingxing.com/api/ads_keyword/updateKeywords', {
      // 必须指定 method
      method: 'POST',
      // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
      contentType: 'json',
      headers: {
        cookie: 'auth-token=' + authToken,
      },
      data: {
        keywords: [{
          bid,
          keyword_id,
        }],
        sid,
        profile_id,
        req_time_sequence: '/api/ads_keyword/updateKeywords$$1',
      },
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
    });
    ctx.body = {
      response: result.data.msg,
    };
    ctx.status = 200;
    console.log(63, result.data.msg);
  }


  async storeAdPosition() {
    const ctx = this.ctx;

    const { pp, sid, bid, keywords, asin, name, page, ad_sort, phone_page,
      phone_ad_sum,
      phone_ad_sort, time,
      sp_sum,
      natural_sum,
      sp_all_sum,
      natural_all_sum,
      sp_sort,
      sp_all_sort,
      natural_sort,
      natural_all_sort,
      sp_all_page,
      sp_page,
      natural_all_page,
      natural_page,

      phone_sp_sum,
      phone_natural_sum,
      phone_sp_all_sum,
      phone_natural_all_sum,
      phone_sp_sort,
      phone_sp_all_sort,
      phone_natural_sort,
      phone_natural_all_sort,
      phone_sp_all_page,
      phone_sp_page,
      phone_natural_all_page,
      phone_natural_page,
    } = ctx.request.body;
    const time_str = dayjs(time).format('YYYY-MM-DD HH:mm');

    if (pp === 'pc') {
      ctx.model.Fulin.AdPosition.create({
        time_str,
        pid: name + '_' + asin + '_' + sid + '_' + keywords + '_' + time_str,
        asin,
        keywords,
        bid,

        sp_sum,
        natural_sum,
        sp_all_sum,
        natural_all_sum,
        sp_sort,
        sp_all_sort,
        natural_sort,
        natural_all_sort,
        sp_all_page,
        sp_page,
        natural_all_page,
        natural_page,
      });
    } else if (pp === 'phone') {
      ctx.model.Fulin.AdPosition.update({
        time_str,
        pid: name + '_' + asin + '_' + sid + '_' + keywords + '_' + time_str,
        asin,
        page,
        keywords,
        bid,
        phone_sp_sum,
        phone_natural_sum,
        phone_sp_all_sum,
        phone_natural_all_sum,
        phone_sp_sort,
        phone_sp_all_sort,
        phone_natural_sort,
        phone_natural_all_sort,
        phone_sp_all_page,
        phone_sp_page,
        phone_natural_all_page,
        phone_natural_page,
      }, {
        where: {
          pid: name + '_' + asin + '_' + sid + '_' + keywords + '_' + time_str,
        },
      });
    }
    ctx.body = {
      status: 200,
    };
    ctx.status = 200;
  }


  async index() {
    const ctx = this.ctx;
    if (!ctx.cookies.get('auth-token')) {
      await this.getCookie();
    }
    const authToken = ctx.cookies.get('auth-token');
    const { profile_id, sid } = ctx.request.body;

    const result = await ctx.curl('https://fulintech.lingxing.com/api/ads_keyword/listKeywords', {
      // 必须指定 method
      method: 'GET',
      // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
      contentType: 'json',
      headers: {
        cookie: 'auth-token=' + authToken,
      },
      data: {
        length: 1000,
        sort_field: 'cost',
        sort_type: 'desc',
        profile_id,
        start_date: dayjs(new Date().getTime()).format('YYYY-MM-DD'),
        end_date: dayjs(new Date().getTime()).format('YYYY-MM-DD'),
        search_field: 'keyword_text',
        search_type: 2,
        sid,
        filter_parent: 1,
        extend_search: [],
        req_time_sequence: '/api/ads_keyword/listKeywords$$4',
      },
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
    });
    console.log(11111);
    // const keyword = result.data.list.filter(item => {
    //   return item.keyword_id == 159645413905778;
    // });
    ctx.body = {
      response: result.data.list,
    };
    ctx.status = 200;
  }
}

module.exports = ProfitController;
