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


  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'learn-mysql',
    username: 'root',
    password: '88888888',
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
