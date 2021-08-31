'use strict';

const Controller = require('egg').Controller;

class ProfitController extends Controller {
  async getAdGroup() {
    const ctx = this.ctx;
    const profitData = await ctx.service.fulin.getAdGroup.fetch();
    ctx.body = {
      response: profitData,
    };
    ctx.status = 200;

  }


  async updateAdGroup() {
    const ctx = this.ctx;
    const profitData = await ctx.service.fulin.getAdGroup.updateAdGroup();
    ctx.body = {
      response: profitData,
    };
    ctx.status = 200;

  }

}

module.exports = ProfitController;
