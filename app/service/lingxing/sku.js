'use strict';
// app/service/user.js
const dayjs = require('dayjs');
// 从 egg 上获取（推荐）
const Service = require('egg').Service;
class UserService extends Service {
  async fetch() {
    const { ctx } = this;

    const result = await ctx.model.Fulin.ProfitStatistic.findAll();

    console.log(12, result[0]);
    for (let i = 0; i < result.length; i++) {
      const obj = {
        pid_sid: result[i].dataValues.local_sku_sid,
        asin: result[i].dataValues.asin1,
        sid: result[i].dataValues.sid,
        pid: result[i].dataValues.pid_sid,
        local_sku: result[i].dataValues.local_sku,
        local_name: result[i].dataValues.local_name,
        local_sku_sid: result[i].dataValues.local_sku_sid,
        mid: result[i].dataValues.mid,
        sku: '',
      };
      const SkuObj = await ctx.model.Fulin.SkuList.findByPk(result[i].dataValues.local_sku_sid);


      if (!SkuObj) {
        await ctx.model.Fulin.SkuList.create(obj);
      }
    }

    return result.length;
  }
}
module.exports = UserService;

