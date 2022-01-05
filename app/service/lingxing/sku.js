'use strict';
// app/service/user.js
const dayjs = require('dayjs');
// 从 egg 上获取（推荐）
const Service = require('egg').Service;
const { QueryTypes, Op } = require('sequelize');

class UserService extends Service {
  async getProProduct(local_sku, mid, date_str) {
    const { ctx } = this;
    // const authToken = ctx.cookies.get('auth-token');
    const authToken = ctx.state.authToken;
    const productResult = await ctx.curl('https://fulintech.lingxing.com/api/report/asinLists', {
      // 必须指定 method
      method: 'POST',
      // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
      contentType: 'json',
      headers: {
        cookie: 'auth-token=' + authToken,
        'x-ak-company-id': '90136223568253440',
        'x-ak-env-key': 'fulintech',
        'x-ak-request-id': 'f2ba4047-81b0-4bbc-a759-aa3024d5fc3d',
        'x-ak-request-source': 'erp',
        'x-ak-version': '2.8.5.1.2.033',
        'x-ak-zid': 1,
      },
      data: {
        currency_type: '',
        end_date: date_str,
        length: 200,
        mids: mid,
        offset: '0',
        principal_uids: [],
        req_time_sequence: '/api/report/asinLists$$4',
        search_field: 'local_sku',
        search_value: local_sku,
        sids: '',
        sort_field: 'sessions',
        summary_field: 'asin',
        turn_on_summary: '0',
        sort_type: 'desc',
        start_date: date_str,
      },
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
    });

    const data = {
      volume: 0,
      sessions: 0,
    };
    const productArray = productResult.data.list || [];
    productArray.map(item => {
      data.volume += Number(item.volume || 0);
      // data.sessions += Number(item.sessions || 0);
    });
    data.sessions = productArray[0] ? Number(productArray[0].sessions || 0) : 0;
    return data;
  }
  async getProfit(local_sku, mid, date_str, sku = {}) {
    const { ctx } = this;
    // const authToken = ctx.cookies.get('auth-token');
    const authToken = ctx.state.authToken;
    // console.log(57, authToken);
    const profitResult = await ctx.curl(`https://fulintech.lingxing.com/api/report/profitAsin?offset=0&length=200&sort_field=total_volume&sort_type=desc&mids=${mid}&sids=&cid=&bid=&start_date=${date_str}&end_date=${date_str}&currency_type=0&type=0&search_value=${local_sku}&is_merge=0&req_time_sequence=%2Fapi%2Freport%2FprofitAsin$$7`, {
      // 必须指定 method
      method: 'GET',
      // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
      contentType: 'application/json',
      headers: {
        cookie: 'auth-token=' + authToken,
        'x-ak-company-id': '90136223568253440',
        'x-ak-env-key': 'fulintech',
        'x-ak-request-id': 'f2ba4047-81b0-4bbc-a759-aa3024d5fc3d',
        'x-ak-request-source': 'erp',
        'x-ak-version': '2.8.5.1.2.033',
        'x-ak-zid': 1,
      },
      // data: {
      //   // offset: 0,
      //   // length: 200,
      //   // sort_field: 'total_volume',
      //   // sort_type: 'desc',
      //   // start_date: date_str,
      //   // end_date: date_str,
      //   // currency_type: '0',
      //   // search_value: local_sku,
      //   // mids: mid,
      //   // type: '0',
      //   // is_merge: '0',
      //   // req_time_sequence: '/api/report/profitAsin$$11',

      //   // offset: 0,
      //   // length: 200,
      //   // sort_field: 'total_volume',
      //   // sort_type: 'desc',
      //   // start_date: '2021-11-02',
      //   // end_date: '2021-11-02',
      //   // currency_type: 2,
      //   // type: 0,
      //   // search_value: 'LM-166_Gold_US_FURIDEN',
      //   // is_merge: 0,
      //   // req_time_sequence: '/api/report/profitAsin$$29',
      // },
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
    });

    const profitResultArray = profitResult.data.list || [];
    // console.log(98,local_sku,mid)
    const data = {
      local_sku_mid_date: local_sku + '_' + mid + '_' + date_str,
      local_sku_mid: local_sku + '_' + mid,
      local_sku,
      mid,
      cid: sku.cid || 0,
      category_text: sku.category_text,
      total_amount: 0,
      total_volume: 0,
      multi_channel_fee: 0,
      channel_fee: 0,

      refund_num: 0,
      refund_amount: 0,
      fba_shipment: 0,
      commission_amount: 0,
      promotion_amount: 0,
      total_cg_price: 0,
      other_order_fee: 0,
      total_cg_transport_costs: 0,
      code: sku.code,
      bid: sku.bid,
      icon: sku.icon,
      date_str,
    };
    profitResultArray.map(item => {
      // console.log(item.channel_fee);
      data.local_sku_mid_date = local_sku + '_' + mid + '_' + date_str;
      data.local_sku_mid = local_sku + '_' + mid;
      data.local_sku = local_sku;
      // data.mid = mid;
      // data.cid = sku.cid;
      data.category_text = sku.category_text;
      data.total_amount += Number(item.total_amount || 0);
      data.total_volume += Number(item.total_volume || 0);
      data.multi_channel_fee += Number(item.multi_channel_fee || 0);
      data.channel_fee += Number(item.channel_fee || 0);

      data.refund_num += Number(item.refund_num || 0);
      data.refund_amount += Number(item.refund_amount || 0);
      data.fba_shipment += Number(item.fba_shipment || 0);
      data.commission_amount += Number(item.commission_amount || 0);
      data.promotion_amount += Number(item.promotion_amount || 0);
      data.total_cg_price += Number(item.total_cg_price || 0);
      data.other_order_fee += Number(item.other_order_fee || 0);
      data.total_cg_transport_costs += Number(item.total_cg_transport_costs || 0);
      data.code = item.code;
      // data.bid = item.bid[0];
      data.date_str = date_str;
      // data.icon = item.icon;
    });

    // if (local_sku == 'LM-166_Gold_US_FURIDEN') {
    // console.log(138, profitResult);
    // }
    return data;
  }
  async getSpSd(local_sku, mid, date_str) {
    const { ctx } = this;

    let SpCampaign = await ctx.model.Fulin.SpCampaign.findAndCountAll({
      where: {
        // mid: '4',
        // local_sku: 'DVD3621_Black_UK_ELECTCOM',
        // date_str: '2021-08-02',
        mid: String(mid),
        local_sku,
        date_str,
      },
    });
    let SdCampaign = await ctx.model.Fulin.SdCampaign.findAndCountAll({
      where: {
        mid: String(mid),
        local_sku,
        date_str,
      },
    });

    SpCampaign = SpCampaign.rows.map(el => el.get({ plain: true }));
    SdCampaign = SdCampaign.rows.map(el => el.get({ plain: true }));

    const data = {

      sp_clicks: 0,
      sp_impressions: 0,
      sp_orders: 0,
      sp_sales_amount: 0,
      sp_cost: 0,
      sp_teika_cost: 0,

      sd_clicks: 0,
      sd_impressions: 0,
      sd_orders: 0,
      sd_sales_amount: 0,
      sd_cost: 0,
      sd_teika_cost: 0,
    };
    SpCampaign.map(item => {
      data.sp_clicks += Number(item.total_clicks || 0);
      data.sp_impressions += Number(item.total_impressions || 0);
      data.sp_orders += Number(item.total_order_quantity || 0);
      data.sp_sales_amount += Number(item.total_sales_amount || 0);
      data.sp_cost += Number(item.total_cost || 0);
      data.sp_teika_cost += Number(item.teika_cost || 0);

    });

    SdCampaign.map(item => {
      data.sd_clicks += Number(item.total_clicks || 0);
      data.sd_impressions += Number(item.total_impressions || 0);
      data.sd_orders += Number(item.total_order_quantity || 0);
      data.sd_sales_amount += Number(item.total_sales_amount || 0);
      data.sd_cost += Number(item.total_cost || 0);
      data.sd_teika_cost += Number(item.teika_cost || 0);
    });
    return data;
  }
  async getSb(local_sku, mid, date_str, currentData) {
    const { ctx } = this;

    const LocalSkuMidSbGroup = ctx.model.Fulin.LocalSkuMidSbGroup;
    const SbCampaignTable = ctx.model.Fulin.SbCampaign;
    let LocalSkuMidList = await ctx.model.Fulin.LocalSkuMidList.findAll(
      {
        where: {
          mid,
          local_sku,
        },
        include: [
          {
            model: LocalSkuMidSbGroup,
            include: [{
              model: SbCampaignTable,
              where: {
                date_str: {
                  [Op.between]: [ date_str, date_str ],
                },
              },
              required: false,
            }],
            required: false,

          }],
      }
    );
    LocalSkuMidList = LocalSkuMidList.map(el => el.get({ plain: true }));
    const localSkuObj = LocalSkuMidList[0];
    const sbvObj = {
      sbv_clicks: 0,
      sbv_cost: 0,
      sbv_currency_code: '',
      sbv_impressions: 0,
      sbv_orders: 0,
      sbv_sales_amount: 0,
      sbv_teika_cost: 0,
    };
    const sbObj = {
      sb_clicks: 0,
      sb_cost: 0,
      sb_currency_code: '',
      sb_impressions: 0,
      sb_orders: 0,
      sb_sales_amount: 0,
      sb_teika_cost: 0,
    };
    if (localSkuObj && localSkuObj.local_sku_mid_sb_groups.length > 0) {
      for (let e = 0; e < localSkuObj.local_sku_mid_sb_groups.length; e++) {
        const element = localSkuObj.local_sku_mid_sb_groups[e];

        const type = element.type;
        let clicks = 0,
          cost = 0,
          currency_code = '',
          impressions = 0,
          order_num = 0,
          teika_cost = 0,
          sales_amount = 0;

        for (let i = 0; i < element.sb_campaigns.length; i++) {
          const sbItem = element.sb_campaigns[i];
          clicks += Number(sbItem.clicks);
          cost += Number(sbItem.cost);
          currency_code = sbItem.currency_code;
          impressions += Number(sbItem.impressions);
          order_num += Number(sbItem.order_num);
          sales_amount += Number(sbItem.sales_amount);
          teika_cost += Number(sbItem.teika_cost);
        }

        let total_volume = 0;
        let ratio = 1;


        if (type == 'sbv') {
          sbvObj.sbv_clicks += Number(clicks || 0);
          sbvObj.sbv_cost += Number(cost || 0);
          sbvObj.sbv_currency_code = currency_code;
          sbvObj.sbv_impressions += Number(impressions || 0);
          sbvObj.sbv_orders += Number(order_num || 0);
          sbvObj.sbv_sales_amount += Number(sales_amount || 0);
          sbvObj.sbv_teika_cost += Number(teika_cost || 0);

        } else {

          let LocalSkuMidThroughSbTable = await ctx.model.Fulin.LocalSkuMidThroughSbTable.findAll({
            where: {
              portfolio_id: element.portfolio_id,
            },
          });
          LocalSkuMidThroughSbTable = LocalSkuMidThroughSbTable.map(el => el.get({ plain: true }));
          if (LocalSkuMidThroughSbTable.length > 1) {
            for (let d = 0; d < LocalSkuMidThroughSbTable.length; d++) { // 多个则必定是sb广告组合
              const item = LocalSkuMidThroughSbTable[d];
              const plocal_sku = item.local_sku_mid.slice(0, item.local_sku_mid.lastIndexOf('_'));
              const pMid = item.local_sku_mid.slice(item.local_sku_mid.lastIndexOf('_') + 1);

              const data = await this.getProfit(plocal_sku, pMid, date_str);
              total_volume += parseInt(Number(data.total_volume || 0));
            }
            ratio = currentData.total_volume / (total_volume || 1);
          }

          sbObj.sb_clicks += Number(clicks || 0) * ratio;
          sbObj.sb_cost += Number(cost || 0) * ratio;
          sbvObj.sbv_currency_code = currency_code;
          sbObj.sb_impressions += Number(impressions || 0) * ratio;
          sbObj.sb_orders += Number(order_num || 0) * ratio;
          sbObj.sb_sales_amount += Number(sales_amount || 0) * ratio;
          sbObj.sb_teika_cost += Number(teika_cost || 0) * ratio;

        }
      }

    }

    return {
      ...sbvObj,
      ...sbObj,
    };
  }
  async getSkuMidProfit() {
    const { ctx } = this;
    // const authToken = ctx.cookies.get('auth-token');

    let allLocalSku = await ctx.model.Fulin.LocalSkuMidList.findAll(); // 先拿到总的sku
    allLocalSku = allLocalSku.map(el => el.get({ plain: true }));
    const nowMs = dayjs().valueOf();
    for (let t = 0; t < 30; t++) {
      const date_str = dayjs(nowMs - t * 60 * 60 * 24 * 1000).format('YYYY-MM-DD');
      const result = [];
      // console.log('315-------------------------', t);
      for (let i = 0; i < allLocalSku.length; i++) {
        const item = allLocalSku[i]; // 单个产品，在轮询获取每天的的具体情况
        const { mid, local_sku } = item;
        const profitResult = await this.getProfit(local_sku, mid, date_str, item);
        const productResult = await this.getProProduct(local_sku, mid, date_str);
        const spResult = await this.getSpSd(local_sku, mid, date_str);
        const sbResult = await this.getSb(local_sku, mid, date_str, profitResult);
        // console.log(sbResult);
        result.push({
          ...profitResult,
          ...productResult,
          ...spResult,
          ...sbResult,
        });
        // console.log(profitResult.channel_fee);
      }


      const updateArrayKey = [
        'local_sku_mid_date',
        'local_sku_mid',
        'local_sku',
        'mid',
        'cid',
        'category_text',
        'total_amount',
        'total_volume',
        'channel_fee',
        'multi_channel_fee',
        'refund_num',
        'refund_amount',
        'fba_shipment',
        'commission_amount',
        'promotion_amount',
        'total_cg_price',
        'other_order_fee',
        'total_cg_transport_costs',
        'code',
        'bid',
        'icon',
        'date_str',
        'volume',
        'sessions',

        'sp_clicks',
        'sp_impressions',
        'sp_orders',
        'sp_sales_amount',
        'sp_cost',
        'sp_teika_cost',

        'sd_clicks',
        'sd_impressions',
        'sd_orders',
        'sd_sales_amount',
        'sd_cost',
        'sd_teika_cost',

        'sb_clicks',
        'sb_impressions',
        'sb_orders',
        'sb_sales_amount',
        'sb_cost',
        'sb_teika_cost',

        'sbv_clicks',
        'sbv_impressions',
        'sbv_orders',
        'sbv_sales_amount',
        'sbv_cost',
        'sbv_teika_cost',

      ];


      // console.log('388-------------------------', result);

      await ctx.model.Fulin.LocalSkuMidProfitList.bulkCreate(result, { updateOnDuplicate: updateArrayKey });


      // await ctx.model.Fulin.DailyRecord.bulkCreate([{
      //   date_str,
      //   update_date_str: dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
      // }], { updateOnDuplicate: [
      //   'date_str',
      //   'update_date_str',
      // ] });

      const dateObj = {
        date_str,
        update_date_str: dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
      };

      const profitObj = await ctx.model.Fulin.DailyRecord.findByPk(dateObj.date_str);
      if (!profitObj) {
        await ctx.model.Fulin.DailyRecord.create(dateObj);
      } else {
        await ctx.model.Fulin.DailyRecord.update(dateObj, {
          where: {
            date_str,
          },
        });

      }


      // if (!obj) {
      //   await ctx.model.Fulin.LocalSkuMidDate.create(data);

      // } else {
      //   await ctx.model.Fulin.LocalSkuMidDate.update({
      //     ...data,
      //   }, {
      //     where: {
      //       local_sku_mid_date: 'DVD3621_Black_UK_ELECTCOM' + '_' + '4' + '_' + '2021-08-02',
      //     },
      //   });
      // }


    }


    return [];
  }
  async getSkuMid(authToken) {
    const { ctx } = this;
    // const authToken = ctx.cookies.get('auth-token');
    const nowTime = new Date().getTime();
    const end_date = dayjs(nowTime - 24 * 60 * 60 * 1000).format('YYYY-MM-DD');
    const start_date = dayjs(nowTime - 365 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD');
    // console.log(start_date, end_date);
    const shopObj = {};
    const shopList = await ctx.model.Fulin.ShopList.findAll();

    shopList.filter(element => {
      shopObj[element.country] = element.mid;
    });
    console.log(444, shopObj['美国']);
    const result = await ctx.curl(`https://fulintech.lingxing.com/api/report/profitAsin?offset=0&length=200&sort_field=total_volume&sort_type=desc&mids=&sids=&cid=&bid=&start_date=${start_date}&end_date=${end_date}&currency_type=0&type=0&search_value=&is_merge=0&req_time_sequence=%2Fapi%2Freport%2FprofitAsin$$7`, {
      // 必须指定 method
      method: 'GET',
      // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
      contentType: 'json',
      headers: {
        cookie: 'auth-token=' + authToken,
        'x-ak-company-id': '90136223568253440',
        'x-ak-env-key': 'fulintech',
        'x-ak-request-id': 'f2ba4047-81b0-4bbc-a759-aa3024d5fc3d',
        'x-ak-request-source': 'erp',
        'x-ak-version': '2.8.5.1.2.033',
        'x-ak-zid': 1,
      },
      // data: {
      //   offset: 0,
      //   length: 10000,
      //   sort_field: 'total_volume',
      //   sort_type: 'desc',
      //   start_date,
      //   end_date,
      //   currency_type: '0',
      //   type: '0',
      //   is_merge: '0',
      //   req_time_sequence: '/api/report/profitAsin$$11',
      // },
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
    });

    const resultArray = result.data.list || [];

    // resultArray.map((item)=>{
    for (let i = 0; i < resultArray.length; i++) {
      const item = resultArray[i];
      const obj = await ctx.model.Fulin.LocalSkuMidList.findByPk(item.local_sku + '_' + shopObj[item.marketplace]);
      const data = {
        local_sku_mid: item.local_sku + '_' + shopObj[item.marketplace], // item.mid,
        local_sku: item.local_sku,
        mid: shopObj[item.marketplace], // item.mid,
        local_name: item.local_name,
        country: item.marketplace,
        cid: item.cid,
        category_text: item.category_text,
        code: item.code,
        icon: item.icon,
        bid: item.bid,
      };
      if (!obj) {
        await ctx.model.Fulin.LocalSkuMidList.create(data);

      } else {
        await ctx.model.Fulin.LocalSkuMidList.update({
          ...data,
        }, {
          where: {
            local_sku_mid: item.local_sku + '_' + shopObj[item.marketplace], // item.mid,
          },
        });
      }


      const obj1 = await ctx.model.Fulin.SkuList.findByPk(item.local_sku + '_' + item.sid);
      const data1 = {
        local_sku_sid: item.local_sku + '_' + item.sid,
        pid_sid: item.pid + '_' + item.sid,
        pid: item.pid,
        local_sku: item.local_sku,
        asin: item.asin1,
        local_name: item.local_name,
        sid: item.sid,
        mid: shopObj[item.marketplace], // item.mid,
        country: item.marketplace,
        cid: item.cid,
        category_text: item.category_text,
        code: item.code,
        icon: item.icon,
        bid: item.bid,
      };

      if (!obj1) {
        await ctx.model.Fulin.SkuList.create(data1);

      } else {
        await ctx.model.Fulin.SkuList.update({
          ...data,
        }, {
          where: {
            local_sku_sid: item.local_sku + '_' + item.sid,
          },
        });
      }


    }

    // })


    return resultArray;

  }
  async fetch() {
    const { ctx } = this;

    const result = await ctx.model.Fulin.ProfitStatistic.findAll();
    const shopList = await ctx.model.Fulin.ShopList.findAll();

    for (let i = 0; i < result.length; i++) {
      const shopObj = shopList.filter(element => {
        return result[i].dataValues.sid == element.sid;
      })[0] || {};

      const obj = {
        pid_sid: result[i].dataValues.local_sku_sid,
        asin: result[i].dataValues.asin1,
        sid: result[i].dataValues.sid,
        pid: result[i].dataValues.pid_sid,
        local_sku: result[i].dataValues.local_sku,
        local_name: result[i].dataValues.local_name,
        local_sku_sid: result[i].dataValues.local_sku_sid,
        mid: shopObj.mid,
        country: shopObj.country,
        sku: '',
        cid: result[i].dataValues.cid,
        category_text: result[i].dataValues.category_text,
      };
      const SkuObj = await ctx.model.Fulin.SkuList.findByPk(result[i].dataValues.local_sku_sid);


      if (!SkuObj && result[i].dataValues.local_sku) {
        await ctx.model.Fulin.SkuList.create(obj);
      }
    }

    return result.length;
  }
}
module.exports = UserService;

