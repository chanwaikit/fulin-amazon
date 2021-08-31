'use strict';
// app/service/user.js
const dayjs = require('dayjs');
// 从 egg 上获取（推荐）
const Service = require('egg').Service;
class UserService extends Service {
  async fetch() {
    const { ctx } = this;


    const authToken = ctx.cookies.get('auth-token');
    const nowTime = new Date().getTime() - 365 * 24 * 60 * 60 * 1000;
    for (let i = 0; i < 85; i++) {
      const date_str = dayjs(nowTime - 24 * 60 * 60 * 1000 * i).format('YYYY-MM-DD');
      const result = await ctx.curl('https://fulintech.lingxing.com/api/report/asinLists', {
      // 必须指定 method
        method: 'POST',
        // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
        contentType: 'json',
        headers: {
          cookie: 'auth-token=' + authToken,
        },
        data: {
          asin_type: 0,
          currency_type: 2,
          end_date: date_str,
          length: 10000,
          offset: 0,
          req_time_sequence: '/api/report/asinLists$$3',
          sort_field: 'volume',
          sort_type: 'desc',
          start_date: date_str,
        },
        // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
        dataType: 'json',
      });
      // console.log(64, dayjs(nowTime - 24 * 60 * 60 * 1000 * i).format('YYYY-MM-DD'));
      const resultArray = result.data.list.filter(item => {
        return item.avg_star != '0.00';
      });
      for (let i = 0; i < resultArray.length; i++) {

        let local_sku = '';
        resultArray[i].price_list.map(element => {
          if (element.local_sku) {
            local_sku = element.local_sku;
          }
        });

        const obj = {
          date_str,
          pid_sid: resultArray[i].pid + '_' + resultArray[i].sid,
          expression_id: local_sku + '_' + resultArray[i].sid + '_' + date_str,
          local_sku_sid: local_sku + '_' + resultArray[i].sid,
          ...resultArray[i],
        };
        if (local_sku) {
          const productObj = await ctx.model.Fulin.ProductExpression.findByPk(obj.expression_id);
          if (!productObj) {
            await ctx.model.Fulin.ProductExpression.create(obj);
          } else {
            await ctx.model.Fulin.ProductExpression.update(obj, {
              where: {
                expression_id: obj.expression_id,
              },
            });

          }
        }

      }

    }


    return 111;
  }
}
module.exports = UserService;

