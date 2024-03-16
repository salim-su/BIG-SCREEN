/**
 * For more configuration, please refer to https://angular.io/guide/build#proxying-to-a-backend-server
 *
 * 更多配置描述请参考 https://angular.cn/guide/build#proxying-to-a-backend-server
 *
 * Note: The proxy is only valid for real requests, Mock does not actually generate requests, so the priority of Mock will be higher than the proxy target: 'http://10.10.21.252/api/tjpn4-bulk', // 不要改成线上地址！！！！
 */
module.exports = {
  '/api/tjpn4-bulk': {
    target: 'http://10.10.21.252/api/tjpn4-bulk', // 不要改成线上地址！！！！http://10.10.21.252/api/tjpn4-bulk http://localhost:8099
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    pathRewrite: {
      '^/api/tjpn4-bulk': '/'
    }
  },
  '/api/tjpn4-transport': {
    target: 'http://10.10.21.252/api/tjpn4-transport', // 不要改成线上地址！！！！http://10.10.21.252/api/tjpn4-bulk http://localhost:8099
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    pathRewrite: {
      '^/api/tjpn4-transport': '/'
    }
  },
  '/api/blade': {
    target: 'http://10.10.21.252/',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    pathRewrite: {
      '^/': '/'
    }
  },
  '/api/tjpn4-work-shift': {
    target: 'http://10.10.21.252/api/tjpn4-work-shift',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    pathRewrite: {
      '^/api/tjpn4-work-shift': '/'
    }
  },
  '/api/weighing-room-biz': {
    target: 'http://10.10.21.252/api/weighing-room-biz',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    pathRewrite: {
      '^/api/weighing-room-biz': '/'
    }
  },
  '/api/common-serve': {
    target: 'http://10.10.21.252/api/common-serve',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    pathRewrite: {
      '^/api/common-serve': '/'
    }
  }
};
