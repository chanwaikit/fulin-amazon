'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Sku = app.model.define('sp_campaign', {
    id: { type: STRING, primaryKey: true, autoIncrement: true },
    total_clicks: STRING(30),
    total_cpc: STRING(30),
    total_impressions: STRING(30),
    total_order_quantity: STRING(30),
    total_sales_amount: STRING(30),
    total_cost: STRING(30),
    date_str: STRING(30),
    mid: STRING(30),
    currency_icon: STRING(30),
    currency_code: STRING(30),
    local_sku: STRING(30),
    local_sku_sid: STRING(30),
    local_name: STRING(30),
    sid: STRING(30),
    teika_cost: STRING(30),
  }, {
    timestamps: false,
  });
  Sku.associate = function() {

  };
  return Sku;
};
