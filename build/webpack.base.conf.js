const path = require('path')
const utils = require('./utils')
const config = require('./config')
const vueLoaderConfig = require('./vue-loader.conf')
const chalk = require('chalk')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

let base = {
  entry: {
    app: './src/app/index.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/@buckless/signed-number'),
          resolve('node_modules/ws'),
          resolve('node_modules/engine.io-client')
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}

if (process.env.TARGET === 'browser' || process.env.TARGET === 'cordova') {
  base.target = 'web'
} else if (process.env.TARGET === 'electron') {
  base.target = 'electron-renderer'
  base.node = { __dirname: false }
} else {
    console.log(chalk.yellow('Unknown target: ' + process.env.TARGET))
}

module.exports = base;
