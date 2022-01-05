'use strict';

const Subscription = require('egg').Subscription;
const dayjs = require('dayjs');
const axios = require('axios');
const cherrio = require('cheerio');

class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '1440m', // 1 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数

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
      headers: {
        'x-ak-company-id': '90136223568253440',
        'x-ak-env-key': 'fulintech',
        'x-ak-request-id': 'f2ba4047-81b0-4bbc-a759-aa3024d5fc3d',
        'x-ak-request-source': 'erp',
        'x-ak-version': '2.8.5.1.2.033',
        'x-ak-zid': 1,
      },
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
    });
    const authToken = result.headers['set-cookie'][0].split(';')[0].slice(11);


    console.log(40, authToken);
    ctx.state.authToken = authToken;
    ctx.cookies.set('auth-token', authToken);
    return authToken;
  }

  async subscribe() {
    console.log('自动调接口');

    const { ctx } = this;

    // if (!ctx.cookies.get('auth-token')) {
    //   await this.getCookie();
    // }
    // ctx.cookies.set('auth-token', 1233444);
    // console.log(54, ctx.cookies.set('auth-token', 1233444));
    // if (!ctx.state.authToken) {
    //   await this.getCookie();
    // }
    // setInterval(() => {
    //   console.log(ctx.state);
    // }, 5000);


    // 09-22
    const token = await this.getCookie();
    ctx.state.authToken = token;

    await ctx.service.lingxing.category.fetch(token);
    await ctx.service.lingxing.shop.fetch(token);
    await ctx.service.lingxing.adGroup.fetch(token);
    // await ctx.service.lingxing.rate.getRate(token);

    await ctx.service.lingxing.spCampaign.fetch(token);
    await ctx.service.lingxing.sbCampaign.fetch(token);
    await ctx.service.lingxing.sdCampaign.fetch(token);
    await ctx.service.lingxing.sku.getSkuMid(token);
    await ctx.service.lingxing.sku.getSkuMidProfit(token);

    const ms = new Date().getTime();
    console.log(dayjs(ms).format('YYYY-MM-DD HH:mm:ss'));
    // 09-22

    // console.log(1, data);
    // const time = new Date().getTime();
    // const time_str = dayjs(time).format('YYYY-MM-DD HH:mm:ss');
    // console.log('捕捉时间', time_str);

    // const output = await this.index();
    // console.log('捕捉结果', output);

    // if (output.length > 0) {
    //   output.map(item => {
    //     const obj = {
    //       ...item,
    //       pid: item.asin + '_' + time_str + '_' + item.keywords,
    //       time_str,
    //     };
    //     // const a = await ctx.model.Fulin.AdPosition.create(obj);
    //     ctx.model.Fulin.AdPosition.create(obj);
    //   });
    // } else {
    //   ctx.model.Fulin.AdPosition.create({
    //     pid: time_str + '_捕捉失败',
    //   });

    // }


  }


  async index() {
    // const ctx = this.ctx;
    // const pages = [ '', '&page=2', '&page=3' ];
    // const keywords = [ 'dvd+player', 'dvd+players+for+tv', 'multi+region+dvd+player', 'cd+player' ];
    // // const pages = [ '' ];
    // // const keywords = [ 'dvd+player' ];
    // const pageName = [ '第一页', '第二页', '第三页' ];
    // const output = [];
    // let html;
    // for (let j = 0; j < keywords.length; j++) {
    //   let response = '';
    //   for (let i = 0; i < pages.length; i++) {
    //     // console.log(j, i, '加载中');
    //     html = await this.getHTML(`https://www.amazon.co.uk/s?k=${keywords[j]}${pages[i]}&ref=nb_sb_noss`);
    //     const $ = cherrio.load(html);

    //     const span = $('div[data-component-type="sp-sponsored-result"]');
    //     // const span = $('.rush-component ');


    //     const result = [];
    //     span.each(function(i, item) {
    //       // console.log(27, $(this).attr('data-component-type'));
    //       result.push(String($(this).html()).indexOf('B07Z7YMQYT') > -1 ? 1 : 0);
    //     });

    //     // console.log(result.indexOf(1) > -1 ? result.indexOf(1) + 1 : 0, result.length);
    //     if (result.length > 0) { // 当前页有sp广告
    //       if (result.indexOf(1) > -1) { // 有我们的广告
    //         response = `${result.indexOf(1) + 1}/${result.length}`;
    //       }
    //     }
    //     // console.log(keywords[j], pageName[i], response);
    //     if (response) {
    //       output.push({
    //         tips: `${keywords[j]}:${pageName[i]},${response ? response : '无'}`,
    //         asin: 'B07Z7YMQYT',
    //         page: i,
    //         ad_sum: result.length,
    //         ad_sort: result.indexOf(1) + 1,
    //         keywords: keywords[j],
    //       });
    //       break;
    //     }
    //   }
    // }

    // return output;
  }


  async getHTML(productURL) {
    // const { data: html, status, headers, config } = await axios.get(productURL, {
    //   headers: {
    //     'User-Agent': 'Mozilla/5.0',
    //     Cookie: 'session-id=262-9282299-8860619; i18n-prefs=GBP; ubid-acbuk=260-7938613-8027710; session-id-time=2082787201l; session-token="tAFO4hz9JgEd3oqdEOzGAmAAWJ/BQtIPLINIoj2EuptrT6o/nNKhLSMHIwrmLWb45LodfPGLerknZxlAPVpoX0fR5FRWcrmCpZG+lIElNILdJ8Y5kk/hIIJbB+TZcQBHNQMfykMjKRaqItQyfl//BDMioGf0ocFjcPpW4TovRN0gWQiekKAr8yl74J0WMhT7zfiCybpdjM+O2sDNY8IIHg1hJFybgF8YAGQIuH1llW91gb5ZwRrl5Vtv4/AKumUscB2x4vplKFc="; csm-hit=tb:s-2YT2EQ4CVHJWHDTQBNJY|1628045611011&t:1628045611011&adb:adblk_no',

    //   },
    // })
    //   .catch(function(error) {
    //     console.log(error);
    //     return '';
    //   });

    // return html || '';

  }
}

module.exports = UpdateCache;
