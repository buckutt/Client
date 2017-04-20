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
    target: process.env.ELECTRON ? 'electron-renderer' : 'web',
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
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]',
                    publicPath: '/'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]',
                    publicPath: '/'
                }
            }
        ]
    },
    performance: {
        hints: false
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        port: 8081,
        publicPath: '/'
    },
    devtool: '#eval-source-map'
}
