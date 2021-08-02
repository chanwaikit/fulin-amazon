'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Sku = app.model.define('ad_group', {
    portfolio_id: { type: STRING, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    profile_id: STRING(30),
    sid: STRING(30),
    type: STRING(30),

  }, {
    timestamps: false,
  });

  Sku.associate = function() {
    app.model.Fulin.AdGroup.hasMany(app.model.Fulin.SbCampaign, { foreignKey: 'portfolio_id', sourceKey: 'portfolio_id' });

    app.model.Fulin.AdGroup.belongsToMany(app.model.Fulin.SkuList, {
      through: app.model.Fulin.SkuListAdGroup,
      foreignKey: 'portfolio_id',
      otherKey: 'local_sku_sid',
    });

  };
  return Sku;
};
