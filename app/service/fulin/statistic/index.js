'use strict';
// app/service/user.js
const dayjs = require('dayjs');
// const Op = require('sequelize').Op;

// 从 egg 上获取（推荐）
const Service = require('egg').Service;
const { QueryTypes, Op } = require('sequelize');
class UserService extends Service {
  getDayArray(startDate, endDate) {
    const startDateMs = dayjs(startDate).valueOf();
    const endDateMs = dayjs(endDate).valueOf();
    const days = (endDateMs - startDateMs) / 60 / 60 / 1000 / 24 + 1;
    const daysArray = [];
    // const LocalSkuMidProfitList = ctx.model.Fulin.LocalSkuMidProfitList;
    const x_axis = [];
    for (let i = 0; i < days; i++) {
      if (i % 7 === 0) {
        const pStartDateMs = startDateMs + i * 60 * 60 * 24 * 1000;
        const pEndDateMs = (pStartDateMs + 6 * 24 * 60 * 60 * 1000) > endDateMs ? endDateMs : (pStartDateMs + 6 * 24 * 60 * 60 * 1000);
        x_axis.push(dayjs(startDateMs + i * 60 * 60 * 24 * 1000).format('YYYY-MM-DD'));
        daysArray.push({
          date_str: dayjs(startDateMs + i * 60 * 60 * 24 * 1000).format('YYYY-MM-DD'),
          // startDateMs: pStartDateMs,
          // endDateMs: pEndDateMs,
          start_date_str: dayjs(startDateMs + i * 60 * 60 * 24 * 1000).format('YYYY-MM-DD'),
          end_date_str: dayjs(pEndDateMs).format('YYYY-MM-DD'),

        });
      }
    }
    return {
      daysArray,
      x_axis,
    };
  }

