'use strict';

const Controller = require('egg').Controller;

class ProfitController extends Controller {
  async createTable() {
    const ctx = this.ctx;
    const profitData = await ctx.service.fulin.createLocalSkuMidTable.importTable();
    ctx.body = {
      response: profitData,
    };
    ctx.status = 200;

  }


}

module.exports = ProfitController;
