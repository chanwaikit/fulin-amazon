'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Category = app.model.define('category', {
    cid: { type: STRING, primaryKey: true, autoIncrement: true },
    title: STRING(30),

  }, {
    timestamps: false,
  });
  Category.associate = function() {

  };
  return Category;
};
