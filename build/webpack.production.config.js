const webpack               = require('webpack');
const merge                 = require('webpack-merge');
const utils                 = require('./utils');
const base                  = require('./webpack.base.config');
const OptimizeCSSPlugin     = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin     = require('html-webpack-plugin')
const ClosureCompilerPlugin = require('webpack-closure-compiler');

module.exports = merge(base, {
    output: {
        path: utils.resolve('./dist'),
        filename: 'app.js',
        publicPath: '/'
    },
    module: {
        rules: utils.styleLoaders({ extract: true })
    },
    devtool: false,
    plugins: [
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: '"production"' }
        }),
        new ClosureCompilerPlugin({
            compiler: {
                language_in: 'ECMASCRIPT6',
                language_out: 'ECMASCRIPT5',
                compilation_level: 'SIMPLE',
                warning_level: 'QUIET'
            },
            jsCompiler: true
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new ExtractTextPlugin({
            filename: 'static/css/[name].css'
        }),
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
