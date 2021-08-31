'use strict';
// app/service/user.js
const dayjs = require('dayjs');
// const Op = require('sequelize').Op;

// 从 egg 上获取（推荐）
const Service = require('egg').Service;
const { QueryTypes, Op } = require('sequelize');
class CreateTable extends Service {

  async importTable() {
    const { ctx } = this;
    const nowTime = new Date().getTime() - 20 * 24 * 60 * 60 * 1000;
    let tableData = [];
    for (let k = 0; k < 60; k++) {
      const date_str = dayjs(nowTime - 24 * 60 * 60 * 1000 * k).format('YYYY-MM-DD');
      tableData = await this.fetch(date_str, date_str);
      console.log(17, tableData);
      tableData.map(item => {
        item.local_sku_mid_date = item.local_sku + '_' + item.mid + '_' + item.date_str;
      });
      await ctx.model.Fulin.LocalSkuMidDate.bulkCreate(tableData, { updateOnDuplicate: [ 'local_sku_mid_date' ] });

    }
    return tableData;
  }
  async getSkuData(startDate, endDate) {
    const { ctx } = this;

    const profitTable = ctx.model.Fulin.ProfitStatistic;
    const productTable = ctx.model.Fulin.ProductExpression;
    const sbGroupTable = ctx.model.Fulin.SbGroup;

    const spCampaignTable = ctx.model.Fulin.SpCampaign;
    const sbCampaignTable = ctx.model.Fulin.SbCampaign;
    const sdCampaignTable = ctx.model.Fulin.SdCampaign;

    const skuTable = ctx.model.Fulin.SkuList;

    // const { startDate, endDate, cid, mid, local_sku } = ctx.request.body;

    // const where = {
    //   ...(cid ? { cid } : {}),
    //   ...(mid ? { mid } : {}),
    //   ...(local_sku ? { local_sku } : {}),
    // };
    return await skuTable.findAll({
      // where,
      include: [
        {
          model: sbGroupTable,
          include: [{
            model: sbCampaignTable,
            where: {
              date_str: {
                [Op.between]: [ startDate, endDate ],
              },
            },
            required: false,
          }],
          required: false,

        },
        {
          separate: true,
          model: spCampaignTable,
          where: {
            date_str: {
              [Op.between]: [ startDate, endDate ],
            },
          },
          required: false,
        },
        {
          separate: true,
          model: sdCampaignTable,
          where: {
            date_str: {
              [Op.between]: [ startDate, endDate ],
            },
          },
          required: false,
        },
        {
          separate: true,
          model: profitTable,
          where: {
            date_str: {
              [Op.between]: [ startDate, endDate ],
            },
          },
          required: false,
        },
        {
          separate: true,
          model: productTable,
          where: {
            date_str: {
              [Op.between]: [ startDate, endDate ],
            },
          },
          required: false,
        },

      ],
      // limit: 10,
    });
  }
  async fetch(startDate, endDate) {
    const Sku = await this.getSkuData(startDate, endDate);
    const result = [];
    Sku.map(item => {
      const sbGroups = item.sb_groups || [];
      const profitStatistics = item.profit_statistics || [];
      const productExpressions = item.product_expressions;
      const spCampaigns = item.sp_campaigns || [];
      const sdCampaigns = item.sd_campaigns || [];

      let sbvObj = {};
      let sbObj = {};
      let product = {};
      let profit = {};
      const spObj = {
        spClicks: 0,
        spImpressions: 0,
        spOrderNum: 0,
        spSalesAmount: 0,
        spCost: 0,

      };

      const sdObj = {
        sdClicks: 0,
        sdImpressions: 0,
        sdOrderNum: 0,
        sdSalesAmount: 0,
        sdCost: 0,

      };

      sbGroups.map(element => {
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
          sbObj = { sbPortfolioId: element.portfolio_id, sbClicks: clicks.toFixed(2), sbCost: cost.toFixed(2), sbCurrencyCode: currency_code, sbImpressions: impressions, sbOrderNum: order_num, sbSalesAmount: sales_amount.toFixed(2) };
        }
        return element;
      });


      spCampaigns.map(element => {
        const { total_clicks = 0, total_cost = 0, total_impressions = 0, total_order_quantity = 0, total_sales_amount = 0 } = element;
        spObj.spClicks += Number(total_clicks);
        spObj.spImpressions += Number(total_impressions);
        spObj.spOrderNum += Number(total_order_quantity);
        spObj.spSalesAmount += Number(total_sales_amount);
        spObj.spCost = Number(Number(spObj.spCost + Number(total_cost)).toFixed(2));

      });


      sdCampaigns.map(element => {
        const { total_clicks = 0, total_cost = 0, total_impressions = 0, total_order_quantity = 0, total_sales_amount = 0 } = element;
        sdObj.sdClicks += Number(total_clicks);
        sdObj.sdImpressions += Number(total_impressions);
        sdObj.sdOrderNum += Number(total_order_quantity);
        sdObj.sdSalesAmount += Number(total_sales_amount);
        sdObj.sdCost = Number(Number(sdObj.sdCost + Number(total_cost)).toFixed(2));

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


      productExpressions.map(element => {
        volume += Number(element.volume || 0);
        sessions += Number(element.sessions || 0);
        product = {
          ...element.dataValues,
          sessions,
          volume,
        };
      });


      profitStatistics.map(element => {
        total_amount += Number(element.total_amount || 0);
        total_volume += Number(element.total_volume || 0);
        replenishment_num += Number(element.replenishment_num || 0);
        refund_num += Number(element.refund_num || 0);
        refund_amount += Number(element.refund_amount || 0);
        fba_shipment += Number(element.fba_shipment || 0);
        multi_channel_fee += Number(element.multi_channel_fee || 0);
        commission_amount += Number(element.commission_amount || 0);
        promotion_amount += Number(element.promotion_amount || 0);
        order_quantity += Number(element.order_quantity || 0);
        sales_amount += Number(element.sales_amount || 0);
        total_spend += Number(element.total_spend || 0);
        cg_price_amazon_order += Number(element.cg_price_amazon_order || 0);
        cg_price_replenishment += Number(element.cg_price_replenishment || 0);
        cg_transport_costs_amazon_order += Number(element.cg_transport_costs_amazon_order || 0);
        cg_transport_costs_replenishment += Number(element.cg_transport_costs_replenishment || 0);
        other_order_fee += Number(element.other_order_fee || 0);
        gross_profit += Number(element.gross_profit || 0);
        // volume += Number(element.volume || 0);
        // sessions += Number(element.sessions || 0);

        profit = {
          ...element.dataValues,
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

      const resultObj = {
        ...item.dataValues,
        ...spObj,
        ...sdObj,
        ...sbvObj,
        ...sbObj,
        ...product,
        ...profit,
      };
      delete resultObj.product_expressions;
      delete resultObj.profit_statistics;

      result.push(resultObj);


      result.map(element => {
        if (element.sbPortfolioId) {
          let totalVolume = 0;
          const filterArray = result.filter(obj => {
            return obj.sbPortfolioId === element.sbPortfolioId;
          }) || [];
          filterArray.map(obj => {
            totalVolume += Number(obj.total_volume);
          });
          const ratio = Number(element.total_volume) / totalVolume;

          element.ratio = ratio;
          element.allTotalVolume = totalVolume;
          element.sbSkuClicks = (ratio * Number(element.sbClicks)).toFixed(0);
          element.sbSkuCost = (ratio * Number(element.sbCost)).toFixed(2);
          element.sbSkuSalesAmount = (ratio * Number(element.sbSalesAmount)).toFixed(2);

          element.sbSkuImpressions = (ratio * Number(element.sbImpressions)).toFixed(0);
          element.sbSkuOrderNum = (ratio * Number(element.sbOrderNum)).toFixed(0);
        }
        return element;
      });
    });


    const newResult = []; // result 是以SKU+SID 店铺id来计算，newResult是以SKU+MID 国家来计算
    result.forEach(el => {
      const res = newResult.findIndex(ol => {
        return el.local_sku + '_' + el.mid == ol.local_sku + '_' + ol.mid;
      });

      if (el.fba_shipment) { // 有效数据
        if (res !== -1) {
          newResult[res].local_sku_mid = el.local_sku + '_' + el.mid;
          newResult[res].total_volume = Number(newResult[res].total_volume || 0) + Number(el.total_volume || 0);
          newResult[res].total_amount = Number(newResult[res].total_amount || 0) + Number(el.total_amount || 0);
          newResult[res].gross_profit = Number(newResult[res].gross_profit || 0) + Number(el.gross_profit || 0);
          newResult[res].volume = Number(newResult[res].volume || 0) + Number(el.volume || 0);

          newResult[res].spOrderNum = Number(newResult[res].spOrderNum || 0) + Number(el.spOrderNum || 0);
          newResult[res].spImpressions = Number(newResult[res].spImpressions || 0) + Number(el.spImpressions || 0);
          newResult[res].spCost = Number(newResult[res].spCost || 0) + Number(el.spCost || 0);
          newResult[res].spClicks = Number(newResult[res].spClicks || 0) + Number(el.spClicks || 0);
          newResult[res].spSalesAmount = Number(newResult[res].spSalesAmount || 0) + Number(el.spSalesAmount || 0);

          newResult[res].sbClicks = Number(newResult[res].sbClicks || 0) + Number(el.sbClicks || 0);
          newResult[res].sbCost = Number(newResult[res].sbCost || 0) + Number(el.sbCost || 0);
          newResult[res].sbImpressions = Number(newResult[res].sbImpressions || 0) + Number(el.sbImpressions || 0);
          newResult[res].sbOrderNum = Number(newResult[res].sbOrderNum || 0) + Number(el.sbOrderNum || 0);
          newResult[res].sbSalesAmount = Number(newResult[res].sbSalesAmount || 0) + Number(el.sbSalesAmount || 0);
          newResult[res].sbSkuClicks = Number(newResult[res].sbSkuClicks || 0) + Number(el.sbSkuClicks || 0);
          newResult[res].sbSkuCost = Number(newResult[res].sbSkuCost || 0) + Number(el.sbSkuCost || 0);
          newResult[res].sbSkuImpressions = Number(newResult[res].sbSkuImpressions || 0) + Number(el.sbSkuImpressions || 0);
          newResult[res].sbSkuOrderNum = Number(newResult[res].sbSkuOrderNum || 0) + Number(el.sbSkuOrderNum || 0);
          newResult[res].sbvClicks = Number(newResult[res].sbvClicks || 0) + Number(el.sbvClicks || 0);
          newResult[res].sbvCost = Number(newResult[res].sbvCost || 0) + Number(el.sbvCost || 0);
          newResult[res].sbvImpressions = Number(newResult[res].sbvImpressions || 0) + Number(el.sbvImpressions || 0);
          newResult[res].sbvSalesAmount = Number(newResult[res].sbvSalesAmount || 0) + Number(el.sbvSalesAmount || 0);
          newResult[res].sessions = Number(newResult[res].sessions || 0) + Number(el.sessions || 0);


        } else {
          newResult.push({
            ...el,
            local_sku_mid: el.local_sku + '_' + el.mid,
          });
        }
      }

    });

    return newResult;
  }
}
module.exports = CreateTable;

