'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Product = app.model.define('product_expression', {
    expression_id: { type: STRING, primaryKey: true, autoIncrement: true },
    asin: STRING(30),
    sid: STRING(30),
    seller_name: STRING(30),
    seller_simple_name: STRING(30),
    sessions: STRING(30),
    afn_fulfillable_quantity: STRING(30),
    amount: STRING(30),
    bid: STRING(30),
    category: STRING(30),
    category_text: STRING(30),
    cid: STRING(30),
    order_items: STRING(30),
    pid: STRING(30),
    product_brand_text: STRING(30),
    small_image_url: STRING(30),
    volume: STRING(30),
    local_sku_sid: STRING(30),
    pid_sid: STRING(30),
    date_str: STRING(30),
  }, {
    timestamps: false,
  });
  Product.associate = function() {
    app.model.Fulin.ProductExpression.belongsTo(app.model.Fulin.ProfitStatistic, { foreignKey: 'expression_id', targetKey: 'profit_id' });
  };

  return Product;
};
