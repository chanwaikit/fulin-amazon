'use strict';
// https://blog.devgenius.io/scraping-amazon-com-using-javascript-18ef6caf53f6
const Controller = require('egg').Controller;
const axios = require('axios');
const cherrio = require('cheerio');
class HomeController extends Controller {
  async index() {
    const ctx = this.ctx;
    const pages = [ '', '&page=2', '&page=3' ];
    const keywords = [ 'dvd+player', 'dvd+players+for+tv', 'multi+region+dvd+player', 'cd+player' ];
    // const pages = [ '' ];
    // const keywords = [ 'dvd+player' ];
    const pageName = [ '第一页', '第二页', '第三页' ];
    const output = [];
    let html;
    for (let j = 0; j < keywords.length; j++) {
      let response = '';
      for (let i = 0; i < pages.length; i++) {
        console.log(j, i, '加载中');
        html = await this.getHTML(`https://www.amazon.co.uk/s?k=${keywords[j]}${pages[i]}&ref=nb_sb_noss`);
        const $ = cherrio.load(html);

        const span = $('div[data-component-type="sp-sponsored-result"]');
        // const span = $('.rush-component ');


        const result = [];
        span.each(function(i, item) {
          console.log(27, $(this).attr('data-component-type'));
          result.push(String($(this).html()).indexOf('B07Z7YMQYT') > -1 ? 1 : 0);
        });

        // console.log(result.indexOf(1) > -1 ? result.indexOf(1) + 1 : 0, result.length);
        if (result.length > 0) { // 当前页有sp广告
          if (result.indexOf(1) > -1) { // 有我们的广告
            response = `${result.indexOf(1) + 1}/${result.length}`;
          }
        }
        console.log(keywords[j], pageName[i], response);
        if (response) {
          output.push(`${keywords[j]}:${pageName[i]},${response ? response : '无'}`);
          break;
        }
      }
    }

    ctx.body = output;
  }


  async getHTML(productURL) {
    const { data: html, status, headers, config } = await axios.get(productURL, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Cookie: 'session-id=262-9282299-8860619; i18n-prefs=GBP; ubid-acbuk=260-7938613-8027710; session-id-time=2082787201l; session-token="tAFO4hz9JgEd3oqdEOzGAmAAWJ/BQtIPLINIoj2EuptrT6o/nNKhLSMHIwrmLWb45LodfPGLerknZxlAPVpoX0fR5FRWcrmCpZG+lIElNILdJ8Y5kk/hIIJbB+TZcQBHNQMfykMjKRaqItQyfl//BDMioGf0ocFjcPpW4TovRN0gWQiekKAr8yl74J0WMhT7zfiCybpdjM+O2sDNY8IIHg1hJFybgF8YAGQIuH1llW91gb5ZwRrl5Vtv4/AKumUscB2x4vplKFc="; csm-hit=tb:s-2YT2EQ4CVHJWHDTQBNJY|1628045611011&t:1628045611011&adb:adblk_no',

      },
    })
      .catch(function(error) {
        console.log(error);
      });

    return html;

  }

  async getAmazonPrice(html) {
    const $ = cherrio.load(html);

    const span = $('#priceblock_dealprice');

    // console.log(48, span);
    return span.html();

  }


  async getAmazonModel(html) {
    const $ = cherrio.load(html);

    const span = $('#productTitle');


    // return span.html();
  }

}

module.exports = HomeController;
