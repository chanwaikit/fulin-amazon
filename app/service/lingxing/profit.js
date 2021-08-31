'use strict';
// app/service/user.js
const dayjs = require('dayjs');
// 从 egg 上获取（推荐）
const Service = require('egg').Service;
class UserService extends Service {
  async fetch() {
    const { ctx } = this;
    const authToken = ctx.cookies.get('auth-token');
    const nowTime = new Date().getTime();
    for (let i = 0; i < 450; i++) {
      const date_str = dayjs(nowTime - 24 * 60 * 60 * 1000 * i).format('YYYY-MM-DD');
      const result = await ctx.curl('https://fulintech.lingxing.com/api/report/profitAsin', {
      // 必须指定 method
        method: 'POST',
        // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
        contentType: 'json',
        headers: {
          cookie: 'auth-token=' + authToken,
        },
        data: {
          offset: 0,
          length: 10000,
          sort_field: 'total_volume',
          sort_type: 'desc',
          start_date: date_str,
          end_date: date_str,
          currency_type: '2',
          type: '0',
          req_time_sequence: '/api/report/profitAsin$$2',
        },
        // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
        dataType: 'json',
      });
      // console.log(64, result.data.list);
      // resultArray = [ ...resultArray, ...result.data.list ];
      const resultArray = result.data.list || [];
      console.log(38, resultArray);
      for (let i = 0; i < resultArray.length; i++) {
        const obj = {
          date_str,
          pid_sid: resultArray[i].pid + '_' + resultArray[i].sid,
          profit_id: resultArray[i].local_sku + '_' + resultArray[i].sid + '_' + date_str,
          local_sku_sid: resultArray[i].local_sku + '_' + resultArray[i].sid,
          ...resultArray[i],
          category_text: resultArray[i].category_text[0],
          cid: resultArray[i].cid[0],
          bid: resultArray[i].bid[0],

        };
        const profitObj = await ctx.model.Fulin.ProfitStatistic.findByPk(obj.profit_id);
        if (!profitObj) {
          await ctx.model.Fulin.ProfitStatistic.create(obj);
        } else {
          await ctx.model.Fulin.ProfitStatistic.update(obj, {
            where: {
              profit_id: obj.profit_id,
            },
          });

        }
      }

    }


    return 111;
  }

}
module.exports = UserService;

