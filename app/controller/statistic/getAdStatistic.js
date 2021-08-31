'use strict';

const Controller = require('egg').Controller;

class ProfitController extends Controller {
  async getAdStatistic() {
    const ctx = this.ctx;
    const profitData = await ctx.service.fulin.getProfit.getAdStatistic();
    ctx.body = {
      response: profitData,
    };
    ctx.status = 200;

  }
  async getAllStatistic() {
    const ctx = this.ctx;
    const profitData = await ctx.service.fulin.statistic.index.getAllStatistic();
    ctx.body = {
      response: profitData,
    };
    ctx.status = 200;

  }
  async getCountryStatistic() {
    const ctx = this.ctx;
    const profitData = await ctx.service.fulin.statistic.index.getCountryStatistic();
    ctx.body = {
      response: profitData,
    };
    ctx.status = 200;

  }

  async getSkuStatistic() {
    const ctx = this.ctx;
    const profitData = await ctx.service.fulin.statistic.index.getSkuStatistic();
    ctx.body = {
      response: profitData,
    };
    ctx.status = 200;

  }
}

module.exports = ProfitController;
