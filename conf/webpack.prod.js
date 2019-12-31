const merge = require('webpack-merge');
const baseConf = require('./webpack.base');
const { prod,template } = require('../app.config');
const { resolve } = require('./utils');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let templateCopyPlugin = [];
if(template.isOpen) {
  templateCopyPlugin.push(new CopyWebpackPlugin([{
    from: resolve(template.templateDirPath),
    to: resolve(template.templateDirPath),
    ignore: ['.*']
  }]))
}

module.exports = merge(baseConf, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  output: {
    filename: `${prod.resourcePath}/js/[name].[contentHash].js`,
    path: resolve(prod.outputPath),
    publicPath: prod.assetsPublicPath
  },
  plugins: [
    ...templateCopyPlugin,
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true
    }),
    new OptimizeCssAssetsPlugin()
  ]
})