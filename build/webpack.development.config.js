const webpack = require('webpack');
const merge   = require('webpack-merge');
const utils   = require('./utils');
const base    = require('./webpack.base.config');

module.exports = merge(base, {
    module: {
        rules: utils.styleLoaders()
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'IS_ELECTRON': process.env.ELECTRON ? 'true' : 'false',
            'process.env': { NODE_ENV: '"development"' },
            'config': require('../config')
        }),
        new webpack.NoEmitOnErrorsPlugin()
    ]
});
