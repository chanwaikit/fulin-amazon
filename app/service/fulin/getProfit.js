'use strict';
// app/service/user.js
const dayjs = require('dayjs');
const Op = require('sequelize').Op;

// 从 egg 上获取（推荐）
const Service = require('egg').Service;
class UserService extends Service {
  async fetch() {
    const { ctx } = this;
    const profitTable = ctx.model.Fulin.ProfitStatistic;
    const productTable = ctx.model.Fulin.ProductExpression;
    const adGroupTable = ctx.model.Fulin.AdGroup;

    const sbCampaignTable = ctx.model.Fulin.SbCampaign;
    const skuTable = ctx.model.Fulin.SkuList;

    const { startDate, endDate } = ctx.request.body;

    const Sku = await skuTable.findAll({
      include: [
        {
          model: adGroupTable,
          include: [{
            model: sbCampaignTable,
            where: {
              date_str: {
                [Op.between]: [ startDate, endDate ],
              },
            },
            required: false,
          }],
        },
        {
          model: profitTable,
          include: [{
            model: productTable,
          }],
          where: {
            date_str: {
              [Op.between]: [ startDate, endDate ],
            },
          },
          required: false,
        },
      ],
      where: {
        // local_sku_sid: 'DVD3621_Black_UK_ELECTCOM_114',
        // date_str: {
        //   [Op.between]: [ startDate, endDate ],
        // },
      },
    });

    const keyArrays = [];
    const obj = {};
    const result = [];


    Sku.map((item, index) => {
      const adGroups = item.ad_groups || [];
      const profitStatistics = item.profit_statistics || [];
      let sbvObj = {};
      const sbObj = {};
      let profit = {};
      adGroups.map(element => {
        const type = element.type;
        let clicks = 0,
          cost = 0,
          currency_code = '',
          impressions = 0,
          order_num = 0,
          sales_amount = 0;
        element.sb_campaigns.map(sbItem => {
          clicks += Number(sbItem.clicks);
          cost += Number(sbItem.cost);
          currency_code = sbItem.currency_code;
          impressions += Number(sbItem.impressions);
          order_num += Number(sbItem.order_num);
          sales_amount += Number(sbItem.sales_amount);
          return sbItem;
        });
        if (type == 'sbv') {
          sbvObj = { sbvClicks: clicks.toFixed(2), sbvCost: cost.toFixed(2), sbvCurrencyCode: currency_code, sbvImpressions: impressions, sbvOrderNum: order_num, sbvSalesAmount: sales_amount.toFixed(2) };
        } else {
          sbvObj = { sbClicks: clicks.toFixed(2), sbCost: cost.toFixed(2), sbCurrencyCode: currency_code, sbImpressions: impressions, sbOrderNum: order_num, sbSalesAmount: sales_amount.toFixed(2) };
        }
      });


      let total_amount = 0,
        total_volume = 0,
        replenishment_num = 0,
        refund_num = 0,
        refund_amount = 0,
        fba_shipment = 0,
        multi_channel_fee = 0,
        commission_amount = 0,
        promotion_amount = 0,
        order_quantity = 0,
        sales_amount = 0,
        total_spend = 0,
        cg_price_amazon_order = 0,
        cg_price_replenishment = 0,
        cg_transport_costs_amazon_order = 0,
        cg_transport_costs_replenishment = 0,
        other_order_fee = 0,
        gross_profit = 0,
        volume = 0,
        sessions = 0;
      profitStatistics.map(element => {
        const item = {
          ...(element.dataValues && element.dataValues.product_expression && element.dataValues.product_expression.dataValues ? element.dataValues.product_expression.dataValues : {}),
          ...element.dataValues,
        };
        delete item.product_expression;
        total_amount += Number(item.total_amount || 0);
        total_volume += Number(item.total_volume || 0);
        replenishment_num += Number(item.replenishment_num || 0);
        refund_num += Number(item.refund_num || 0);
        refund_amount += Number(item.refund_amount || 0);
        fba_shipment += Number(item.fba_shipment || 0);
        multi_channel_fee += Number(item.multi_channel_fee || 0);
        commission_amount += Number(item.commission_amount || 0);
        promotion_amount += Number(item.promotion_amount || 0);
        order_quantity += Number(item.order_quantity || 0);
        sales_amount += Number(item.sales_amount || 0);
        total_spend += Number(item.total_spend || 0);
        cg_price_amazon_order += Number(item.cg_price_amazon_order || 0);
        cg_price_replenishment += Number(item.cg_price_replenishment || 0);
        cg_transport_costs_amazon_order += Number(item.cg_transport_costs_amazon_order || 0);
        cg_transport_costs_replenishment += Number(item.cg_transport_costs_replenishment || 0);
        other_order_fee += Number(item.other_order_fee || 0);
        gross_profit += Number(item.gross_profit || 0);
        volume += Number(item.volume || 0);
        sessions += Number(item.sessions || 0);

        profit = {
          ...item,
          total_amount: total_amount.toFixed(2),
          total_volume: total_volume.toFixed(2),
          replenishment_num: replenishment_num.toFixed(2),
          refund_num: refund_num.toFixed(2),
          refund_amount: refund_amount.toFixed(2),
          fba_shipment: fba_shipment.toFixed(2),
          multi_channel_fee: multi_channel_fee.toFixed(2),
          commission_amount: commission_amount.toFixed(2),
          promotion_amount: promotion_amount.toFixed(2),
          order_quantity: order_quantity.toFixed(2),
          sales_amount: sales_amount.toFixed(2),
          total_spend: total_spend.toFixed(2),
          cg_price_amazon_order: cg_price_amazon_order.toFixed(2),
          cg_price_replenishment: cg_price_replenishment.toFixed(2),
          cg_transport_costs_amazon_order: cg_transport_costs_amazon_order.toFixed(2),
          cg_transport_costs_replenishment: cg_transport_costs_replenishment.toFixed(2),
          other_order_fee: other_order_fee.toFixed(2),
          gross_profit: gross_profit.toFixed(2),
          volume: volume.toFixed(2),
          sessions: sessions.toFixed(2),
        };
        return item;
      });
      result.push({
        ...sbvObj,
        ...sbObj,
        ...profit,
      });
    });


    return result;
  }
}
module.exports = UserService;

