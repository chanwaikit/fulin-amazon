'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Sku = app.model.define('local_sku_mid_list', {
    local_sku_mid: { type: STRING, primaryKey: true, autoIncrement: true },
    local_sku: STRING(30),
    mid: STRING(30),
    local_name: STRING(30),
    country: STRING(30),
    cid: STRING(30),
    category_text: STRING(30),
    code: STRING(30),
    icon: STRING(30),
    bid: STRING(30),
  }, {
    timestamps: false,
  });


  Sku.associate = function() {
    // app.model.Fulin.LocalSkuMidList.hasMany(app.model.Fulin.SpCampaign, { foreignKeyConstraint: true, foreignKey: 'local_sku_mid', sourceKey: 'local_sku_mid' });
    // app.model.Fulin.LocalSkuMidList.hasMany(app.model.Fulin.SdCampaign, { foreignKeyConstraint: true, foreignKey: 'local_sku_mid', sourceKey: 'local_sku_mid' });
    app.model.Fulin.LocalSkuMidList.hasMany(app.model.Fulin.SpGroup, { foreignKeyConstraint: true, foreignKey: 'local_sku_mid', sourceKey: 'local_sku_mid' });

    app.model.Fulin.LocalSkuMidList.belongsToMany(app.model.Fulin.LocalSkuMidSbGroup, {
      through: app.model.Fulin.LocalSkuMidThroughSbTable,
      foreignKey: 'local_sku_mid',
      otherKey: 'portfolio_id',
      foreignKeyConstraint: true,
    });
  };
  return Sku;
};