  async getSkuStatistic() {
    const { ctx } = this;

    const { startDate, endDate, cid, mid, local_sku } = ctx.request.body;
    const { daysArray, x_axis } = this.getDayArray(startDate, endDate);

    let skuList = await ctx.model.Fulin.LocalSkuMidList.findAll({
      where: {
        ...(cid ? { cid } : {}),
        ...(mid ? { mid } : {}),
        ...(local_sku ? { local_sku } : {}),

      },
    });
    skuList = skuList.map(el => el.get({ plain: true }));
    let rateList = await ctx.model.Fulin.RateList.findAll();

    rateList = rateList.map(el => el.get({ plain: true }));
    const rateEnum = {};
    rateList.map(item => {
      rateEnum[item.code_date] = item;
    });

    const fetchData = await this.fetch(startDate, endDate, cid, mid); // 总数据
    const pSkuList = skuList.map((sku, iii) => {
      const skuData = fetchData.filter(element => {
        return sku.local_sku_mid === element.local_sku_mid;
      });
      // sku.data = [];
      sku.title = sku.local_sku;

      sku.cost = 0;
      sku.ad_orders = 0;
      sku.sales_amount = 0;
      sku.total_volume = 0;
      sku.ad_sales_amount = 0;


      sku.spCost = 0;
      sku.spOrderNum = 0;
      sku.spImpressions = 0;
      sku.spClicks = 0;
      sku.spSalesAmount = 0;
  		sku.sbSkuCost = 0;
      sku.sbSkuOrderNum = 0;
      sku.sbSkuImpressions = 0;
      sku.sbSkuClicks = 0;
      sku.sbSkuSalesAmount = 0;
  		sku.sbvCost = 0;
      sku.sbvOrderNum = 0;
      sku.sbvImpressions = 0;
      sku.sbvClicks = 0;
      sku.sbvSalesAmount = 0;
  		sku.dCost = 0;
      sku.sdOrderNum = 0;
      sku.sdImpressions = 0;
      sku.sdClicks = 0;
      sku.sdSalesAmount = 0;

      skuData.map(item => {
        sku.spCost += Number(item.sp_cost || 0);
        sku.spOrderNum += Number(item.sp_orders || 0);
        sku.spImpressions += Number(item.sp_impressions || 0);
        sku.spClicks += Number(item.sp_clicks || 0);
        sku.spSalesAmount += Number(item.sp_sales_amount || 0);


        sku.sbSkuCost += Number(item.sb_cost || 0);
        sku.sbSkuOrderNum += Number(item.sb_orders || 0);
        sku.sbSkuImpressions += Number(item.sb_impressions || 0);
        sku.sbSkuClicks += Number(item.sb_clicks || 0);
        sku.sbSkuSalesAmount += Number(item.sb_sales_amount || 0);

        sku.sbvCost += Number(item.sbv_cost || 0);
        sku.sbvOrderNum += Number(item.sb_orders || 0);
        sku.sbvImpressions += Number(item.sbv_impressions || 0);
        sku.sbvClicks += Number(item.sbv_clicks || 0);
        sku.sbvSalesAmount += Number(item.sbv_sales_amount || 0);


        sku.sdCost += Number(item.sd_cost || 0);
        sku.sdOrderNum += Number(item.sd_orders || 0);
        sku.sdImpressions += Number(item.sd_impressions || 0);
        sku.sdClicks += Number(item.sd_clicks || 0);
        sku.sdSalesAmount += Number(item.sd_sales_amount || 0);
      });

      sku.weekAds = [ ];
      const name = sku.local_sku;
      if (iii === 0)console.log(sku.data);
      sku.weekAds = [];
      daysArray.map((element, jjjj) => {
        const startMs = dayjs(element.start_date_str).valueOf();
        const endMs = dayjs(element.end_date_str).valueOf();
        const filterData = skuData.filter(profitData => {
          const { date_str } = profitData;
          const dateMs = dayjs(date_str).valueOf();
          return dateMs >= startMs && dateMs <= endMs;
        });
        const obj = {
          date_str: element.date_str,
          end_date_str: element.end_date_str,
          start_date_str: element.start_date_str,
          sales_amount: 0,
          gross_profit: 0,
          cost: 0,
          ad_orders: 0,
          ad_clicks: 0,
          weekData: filterData,
          ad_impressions: 0,
        };

        filterData.map(profit => {
          const code_date = profit.code + '_' + dayjs(profit.date_str).format('YYYY-MM');
          const us_rate = Number(rateEnum['USD_' + dayjs(profit.date_str).format('YYYY-MM')].rate || 1);
          const rate = Number(rateEnum[code_date].rate || 1);
          const ratio = (rate / us_rate) || 1;
          const ad_cost = Number(profit.sp_cost || 0) + Number(profit.sb_cost || 0) + Number(profit.sbv_cost || 0) + Number(profit.sd_cost || 0);
          const ad_orders = Number(profit.sp_orders || 0) + Number(profit.sb_orders || 0) + Number(profit.sbv_orders || 0) + Number(profit.sd_orders || 0);
          const ad_clicks = Number(profit.sp_clicks || 0) + Number(profit.sb_clicks || 0) + Number(profit.sbv_clicks || 0) + Number(profit.sd_clicks || 0);
          const ad_impressions = Number(profit.sp_impressions || 0) + Number(profit.sb_impressions || 0) + Number(profit.sbv_impressions || 0) + Number(profit.sd_impressions || 0);
          const gross_profit = Number(profit.total_amount || 0) + Number(profit.refund_amount || 0) + Number(profit.channel_fee || 0) + Number(profit.commission_amount || 0) + Number(profit.promotion_amount || 0) + Number(profit.total_cg_price || 0) + Number(profit.total_cg_transport_costs || 0) + Number(profit.other_order_fee || 0) - ad_cost;


          obj.cost += ad_cost * ratio;
          obj.ad_orders += Number(ad_orders);
          obj.ad_clicks += Number(ad_clicks);
          obj.sales_amount += Number(profit.total_amount) * ratio;
          obj.ad_impressions += Number(ad_impressions);
          obj.gross_profit += Number(gross_profit) * ratio;
          obj.total_acos = (obj.cost / obj.sales_amount) * 100;
          obj.profit_rate = (obj.gross_profit / obj.sales_amount) * 100;
        });


        sku.weekAds.push(obj);

      });

      skuData.map(element => {
        const code_date = element.code + '_' + dayjs(element.date_str).format('YYYY-MM');
        const us_rate = Number(rateEnum['USD_' + dayjs(element.date_str).format('YYYY-MM')].rate || 1);
        const rate = Number(rateEnum[code_date].rate || 1);
        const ratio = (rate / us_rate) || 1;
        const ad_cost = Number(element.sp_cost || 0) + Number(element.sb_cost || 0) + Number(element.sbv_cost || 0) + Number(element.sd_cost || 0);
        const gross_profit = Number(element.total_amount || 0) + Number(element.refund_amount || 0) + Number(element.channel_fee || 0) + Number(element.commission_amount || 0) + Number(element.promotion_amount || 0) + Number(element.total_cg_price || 0) + Number(element.total_cg_transport_costs || 0) + Number(element.other_order_fee || 0) - ad_cost;
        const ad_orders = Number(element.sp_orders || 0) + Number(element.sb_orders || 0) + Number(element.sbv_orders || 0) + Number(element.sd_orders || 0);
        const ad_sales_amount = Number(element.sp_sales_amount || 0) + Number(element.sales_amount || 0) + Number(element.sbv_sales_amount || 0) + Number(element.sd_sales_amount || 0);

        sku.total_volume += Number(element.total_volume);
        sku.gross_profit += Number(gross_profit) * ratio;
        sku.cost += ad_cost * ratio;
        sku.sales_amount += Number(element.total_amount) * ratio;
        sku.ad_sales_amount += Number(ad_sales_amount) * ratio;
        sku.cid = element.cid;
        sku.mid = element.mid;
        sku.ad_orders += ad_orders;
        sku.ratio = ratio;

        // sku.data.push(element);
      });


      return sku;
    });
    pSkuList.sort((a, b) => b.sales_amount - a.sales_amount);
    return {
      categories: pSkuList,

      x_axis,
    };
  }
  async getCountryStatistic() {
    // 美国 日本 英国 德国 法国 意大利 西班牙
    const mids = [
      { mid: 1, title: '美国' },
      { mid: 10, title: '日本' },
      { mid: 4, title: '英国' },
      { mid: 5, title: '德国' },
      { mid: 6, title: '法国' },
      { mid: 7, title: '意大利' },
      { mid: 8, title: '西班牙' },
    ];
    const { ctx } = this;
    const { startDate, endDate, cid } = ctx.request.body;
    const startDateMs = dayjs(startDate).valueOf();
    const endDateMs = dayjs(endDate).valueOf();
    const days = (endDateMs - startDateMs) / 60 / 60 / 1000 / 24 + 1;
    const daysArray = [];
    // const LocalSkuMidProfitList = ctx.model.Fulin.LocalSkuMidProfitList;
    const x_axis = [];
    for (let i = 0; i < days; i++) {
      if (i % 7 === 0) {
        const pStartDateMs = startDateMs + i * 60 * 60 * 24 * 1000;
        const pEndDateMs = (pStartDateMs + 6 * 24 * 60 * 60 * 1000) > endDateMs ? endDateMs : (pStartDateMs + 6 * 24 * 60 * 60 * 1000);
        x_axis.push(dayjs(startDateMs + i * 60 * 60 * 24 * 1000).format('YYYY-MM-DD'));
        daysArray.push({
          date_str: dayjs(startDateMs + i * 60 * 60 * 24 * 1000).format('YYYY-MM-DD'),
          // startDateMs: pStartDateMs,
          // endDateMs: pEndDateMs,
          start_date_str: dayjs(startDateMs + i * 60 * 60 * 24 * 1000).format('YYYY-MM-DD'),
          end_date_str: dayjs(pEndDateMs).format('YYYY-MM-DD'),

        });
      }
    }
    const promiseArray = [];
    mids.map(item => {
      daysArray.map(element => {
        promiseArray.push({
          ...element,
          cid,
          mid: item.mid,
          title: item.title,
        });
        return element;
      });
      item.weekAds = daysArray;
      return item;
    });


    let rateList = await ctx.model.Fulin.RateList.findAll();

    rateList = rateList.map(el => el.get({ plain: true }));
    const rateEnum = {};
    rateList.map(item => {
      rateEnum[item.code_date] = item;
    });
    const skuWeekData = [];

    await Promise.all(promiseArray.map(item => {
      return this.fetch(item.start_date_str, item.end_date_str, cid, item.mid);
    })).then(res => {
      res.map((arr, arrIndex) => {
        const statistic = {
          cost: 0,
          category_text: '',
          cid: '',
          sales_amount: 0,
          date_str: promiseArray[arrIndex].date_str,
          ratio: 1,
          gross_profit: 0,
          ad_orders: 0,
          ad_sales_amount: 0,
        };
        arr.map(element => {
          const code_date = element.code + '_' + dayjs(element.date_str).format('YYYY-MM');
          const us_rate = Number(rateEnum['USD_' + dayjs(element.date_str).format('YYYY-MM')].rate || 1);
          const rate = Number(rateEnum[code_date].rate || 1);
          const ratio = (rate / us_rate) || 1;
          const ad_cost = Number(element.sp_cost || 0) + Number(element.sb_cost || 0) + Number(element.sbv_cost || 0) + Number(element.sd_cost || 0);
          const gross_profit = Number(element.total_amount || 0) + Number(element.refund_amount || 0) + Number(element.channel_fee || 0) + Number(element.commission_amount || 0) + Number(element.promotion_amount || 0) + Number(element.total_cg_price || 0) + Number(element.total_cg_transport_costs || 0) + Number(element.other_order_fee || 0) - ad_cost;
          const ad_orders = Number(element.sp_orders || 0) + Number(element.sb_orders || 0) + Number(element.sbv_orders || 0) + Number(element.sd_orders || 0);
          const ad_sales_amount = Number(element.sp_sales_amount || 0) + Number(element.sales_amount || 0) + Number(element.sbv_sales_amount || 0) + Number(element.sd_sales_amount || 0);


          statistic.gross_profit += Number(gross_profit) * ratio;
          statistic.cost += ad_cost * ratio;
          statistic.sales_amount += Number(element.total_amount) * ratio;
          statistic.ad_sales_amount += Number(ad_sales_amount) * ratio;

          statistic.cid = element.cid;
          statistic.mid = element.mid;
          statistic.ad_orders += ad_orders;

          statistic.ratio = ratio;

        });
        skuWeekData.push(statistic);
      });

    });


    const cost_sum = 0;
    const sales_amount_sum = 0;
    const gross_profit_sum = 0;

    mids.map(item => {
      const weekAds = [];
      item.total_sales_amount = 0;
      item.total_cost = 0;
      item.total_gross_profit = 0;
      item.weekAds.map(element => {
        const data = skuWeekData.filter(weekData => {
          return (weekData.date_str === element.date_str && item.mid == weekData.mid);
        })[0] || {};
        element = { ...element, ...data };
        weekAds.push(element);
        item.total_sales_amount += Number(data.sales_amount);
        item.total_cost += Number(data.cost);
        item.total_gross_profit += Number(data.gross_profit);
        item.total_gross_profit_rate = item.total_gross_profit / item.total_sales_amount;

        return element;
      });

      item.weekAds = weekAds;

      return item;
    });

    return {
      categories: mids,
      x_axis,
    };

  }
  async getAllStatistic() {
    const { ctx } = this;

    const { startDate, endDate } = ctx.request.body;
    const startDateMs = dayjs(startDate).valueOf();
    const endDateMs = dayjs(endDate).valueOf();
    const days = (endDateMs - startDateMs) / 60 / 60 / 1000 / 24 + 1;
    const daysArray = [];
    // const LocalSkuMidProfitList = ctx.model.Fulin.LocalSkuMidProfitList;
    const x_axis = [];
    for (let i = 0; i < days; i++) {
      if (i % 7 === 0) {
        const pStartDateMs = startDateMs + i * 60 * 60 * 24 * 1000;
        const pEndDateMs = (pStartDateMs + 6 * 24 * 60 * 60 * 1000) > endDateMs ? endDateMs : (pStartDateMs + 6 * 24 * 60 * 60 * 1000);
        x_axis.push(dayjs(startDateMs + i * 60 * 60 * 24 * 1000).format('YYYY-MM-DD'));
        daysArray.push({
          date_str: dayjs(startDateMs + i * 60 * 60 * 24 * 1000).format('YYYY-MM-DD'),
          // startDateMs: pStartDateMs,
          // endDateMs: pEndDateMs,
          start_date_str: dayjs(startDateMs + i * 60 * 60 * 24 * 1000).format('YYYY-MM-DD'),
          end_date_str: dayjs(pEndDateMs).format('YYYY-MM-DD'),

        });
      }
    }

    // LocalSkuMidProfitList.findALl;
    let categories = await ctx.model.Fulin.Category.findAll();
    let rateList = await ctx.model.Fulin.RateList.findAll();

    rateList = rateList.map(el => el.get({ plain: true }));
    const rateEnum = {};
    rateList.map(item => {
      rateEnum[item.code_date] = item;
    });
    categories = categories.map(el => el.get({ plain: true }));
    const promiseArray = [];
    categories.map(item => {
      daysArray.map(element => {
        promiseArray.push({
          ...element,
          ...item,
        });
        return element;
      });
      item.weekAds = daysArray;
      return item;
    });
    const skuWeekData = [];
    let data = [];

    await Promise.all(promiseArray.map(item => {
      return this.fetch(item.start_date_str, item.end_date_str, item.cid);
    })).then(res => {
      data = res;
      res.map((arr, arrIndex) => {
        const statistic = {
          cost: 0,
          category_text: '',
          cid: '',
          sales_amount: 0,
          date_str: promiseArray[arrIndex].date_str,
          ratio: 1,
          gross_profit: 0,
        };
        arr.map(element => {

          const code_date = element.code + '_' + dayjs(element.date_str).format('YYYY-MM');
          const us_rate = Number(rateEnum['USD_' + dayjs(element.date_str).format('YYYY-MM')].rate || 1);
          const rate = Number(rateEnum[code_date].rate || 1);
          const ratio = (rate / us_rate) || 1;
          const ad_cost = Number(element.sp_cost || 0) + Number(element.sb_cost || 0) + Number(element.sbv_cost || 0) + Number(element.sd_cost || 0);
          const gross_profit = Number(element.total_amount || 0) + Number(element.refund_amount || 0) + Number(element.channel_fee || 0) + Number(element.commission_amount || 0) + Number(element.promotion_amount || 0) + Number(element.total_cg_price || 0) + Number(element.total_cg_transport_costs || 0) + Number(element.other_order_fee || 0) - ad_cost;
          // console.log(element.total_amount, element.refund_amount, element.channel_fee, element.commission_amount, element.promotion_amount, element.total_cg_price, element.total_cg_transport_costs, element.other_order_fee);
          statistic.gross_profit += Number(gross_profit) * ratio;
          statistic.cost += ad_cost * ratio;
          statistic.sales_amount += Number(element.total_amount) * ratio;
          statistic.category_text = element.category_text;
          statistic.cid = element.cid;
          statistic.ratio = ratio;

        });
        skuWeekData.push(statistic);
      });

    });

    let cost_sum = 0;
    let sales_amount_sum = 0;
    let gross_profit_sum = 0;

    categories.map(item => {
      const weekAds = [];
      item.total_sales_amount = 0;
      item.total_cost = 0;
      item.total_gross_profit = 0;
      item.weekAds.map(element => {
        const data = skuWeekData.filter(weekData => {
          return (weekData.date_str === element.date_str && item.cid === weekData.cid);
        })[0] || {};
        element = { ...element, ...data };
        weekAds.push(element);
        item.total_sales_amount += Number(data.sales_amount);
        item.total_cost += Number(data.cost);
        item.total_gross_profit += Number(data.gross_profit);
        item.total_gross_profit_rate = item.total_gross_profit / item.total_sales_amount;

        return element;
      });

      item.weekAds = weekAds;
      gross_profit_sum += item.total_gross_profit;
      cost_sum += item.total_cost;
      sales_amount_sum += item.total_sales_amount;
      return item;
    });

    return {
      // data,
      gross_profit_sum,
      cost_sum,
      sales_amount_sum,
      // rateEnum,
      // promiseArray,
      categories,
      x_axis,
      // skuWeekData,
      // daysArray,
    };
  }

  async fetch(startDate, endDate, cid = '', mid = '') {
    const { ctx } = this;

    const LocalSkuMidProfitList = ctx.model.Fulin.LocalSkuMidProfitList;
    const where = {
      ...(cid ? { cid } : {}),
      ...(mid ? { mid } : {}),
      date_str: {
        [Op.between]: [ startDate, endDate ],
      },
    };

    let data = await LocalSkuMidProfitList.findAll({
      where,
    });
    data = data.map(el => el.get({ plain: true }));

    return data;
  }
}
module.exports = UserService;

