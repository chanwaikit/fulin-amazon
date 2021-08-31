'use strict';

const Subscription = require('egg').Subscription;
const dayjs = require('dayjs');
const axios = require('axios');
const cherrio = require('cheerio');

class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '10m', // 1 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    // const { ctx } = this;
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
