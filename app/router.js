'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.getData.productExpression.asinLists);
  router.get('/api/getData/profitStatistics', controller.getData.profitStatistics.profitMsku);// 爬取利润统计
  router.get('/api/getData/productExpression', controller.getData.productExpression.asinLists);// 爬取产品表现
  router.get('/api/getData/shopList', controller.getData.shopList.getShops); // 爬取店铺数据
  router.get('/api/getData/adGroup', controller.getData.adGroup.getAdGroup);// 爬取广告分组数据
  router.get('/api/getData/sbCampaign', controller.getData.sbCampaign.getSbCampaign); // 爬取SB广告数据
  router.get('/api/getData/skuList', controller.getData.skuList.getSku); // 爬取sku数据


  router.post('/api/statistic/getProfit', controller.statistic.getProfit.profitLists);
  router.get('/api/getData/adReport', controller.getData.adReport.getAds);

};
