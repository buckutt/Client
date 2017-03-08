const webpack = require('webpack');
const merge   = require('webpack-merge');
const utils   = require('./utils');
const base    = require('./webpack.base.config');

module.exports = merge(base, {
    module: {
        rules: utils.styleLoaders()
    },
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: '"development"' },
            'config': require('../config')
        }),
        new webpack.NoEmitOnErrorsPlugin()
    ]
});
