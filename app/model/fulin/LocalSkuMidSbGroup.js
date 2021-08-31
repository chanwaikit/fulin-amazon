'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Sku = app.model.define('local_sku_mid_sb_group', {
    portfolio_id: { type: STRING, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    profile_id: STRING(30),
    sid: STRING(30),
    type: STRING(30),

  }, {
    timestamps: false,
  });

  Sku.associate = function() {
    app.model.Fulin.LocalSkuMidSbGroup.hasMany(app.model.Fulin.SbCampaign, { foreignKey: 'portfolio_id', sourceKey: 'portfolio_id' });
    app.model.Fulin.LocalSkuMidSbGroup.belongsTo(app.model.Fulin.ShopList, { foreignKey: 'sid', targetKey: 'sid' });

    app.model.Fulin.LocalSkuMidSbGroup.belongsToMany(app.model.Fulin.LocalSkuMidList, {
      through: app.model.Fulin.LocalSkuMidThroughSbTable,
      foreignKey: 'portfolio_id',
      otherKey: 'local_sku_mid',
    });

  };
  return Sku;
};
