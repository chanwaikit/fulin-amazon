'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Sku = app.model.define('local_sku_mid_profit_list', {
    local_sku_mid_date: { type: STRING, unique: true, primaryKey: true, autoIncrement: true },
    local_sku_mid: STRING(30),
    local_sku: STRING(30),
    mid: STRING(30),
    cid: STRING(30),
    category_text: STRING(30),
    total_amount: STRING(30),
    total_volume: STRING(30),
    multi_channel_fee: STRING(30),
    channel_fee: STRING(30),
    refund_num: STRING(30),
    refund_amount: STRING(30),
    fba_shipment: STRING(30),
    commission_amount: STRING(30),
    promotion_amount: STRING(30),
    total_cg_price: STRING(30),
    other_order_fee: STRING(30),
    total_cg_transport_costs: STRING(30),
    code: STRING(30),
    bid: STRING(30),
    icon: STRING(30),
    date_str: STRING(30),
    volume: STRING(30),
    sessions: STRING(30),

    sp_clicks: STRING(30),
    sp_impressions: STRING(30),
    sp_orders: STRING(30),
    sp_sales_amount: STRING(30),
    sp_cost: STRING(30),
    sp_teika_cost: STRING(30),


    sd_clicks: STRING(30),
    sd_impressions: STRING(30),
    sd_orders: STRING(30),
    sd_sales_amount: STRING(30),
    sd_cost: STRING(30),
    sd_teika_cost: STRING(30),

    sb_clicks: STRING(30),
    sb_impressions: STRING(30),
    sb_orders: STRING(30),
    sb_sales_amount: STRING(30),
    sb_cost: STRING(30),
    sb_teika_cost: STRING(30),

    sbv_clicks: STRING(30),
    sbv_impressions: STRING(30),
    sbv_orders: STRING(30),
    sbv_sales_amount: STRING(30),
    sbv_cost: STRING(30),
    sbv_teika_cost: STRING(30),

  }, {
    timestamps: false,
  });

  Sku.associate = function() {


  };
  return Sku;
};
