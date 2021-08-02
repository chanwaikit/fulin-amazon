'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Sku = app.model.define('sku_list', {
    local_sku_sid: { type: STRING, primaryKey: true, autoIncrement: true },
    pid: STRING(30),
    local_sku: STRING(30),
    local_name: STRING(30),
    sku: STRING(30),
    asin: STRING(30),
    sid: STRING(30),
    pid_sid: STRING(30),
    mid: STRING(30),
    portfolio_id: STRING(30),

  }, {
    timestamps: false,
  });


  Sku.associate = function() {
    app.model.Fulin.SkuList.hasMany(app.model.Fulin.SbCampaign, { foreignKey: 'portfolio_id', sourceKey: 'portfolio_id' });
    app.model.Fulin.SkuList.hasMany(app.model.Fulin.ProfitStatistic, { foreignKey: 'local_sku_sid', sourceKey: 'local_sku_sid' });
    app.model.Fulin.SkuList.belongsToMany(app.model.Fulin.AdGroup, {
      through: app.model.Fulin.SkuListAdGroup,
      foreignKey: 'local_sku_sid',
      otherKey: 'portfolio_id',
    });

  };
  return Sku;
};
