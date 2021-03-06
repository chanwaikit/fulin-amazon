'use strict';
// app/service/user.js
const dayjs = require('dayjs');
// const Op = require('sequelize').Op;

// 从 egg 上获取（推荐）
const Service = require('egg').Service;
const { QueryTypes, Op } = require('sequelize');
class UserService extends Service {
  async getOneSkuWeekStatistic() {
    return await this.getSkuWeekStatistic();
  }
  async getSkuWeekStatistic() {
    const { ctx } = this;

    const { startDate, endDate } = ctx.request.body;
    const startDateMs = dayjs(startDate).valueOf();
    const endDateMs = dayjs(endDate).valueOf();
    const days = (endDateMs - startDateMs) / 60 / 60 / 1000 / 24 + 1;
    const daysArray = [];
    for (let i = 0; i < days; i++) {
      if (i % 7 === 0) {
        const pStartDateMs = startDateMs + i * 60 * 60 * 24 * 1000;
        const pEndDateMs = (pStartDateMs + 6 * 24 * 60 * 60 * 1000) > endDateMs ? endDateMs : (pStartDateMs + 6 * 24 * 60 * 60 * 1000);
        daysArray.push({
          date_str: dayjs(startDateMs + i * 60 * 60 * 24 * 1000).format('YYYY-MM-DD'),
          startDateMs: pStartDateMs,
          endDateMs: pEndDateMs,
          start_date_str: dayjs(startDateMs + i * 60 * 60 * 24 * 1000).format('YYYY-MM-DD'),
          end_date_str: dayjs(pEndDateMs).format('YYYY-MM-DD'),

        });
      }
    }
    const promiseArray = [];
    const self = this;


    let skuWeekData = [];
    await Promise.all(daysArray.map(item => {
      return this.fetch(item.start_date_str, item.end_date_str);
    })).then(res => {
      skuWeekData = res;
    });
    return {
      daysArray,
      skuWeekData,
    };
  }

