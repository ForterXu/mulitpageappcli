const utils = require('./utils');
const webpack = require('webpack');
const conf = require('./config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const devMode = process.env.NODE_ENV != 'production';
const { resolve } = require('./utils');
const { commonEntry,globModule } = require('./config');

// 构建entry、plugin
const entryMap = utils.getEntryList();
const htmlPluginArr = utils.getHtmlWebpackPlugin(entryMap,commonEntry,devMode);
const DllRepluginArr = utils.getDLLreference(globModule,devMode);
const pagesNum = htmlPluginArr.length;

module.exports = {
  entry: {...commonEntry, ...entryMap},
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            outputPath: `${devMode ? conf.dev.resourcePath : conf.prod.resourcePath}/images/`,
            name: '[name]_[hash].[ext]',
            mimetype: 'image/png',
            esModule: false
          }
        }]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: devMode,
              reloadAll: true,
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: devMode,
              reloadAll: true,
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src',':src']
          }
        }
      }
    ]
  },
  plugins: [
    ...htmlPluginArr,
    ...DllRepluginArr,
    new MiniCssExtractPlugin({
      filename: devMode ? `${conf.dev.resourcePath}/css/[name].css` : `${conf.prod.resourcePath}/css/[name].[hash].css`,
      chunkFilename: devMode ? `${conf.dev.resourcePath}/css/[id].css` : `${conf.prod.resourcePath}/css/[id].[hash].css`,
    }),
    new CopyWebpackPlugin([{
      from: resolve(devMode ? conf.dev.assetsSubDirectory : conf.prod.assetsSubDirectory),
      to: devMode ? conf.dev.assetsSubDirectory : conf.prod.assetsSubDirectory,
      ignore: ['.*']
    }]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      popper: 'popper'
    }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    moduleIds: hashed,
    namedChunks: true,
    runtimeChunk: {
      name: 'runtime'
    },
    usedExports: true,
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            name: 'vendors',
            // chunks: 'initial'
        },
        base: {
            name: 'base',
            minChunks: Math.ceil(pagesNum/3),
            priority: -20,
            reuseExistingChunk: true
        },
        corejs: {
          test: /[\\/]node_modules[\\/](core-js|raf|@babel|babel)[\\/]/,
          name: 'corejs',
          // minChunks: Math.ceil(pagesNum/2),
          priority: -9,
          reuseExistingChunk: true
        }
      }
    }
  },
  resolve: {
    extensions: ['.js'],
    mainFiles: ['index'],
    alias: {
      'src': resolve('src'),
      'static': resolve('static')
    }
  }
}
