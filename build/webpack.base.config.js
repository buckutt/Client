const path    = require('path');
const webpack = require('webpack');
const utils   = require('./utils');

module.exports = {
  entry: utils.resolve('./src/main.js'),
  output: {
    path: utils.resolve('./dist'),
    filename: 'app.js',
    publicPath: './'
  },
  target: 'electron-renderer',
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': utils.resolve('src'),
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: utils.cssLoaders({ extract: utils.IS_PROD })
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [ utils.resolve('src') ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'static/img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}
