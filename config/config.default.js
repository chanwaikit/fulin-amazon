/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
    // 加载 errorHandler 中间件
    middleware: [ 'errorHandler' ],
    // 只对 /api 前缀的 url 路径生效
    errorHandler: {
      match: '/api',
    },
  };

  config.workerStartTimeout = 10 * 60 * 1000 * 144;

  config.serverTimeout = null;

  config.sequelize = {
    dialect: 'mysql',
    host: '39.108.231.99',
    port: 3402,
    database: 'fulin_amazon',
    username: 'luke',
    password: 'Fulinluke*',
  };
  config.security = {
    csrf: false,
    ctoken: false,
  };
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1627442989859_4481';
  config.httpclient = {
    request: {
      // 默认 request 超时时间
      timeout: 5000000,
    },
  };
  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
