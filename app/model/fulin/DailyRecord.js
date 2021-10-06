'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Category = app.model.define('daily_record', {
    date_str: { type: STRING, primaryKey: true, autoIncrement: true },
    update_date_str: STRING(30),

  }, {
    timestamps: false,
  });
  Category.associate = function() {

  };
  return Category;
};
