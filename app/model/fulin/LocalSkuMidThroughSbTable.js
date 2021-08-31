'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const SkuAd = app.model.define('local_sku_mid_through_sb_table', {
    local_sku_mid: { type: STRING, primaryKey: true },
    portfolio_id: { type: STRING, primaryKey: true },
    name: STRING(30),

  }, {
    timestamps: false,
  });

  SkuAd.associate = function() {
    app.model.Fulin.LocalSkuMidThroughSbTable.belongsTo(app.model.Fulin.LocalSkuMidList, { foreignKey: 'local_sku_mid', targetKey: 'local_sku_mid' });
    // app.model.Fulin.LocalSkuMidThroughSbTable.hasMany(app.model.Fulin.SbCampaign, { foreignKeyConstraint: true, foreignKey: 'portfolio_id', sourceKey: 'portfolio_id' });

  };
  return SkuAd;
};
