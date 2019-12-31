const path = require('path');
const webpack = require('webpack');
const { globModule } = require('../app.config');

module.exports = {
  mode: 'production',
  entry: globModule,
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.resolve(__dirname, '../dll/[name].manifest.json')
    })
  ]
}