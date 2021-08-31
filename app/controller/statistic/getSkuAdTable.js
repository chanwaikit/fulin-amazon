'use strict';

const Controller = require('egg').Controller;

class ProfitController extends Controller {
  async getSkuAdTable() {
    const ctx = this.ctx;
    const profitData = await ctx.service.fulin.getSkuAdTable.fetch();
    ctx.body = {
      response: profitData,
    };
    ctx.status = 200;

  }
}

module.exports = ProfitController;
