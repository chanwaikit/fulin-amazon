'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Sku = app.model.define('sb_campaign', {
    id: { type: STRING, primaryKey: true, autoIncrement: true },
    clicks: STRING(30),
    cost: STRING(30),
    currency_code: STRING(30),
    impressions: STRING(30),
    order_num: STRING(30),
    sales_amount: STRING(30),
    profile_id: STRING(30),
    portfolio_id: STRING(30),
    group_name: STRING(30),
    date_str: STRING(30),
  }, {
    timestamps: false,
  });
  Sku.associate = function() {
    app.model.Fulin.SbCampaign.belongsTo(app.model.Fulin.SbGroup, { foreignKey: 'portfolio_id', targetKey: 'portfolio_id' });
  };
  return Sku;
};
