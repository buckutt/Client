const webpack           = require('webpack');
const merge             = require('webpack-merge');
const utils             = require('./utils');
const base              = require('./webpack.base.config');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(base, {
    module: {
        rules: utils.styleLoaders()
    },
    devtool: false,
    plugins: [
        new webpack.DefinePlugin({
            'IS_ELECTRON': 'true',
            'process.env': { NODE_ENV: '"production"' },
            'config': require('../config')
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new OptimizeCSSPlugin(),
        new HtmlWebpackPlugin({
            filename: utils.resolve('dist/index.html'),
            template: utils.resolve('index.html'),
            inject  : true,
            minify  : {
                removeComments       : true,
                collapseWhitespace   : true,
                removeAttributeQuotes: true
            }
        })
    ]
});
