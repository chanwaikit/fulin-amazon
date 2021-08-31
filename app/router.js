'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/test', controller.home.index); // 测试爬虫
  router.get('/api/getData/profitStatistics', controller.getData.profitStatistics.profitMsku);// 爬取利润统计
  router.get('/api/getData/productExpression', controller.getData.productExpression.asinLists);// 爬取产品表现
  router.get('/api/getData/shopList', controller.getData.shopList.getShops); // 爬取店铺数据
  router.get('/api/getData/adGroup', controller.getData.adGroup.getAdGroup);// 爬取广告分组数据
  router.get('/api/getData/sbCampaign', controller.getData.sbCampaign.getSbCampaign); // 爬取SB广告数据
  router.get('/api/getData/spCampaign', controller.getData.spCampaign.getSpCampaign); // 爬取SP广告数据
  router.get('/api/getData/sdCampaign', controller.getData.sdCampaign.getSdCampaign); // 爬取SD广告数据
  router.get('/api/getData/category', controller.getData.category.getCategory); // 爬取sku分类 美妆、电子产品
  router.get('/api/getData/skuList', controller.getData.skuList.getSku); // 爬取sku数据
  router.get('/api/statistic/createLocalSkuMidTable', controller.createTable.createTable.createTable); // 建立大的宽表

  // new
  router.get('/api/getData/getSkuMidList', controller.getData.skuList.getSkuMid); // 爬取sku_mid数据
  router.get('/api/getData/getRate', controller.getData.rate.getRate); // 爬取sku_mid数据


  router.get('/api/getData/adReport', controller.getData.adReport.getAds);
  router.post('/api/lingxing/updatePrice', controller.lingXing.getKeyword.updatePrice);
  router.post('/api/lingxing/storeAdPosition', controller.lingXing.getKeyword.storeAdPosition);
  router.post('/api/lingxing/getKeyword', controller.lingXing.getKeyword.index);

  router.post('/api/statistic/getProfit', controller.statistic.getProfit.profitLists);
  router.post('/api/statistic/getSkuWeekStatistic', controller.statistic.getProfit.getSkuWeekStatistic);

  router.post('/api/statistic/getSkuAdTable', controller.statistic.getSkuAdTable.getSkuAdTable);
  router.post('/api/statistic/getAdGroup', controller.statistic.getAdGroup.getAdGroup);
  router.post('/api/statistic/updateAdGroup', controller.statistic.getAdGroup.updateAdGroup);
  router.post('/api/statistic/getAdStatistic', controller.statistic.getAdStatistic.getAdStatistic);

  router.post('/api/statistic/getAllStatistic', controller.statistic.getAdStatistic.getAllStatistic);
  router.post('/api/statistic/getCountryStatistic', controller.statistic.getAdStatistic.getCountryStatistic);
  router.post('/api/statistic/getSkuStatistic', controller.statistic.getAdStatistic.getSkuStatistic);
  router.post('/api/statistic/getLocalSkuMidList', controller.statistic.getLocalSkuMidList.getLocalSkuMidList);


};

