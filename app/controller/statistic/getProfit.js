'use strict';

const Controller = require('egg').Controller;

class ProfitController extends Controller {
  async profitLists() {
    const ctx = this.ctx;
    const profitData = await ctx.service.fulin.getProfit.fetch();
    ctx.body = {
      response: profitData,
    };
    ctx.status = 200;

  }
}

module.exports = ProfitController;