  async getAdStatistic() {
    const { ctx } = this;
    const { startDate, endDate } = ctx.request.body;
    const skuTable = ctx.model.Fulin.SkuList;
    const sbCampaignTable = ctx.model.Fulin.SbCampaign;
    const spCampaignTable = ctx.model.Fulin.SpCampaign;
    const sdCampaignTable = ctx.model.Fulin.SdCampaign;

    // const users = await ctx.model.query("SELECT date_format(date_str,'%Y-%m-%d') weeks,count(*) from `sb_campaigns` group by weeks", { type: QueryTypes.SELECT });
    // console.log(19999, ctx.model.query);

    // const users = await ctx.model.query('SELECT date_str weekofyear(date_str) AS week_id, from `sb_campaigns` ', { type: QueryTypes.SELECT });

    //  const users = await ctx.model.query('SELECT weekofyear(date_str) as w,count(*) from `sb_campaigns` ', { type: QueryTypes.SELECT });

    const startDateMs = dayjs(startDate).valueOf();
    const endDateMs = dayjs(endDate).valueOf();
    const days = (endDateMs - startDateMs) / 60 / 60 / 1000 / 24 + 1;

    // sku_sb_tables

    let skuSb = await ctx.model.Fulin.SkuListSbGroup.findAll({
      include: [
        {
          model: skuTable,
          required: false,
        },
        {
          separate: true,
          model: sbCampaignTable,
          where: {
            date_str: {
              [Op.between]: [ startDate, endDate ],
            },
          },
          required: false,
        },
      ],
    });

    let skuSpSd = await ctx.model.Fulin.SkuList.findAll({
      include: [
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
      ],
    });

    let categories = await ctx.model.Fulin.Category.findAll();

    skuSpSd = skuSpSd.map(el => el.get({ plain: true }));
    categories = categories.map(el => el.get({ plain: true }));

    skuSb = skuSb.map(el => el.get({ plain: true }));


    const obj = {}; // 数组去重  SB广告
    skuSb = skuSb.reduce(function(item, next) {
      obj[next.portfolio_id] ? '' : obj[next.portfolio_id] = true && item.push(next);
      return item;
    }, []);


    const adDayObj = { // {"2021-07-01":[]}

    };
    const result = [];
    for (let i = 0; i < days; i++) {
      adDayObj[dayjs(startDateMs + i * 24 * 60 * 60 * 1000).format('YYYY-MM-DD')] = [];
    }


    skuSpSd.map(item => {
      item.sp_campaigns.map(element => {
        if (adDayObj[element.date_str]) {
          const obj = {
            ...element,
            ...item,
            type: 'sp',
          };
          delete obj.sp_campaigns;
          delete obj.sd_campaigns;
          adDayObj[element.date_str].push(obj);
          result.push(obj);
        }
        return element;
      });

      item.sd_campaigns.map(element => {
        if (adDayObj[element.date_str]) {
          const obj = {
            ...element,
            ...item,
            type: 'sd',

          };
          delete obj.sp_campaigns;
          delete obj.sd_campaigns;
          adDayObj[element.date_str].push(obj);
          result.push(obj);

        }
        return element;
      });
    });

    skuSb.map(item => {
      if (item.sku_list) { // 存在脏数据，有广告，但是无单子 原因是没有全的sku列表
        item.sb_campaigns.map(element => {
          if (adDayObj[element.date_str]) {
            const obj = {
              ...element,
              category_text: item.sku_list ? item.sku_list.category_text : '',
              cid: item.sku_list ? item.sku_list.cid : '',
              ...item,
            };

            delete obj.sb_campaigns;
            delete obj.sku_list;

            adDayObj[element.date_str].push(obj);

            result.push(obj);

          }
          return element;
        });
      }
    });

    const daysArray = [];
    for (let i = 0; i < days; i++) {
      if (i % 7 === 0) {
        daysArray.push({
          date_str: dayjs(startDateMs + i * 60 * 60 * 24 * 1000).format('YYYY-MM-DD'),
          startDateMs: startDateMs + i * 60 * 60 * 24 * 1000,
        });
      }
    }
    categories.map(item => {
      const pDaysArray = [ ...daysArray ];
      const weekAds = [];
      const adData = result.filter(element => item.cid == element.cid).sort((a, b) => dayjs(a.date_str) - dayjs(b.date_str));
      pDaysArray.map(element => {
        const allAds = adData.filter(child => {
          return dayjs(child.date_str).valueOf() >= element.startDateMs && dayjs(child.date_str).valueOf() < element.startDateMs + 7 * 24 * 60 * 60 * 1000;
        });
        const weekObj = {
          date_str: element.date_str,
          cost: 0,
          sales_amount: 0,
        };
        allAds.map(element => {
          weekObj.cost += Number(element.total_cost || element.cost || 0);
          weekObj.sales_amount += Number(element.total_sales_amount || element.sales_amount || 0);

        });
        weekObj.cost = weekObj.cost.toFixed(2);
        weekObj.sales_amount = weekObj.sales_amount.toFixed(2);

        weekAds.push(weekObj);
      });

      item.weekAds = weekAds;
      item.total_cost = 0;
      item.total_sales_amount = 0;
      adData.map(element => {
        item.total_cost += Number(element.total_cost || element.cost || 0);
        item.total_sales_amount += Number(element.total_sales_amount || element.sales_amount || 0);
      });

      item.total_cost = item.total_cost.toFixed(2);
      item.total_sales_amount = item.total_sales_amount.toFixed(2);
    });
    let cost_sum = 0;
    let sales_amount_sum = 0;
    categories.map(element => {
      cost_sum += Number(element.total_cost);
      sales_amount_sum += Number(element.total_sales_amount);
    });
    return {
      cost_sum: cost_sum.toFixed(2),
      sales_amount_sum: sales_amount_sum.toFixed(2),
      categories,
      x_axis: daysArray.map(element => element.date_str),
    };
  }

  async getSkuData(start_date_str, end_date_str) {
    const { ctx } = this;

    const profitTable = ctx.model.Fulin.ProfitStatistic;
    const productTable = ctx.model.Fulin.ProductExpression;
    const sbGroupTable = ctx.model.Fulin.SbGroup;

    const spCampaignTable = ctx.model.Fulin.SpCampaign;
    const sbCampaignTable = ctx.model.Fulin.SbCampaign;
    const sdCampaignTable = ctx.model.Fulin.SdCampaign;

    const skuTable = ctx.model.Fulin.SkuList;

    let { startDate, endDate, cid, mid, local_sku } = ctx.request.body;
    if (start_date_str) {
      startDate = start_date_str;
    }
    if (end_date_str) {
      endDate = end_date_str;
    }
    const where = {
      ...(cid ? { cid } : {}),
      ...(mid ? { mid } : {}),
      ...(local_sku ? { local_sku } : {}),
    };
    return await skuTable.findAll({
      where,
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
  async fetch(start_date_str, end_date_str) {


    const Sku = await this.getSkuData(start_date_str, end_date_str);

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

      // if (el.local_sku === 'DVD-225_Black_UK_ELECTCOM') {
      //   console.log(444, el, el.fba_shipment);
      // }
      // if (el.local_sku === 'CD06B_White_US_VENLOIC') {
      //   console.log(254, el, el.fba_shipment);
      // }

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
module.exports = UserService;

