'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Sku = app.model.define('shop_list', {
    sid: { type: INTEGER, primaryKey: true, autoIncrement: true },
    country: STRING(30),
    currency_code: STRING(30),
    currency_icon: STRING(30),
    daily_budget: STRING(30),
    id: STRING(30),
    mapped_timezone: STRING(30),
    mid: STRING(30),
    name: STRING(30),
    profile_id: STRING(30),
    region: STRING(30),
    timezone: STRING(30),
  }, {
    timestamps: false,
  });

  return Sku;
};
