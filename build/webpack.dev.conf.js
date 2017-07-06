var utils = require('./utils')
var webpack = require('webpack')
var config = require('./config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var PostCompile = require('post-compile-webpack-plugin')
var shell = require('shelljs')
var path = require('path')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
      'config': require('../config')
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin(),
    new PostCompile(() => {
      if (process.env.TARGET === 'cordova') {
        shell.rm('-r', path.join(__dirname, '..', 'cordova', 'www'))
        shell.cp('-r', path.join(__dirname, '..', 'dist', process.env.TARGET), path.join(__dirname, '..', 'cordova', 'www'))
        shell.cd(path.join(__dirname, '..', 'cordova'))

        if  (process.env.PLATFORM === 'android') {
          shell.exec('cordova run android')
        }
      }
    })
  ]
})
