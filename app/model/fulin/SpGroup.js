'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Sku = app.model.define('local_sku_mid_sp_group', {
    portfolio_id: { type: STRING, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    profile_id: STRING(30),
    sid: STRING(30),
    type: STRING(30),
    local_sku_mid: STRING(30),
    local_sku_sid: STRING(30),
  }, {
    timestamps: false,
  });

  Sku.associate = function() {
    // app.model.Fulin.SbGroup.hasMany(app.model.Fulin.SbCampaign, { foreignKey: 'portfolio_id', sourceKey: 'portfolio_id' });
    app.model.Fulin.SpGroup.belongsTo(app.model.Fulin.ShopList, { foreignKey: 'sid', targetKey: 'sid' });

    // app.model.Fulin.SbGroup.belongsToMany(app.model.Fulin.SkuList, {
    //   through: app.model.Fulin.SkuListSbGroup,
    //   foreignKey: 'portfolio_id',
    //   otherKey: 'local_sku_sid',
    // });

  };
  return Sku;
};
