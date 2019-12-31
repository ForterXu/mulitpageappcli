const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const conf = require('./config');

// 获取路径
function resolve(url) {
  return path.join(__dirname, '..', url);
}

// 动态读取pages下的入口js，并且组装成entry对象
function getEntryList(pagesRoot = 'src/pages') {
  let pagesList = glob.sync(pagesRoot + `/**/*${conf.entryJsSuffix}`);
  let entryMap = {};
  for(let pageUrl of pagesList) {
    let startIndex = pageUrl.lastIndexOf('/');
    if(startIndex == -1) {
      break;
    } else {
      startIndex++;
    }
    let pageName = pageUrl.slice(startIndex,-conf.entryJsSuffix.length);
    entryMap[pageName] = path.resolve(__dirname, '../',pageUrl);
  }
  return entryMap;
}

// 动态生成HtmlWebpackPlugin
function getHtmlWebpackPlugin(entryMap = {},commonEntry = {},devMode = true) {
  let htmlWebpackPluginArr = [];
  let commonChunksArr = [];
  for(let key in commonEntry) {
    commonChunksArr.push(key);
  }
  for(let key in entryMap) {
    let entryPath = entryMap[key].replace(conf.entryJsSuffix,'.html');
    let index = entryPath.lastIndexOf('pages');
    htmlWebpackPluginArr.push(new HtmlWebpackPlugin({
      template: entryPath,
      filename: entryPath.slice(index + 6),
      chunks: ['runtime', 'corejs', 'vendors', 'base', ...commonChunksArr, key],
      minify: devMode ? {} : {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      hash: !devMode
    }));
  }
  return htmlWebpackPluginArr;
}

// 动态生成DLLreference
function getDLLreference(globModule = {},devMode = true) {
  let DllrePlugins = [];
  for(let key in globModule) {
    DllrePlugins.push(new AddAssetHtmlWebpackPlugin({
      filepath: resolve(`dll/${key}.dll.js`),
      outputPath: `${devMode ? conf.dev.resourcePath : conf.prod.resourcePath}/js/dll/`,
      publicPath: `${devMode ? conf.dev.assetsPublicPath + conf.dev.resourcePath : conf.prod.assetsPublicPath + conf.prod.resourcePath}/js/dll`
    }));
    DllrePlugins.push(new webpack.DllReferencePlugin({
      manifest: resolve(`dll/${key}.manifest.json`)
    }));
  }
  return DllrePlugins;
}

module.exports =  { getEntryList,getHtmlWebpackPlugin,resolve,getDLLreference };