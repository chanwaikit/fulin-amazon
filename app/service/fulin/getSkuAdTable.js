'use strict';
// app/service/user.js
const dayjs = require('dayjs');
const Op = require('sequelize').Op;

// 从 egg 上获取（推荐）
const Service = require('egg').Service;
class UserService extends Service {
  async fetch() {
    const { ctx } = this;
    const sbGroupTable = ctx.model.Fulin.LocalSkuMidSbGroup;
    const spGroupTable = ctx.model.Fulin.SpGroup;

    const LocalSkuMidList = ctx.model.Fulin.LocalSkuMidList;
    let shopList = await ctx.model.Fulin.ShopList.findAll();


    let Sku = await LocalSkuMidList.findAll({
      include: [
        {
          model: sbGroupTable,
          required: false,

        },
        {
          model: spGroupTable,
          required: false,

        },
      ],
      // limit: 10,
    });
    Sku = Sku.map(el => el.get({ plain: true }));
    shopList = shopList.map(el => el.get({ plain: true }));
    const pSku = [];
    Sku.map(item => {
      const pSbGroups = [];
      const pSpGroups = [];

      item.local_sku_mid_sb_groups.map(element => {
        const shopName = (shopList.filter(shop => {
          return shop.sid == element.sid;
        })[0] || {}).name;
        pSbGroups.push({
          ...element,
          shopName,
        });
      });

      item.sp_groups.map(element => {
        const shopName = (shopList.filter(shop => {
          return shop.sid == element.sid;
        })[0] || {}).name;
        pSpGroups.push({
          ...element,
          shopName,
        });
      });

      const pItem = { ...item, sb_groups: pSbGroups, sp_groups: pSpGroups };
      delete pItem.local_sku_mid_sb_groups;
      pSku.push(pItem);
      return pItem;
    });
    return pSku;
  }
}
module.exports = UserService;

