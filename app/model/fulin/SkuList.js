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
    country: STRING(30),
    cid: STRING(30),
    category_text: STRING(30),
  }, {
    timestamps: false,
  });


  Sku.associate = function() {
    // app.model.Fulin.SkuList.hasMany(app.model.Fulin.SbCampaign, { foreignKeyConstraint: true, foreignKey: 'portfolio_id', sourceKey: 'portfolio_id' });
    app.model.Fulin.SkuList.hasMany(app.model.Fulin.ProfitStatistic, { foreignKeyConstraint: true, foreignKey: 'local_sku_sid', sourceKey: 'local_sku_sid' });
    app.model.Fulin.SkuList.hasMany(app.model.Fulin.ProductExpression, { foreignKeyConstraint: true, foreignKey: 'local_sku_sid', sourceKey: 'local_sku_sid' });
    app.model.Fulin.SkuList.hasMany(app.model.Fulin.SpCampaign, { foreignKeyConstraint: true, foreignKey: 'local_sku_sid', sourceKey: 'local_sku_sid' });
    app.model.Fulin.SkuList.hasMany(app.model.Fulin.SdCampaign, { foreignKeyConstraint: true, foreignKey: 'local_sku_sid', sourceKey: 'local_sku_sid' });
    app.model.Fulin.SkuList.hasMany(app.model.Fulin.SpGroup, { foreignKeyConstraint: true, foreignKey: 'local_sku_sid', sourceKey: 'local_sku_sid' });

    app.model.Fulin.SkuList.belongsToMany(app.model.Fulin.SbGroup, {
      through: app.model.Fulin.SkuListSbGroup,
      foreignKey: 'local_sku_sid',
      otherKey: 'portfolio_id',
      foreignKeyConstraint: true,
    });

  };
  return Sku;
};
