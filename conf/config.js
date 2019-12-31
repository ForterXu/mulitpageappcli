const path = require('path');
function resolve(url) {
  return path.resolve(__dirname, '..', url);
}

// 配置修改需重启服务
module.exports = {
  // 页面入口文件的后缀约定
  entryJsSuffix: '.entry.js',
  // npm模块全局引入（按需载入）--新增后需运行 npm run build:dll
  globModule: {
    // bootstrap: ['bootstrap'],
    jquery: ['jquery']
  },
  // 业务代码需要全局引入，从这里配置
  commonEntry: {
    common: resolve('src/common/common.js')
  },
  // 是否包含模板页开发 开启后会在生产打包中将templateDirPath配置位置的文件夹复制到打包生成的目录下
  template: {
    isOpen: false,
    templateDirPath: 'template',
  },
  // dev配置
  dev: {
    // Paths
    assetsSubDirectory: 'static', // 静态资源目录
    assetsPublicPath: '/', // 公共路径--会在在打包生成所有资源之前加上此路径
    resourcePath: 'resource', // 打包生产后的css和js存放文件夹
    basePath: 'dist',
    // devServer
    port: 9000,
    // host: '0.0.0.0',
    proxy: {
      // '/api': "http://localhost:2345"
    }
  },
  // 生产配置
  prod: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    resourcePath: 'resource',
    outputPath: 'dist'
  },
}