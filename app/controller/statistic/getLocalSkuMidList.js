'use strict';

const Controller = require('egg').Controller;

class ProfitController extends Controller {
  async getLocalSkuMidList() {
    const ctx = this.ctx;
    const profitData = await ctx.service.fulin.getLocalSkuMidList.fetch();
    ctx.body = {
      response: profitData,
    };
    ctx.status = 200;

  }
}

module.exports = ProfitController;
