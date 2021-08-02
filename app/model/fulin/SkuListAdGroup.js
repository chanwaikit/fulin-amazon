'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const SkuAd = app.model.define('sku_ad_table', {
    local_sku_sid: { type: STRING, primaryKey: true },
    portfolio_id: { type: STRING, primaryKey: true },
    name: STRING(30),

  }, {
    timestamps: false,
  });


  return SkuAd;
};
