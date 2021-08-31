'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Sku = app.model.define('rate_list', {
    code_date: { type: STRING, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    icon: STRING(30),
    rate: STRING(30),
    date: STRING(30),
    code: STRING(30),

  }, {
    timestamps: false,
  });
  Sku.associate = function() {

  };
  return Sku;
};
