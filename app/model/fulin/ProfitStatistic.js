'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Profit = app.model.define('profit_statistic', {
    profit_id: { type: STRING, primaryKey: true, autoIncrement: true },
    asin1: STRING(30),
    bid: STRING(30),
    cid: STRING(30),
    category_text: STRING(30),
    code: STRING(30),
    cg_price_amazon_order: STRING(30),
    cg_transport_costs_amazon_order: STRING(30),
    channel_fee: STRING(30),
    commission_amount: STRING(30),
    fba_shipment: STRING(30),
    promotion_amount: STRING(30),
    refund_num: STRING(30),
    refund_amount: STRING(30),
    sid: STRING(30),
    seller: STRING(30),
    seller_name: STRING(30),
    total_volume: STRING(30),
    total_amount: STRING(30),
    total_spend: STRING(30),
    local_name: STRING(30),
    local_sku: STRING(30),
    msku: STRING(30),
    replenishment_num: STRING(30),
    multi_channel_fee: STRING(30),
    order_quantity: STRING(30),
    sales_amount: STRING(30),
    cg_price_replenishment: STRING(30),
    other_order_fee: STRING(30),
    total_cg_transport_costs: STRING(30),
    gross_profit: STRING(30),
    local_sku_sid: STRING(30),
    date_str: STRING(30),
    pid_sid: STRING(30),
  }, {
    timestamps: false,
  });
  Profit.associate = function() {

    app.model.Fulin.ProfitStatistic.belongsTo(app.model.Fulin.ProductExpression, { foreignKey: 'profit_id', targetKey: 'expression_id' });
    app.model.Fulin.ProfitStatistic.belongsTo(app.model.Fulin.SkuList, { foreignKey: 'local_sku_sid', targetKey: 'local_sku_sid' });

  };

  return Profit;
};
