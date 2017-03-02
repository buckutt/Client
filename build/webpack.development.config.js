const webpack           = require('webpack');
const merge             = require('webpack-merge');
const utils             = require('./utils');
const base              = require('./webpack.base.config');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(base, {
    module: {
        rules: utils.styleLoaders()
    },
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: '"development"' }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: utils.resolve('dist/index.html'),
            template: utils.resolve('index.html'),
            inject  : true
        })
    ]
});
