'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Sku = app.model.define('sbv_group', {
    portfolio_id: { type: STRING, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    profile_id: STRING(30),
    sid: STRING(30),
    type: STRING(30),

  }, {
    timestamps: false,
  });

  return Sku;
};
