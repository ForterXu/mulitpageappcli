const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConf = require('./webpack.base');
const { dev } = require('../app.config');
const path = require('path');

module.exports = merge(baseConf, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  output: {
    filename: `${dev.resourcePath}/js/[name].js`,
    publicPath: dev.assetsPublicPath
  }, 
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: path.resolve(__dirname, '../', dev.basePath),
    open: true,
    port: dev.port || 3000,
    hot: true,
    // hotOnly: true,
    proxy: Object.assign({},dev.proxy)
  }
});