'use strict';
// app/service/user.js
const dayjs = require('dayjs');
const Op = require('sequelize').Op;

// 从 egg 上获取（推荐）
const Service = require('egg').Service;
class UserService extends Service {
  async updateAdGroup() {
    const { ctx } = this;

    const { sbGroups = [], spGroups = [], local_sku_mid = '', cid, category_text } = ctx.request.body;
    let sbGroupList = await ctx.model.Fulin.LocalSkuMidSbGroup.findAll();


    sbGroupList = sbGroupList.map(el => el.get({ plain: true }));


    await ctx.model.Fulin.SpGroup.update({
      local_sku_sid: '',
      local_sku_mid: '',
      mid: '',
    }, {
      where: {
        local_sku_mid,
      },
    });

    await ctx.model.Fulin.LocalSkuMidThroughSbTable.destroy({ where: {
      local_sku_mid,
    } });
    for (let i = 0; i < sbGroups.length; i++) {
      const sbGroupObj = sbGroupList.filter(item => {
        return item.portfolio_id == sbGroups[i].portfolio_id;
      })[0] || {};
      await ctx.model.Fulin.LocalSkuMidThroughSbTable.create({
        portfolio_id: sbGroups[i].portfolio_id,
        local_sku_sid: sbGroups[i].local_sku_sid,
        name: sbGroupObj.name,
        local_sku_mid,
        cid,
        category_text,
      });
    }


    for (let i = 0; i < spGroups.length; i++) {
      const spObj = await ctx.model.Fulin.SpGroup.findByPk(spGroups[i].portfolio_id);
      if (spObj) {
        await ctx.model.Fulin.SpGroup.update({
          ...spObj,
          local_sku_sid: spGroups[i].local_sku_sid,
          local_sku_mid,
          cid,
          category_text,
        }, {
          where: {
            portfolio_id: spGroups[i].portfolio_id,
          },
        });
      }
    }

    return sbGroups;
  }


  async fetch() {
    const { ctx } = this;
    const sbGroupTable = ctx.model.Fulin.LocalSkuMidSbGroup;
    const spGroupTable = ctx.model.Fulin.SpGroup;

    const shopListTable = ctx.model.Fulin.ShopList;
    const { mid, type } = ctx.request.body;
    const SbGroup = await sbGroupTable.findAll({
      include: [
        {
          model: shopListTable,
          where: {
            mid,
          },
          // include: [{
          //   model: sbCampaignTable,
          //   where: {
          //     date_str: {
          //       [Op.between]: [ startDate, endDate ],
          //     },
          //   },
          //   required: false,
          // }],
          // required: false,

        },
      ],
      // where: {
      //   type,
      // },
      // limit: 10,
    });

    const SpGroup = await spGroupTable.findAll({
      include: [
        {
          model: shopListTable,
          where: {
            mid,
          },
          // include: [{
          //   model: sbCampaignTable,
          //   where: {
          //     date_str: {
          //       [Op.between]: [ startDate, endDate ],
          //     },
          //   },
          //   required: false,
          // }],
          // required: false,

        },
      ],
      // where: {
      //   type,
      // },
      // limit: 10,
    });

    const result = [];
    SbGroup.map(item => {
      const { name, country, mid } = item.dataValues.shop_list;
      const element = {
        shopName: name,
        country,
        mid,
        ...item.dataValues,
      };
      delete element.shop_list;
      result.push(element);
      return element;
    });

    SpGroup.map(item => {
      const { name, country, mid } = item.dataValues.shop_list;
      const element = {
        shopName: name,
        country,
        mid,
        ...item.dataValues,
      };
      delete element.shop_list;
      result.push(element);
      return element;
    });

    return result;
  }
}
module.exports = UserService;

