'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const SkuAd = app.model.define('sku_sb_table', {
    local_sku_sid: { type: STRING, primaryKey: true },
    portfolio_id: { type: STRING, primaryKey: true },
    local_sku_mid: STRING(30),
    name: STRING(30),

  }, {
    timestamps: false,
  });

  SkuAd.associate = function() {
    app.model.Fulin.SkuListSbGroup.belongsTo(app.model.Fulin.SkuList, { foreignKey: 'local_sku_sid', targetKey: 'local_sku_sid' });
    app.model.Fulin.SkuListSbGroup.hasMany(app.model.Fulin.SbCampaign, { foreignKeyConstraint: true, foreignKey: 'portfolio_id', sourceKey: 'portfolio_id' });
    // app.model.Fulin.SkuListSbGroup.hasMany(app.model.Fulin.SpCampaign, { foreignKeyConstraint: true, foreignKey: 'local_sku_sid', sourceKey: 'local_sku_sid' });
    // app.model.Fulin.SkuListSbGroup.hasMany(app.model.Fulin.SdCampaign, { foreignKeyConstraint: true, foreignKey: 'local_sku_sid', sourceKey: 'local_sku_sid' });

  };
  return SkuAd;
};
