'use strict';
// app/service/user.js
const dayjs = require('dayjs');
const Op = require('sequelize').Op;

// 从 egg 上获取（推荐）
const Service = require('egg').Service;
class UserService extends Service {
  async fetch() {
    const { ctx } = this;

    const LocalSkuMidList = ctx.model.Fulin.LocalSkuMidList;

    let Sku = await LocalSkuMidList.findAll();
    Sku = Sku.map(el => el.get({ plain: true }));

    return Sku;
  }
}
module.exports = UserService;

