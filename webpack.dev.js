const path = require('path');
const { merge } = require('webpack-merge');

const common = require('./webpack.common');

module.exports = merge(common, {
  output: {
    filename: '[name].js',
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    hot: true,
    open: true,
    static: path.join(__dirname, 'build'),
  },
})
