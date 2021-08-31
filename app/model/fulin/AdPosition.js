'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Sku = app.model.define('ad_position', {
    pid: { type: STRING, primaryKey: true, autoIncrement: true },
    asin: STRING(30),
    time_str: STRING(30),
    keywords: STRING(30),
    bid: STRING(30),


    phone_sp_sum: STRING(30),
    sp_sum: STRING(30),
    phone_natural_sum: STRING(30),
    natural_sum: STRING(30),
    phone_sp_all_sum: STRING(30),
    sp_all_sum: STRING(30),
    phone_natural_all_sum: STRING(30),
    natural_all_sum: STRING(30),

    phone_sp_sort: STRING(30),
    sp_sort: STRING(30),
    phone_sp_all_sort: STRING(30),
    sp_all_sort: STRING(30),
    phone_natural_sort: STRING(30),
    natural_sort: STRING(30),
    phone_natural_all_sort: STRING(30),
    natural_all_sort: STRING(30),

    phone_sp_all_page: STRING(30),
    sp_all_page: STRING(30),
    phone_sp_page: STRING(30),
    sp_page: STRING(30),
    phone_natural_all_page: STRING(30),
    natural_all_page: STRING(30),
    phone_natural_page: STRING(30),
    natural_page: STRING(30),

  }, {
    timestamps: false,
  });

  Sku.associate = function() {


  };
  return Sku;
};
