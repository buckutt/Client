const path    = require('path');
const webpack = require('webpack');

module.exports = {
    entry: [
        // 'webpack-dev-server/client?http://localhost:8080',
        // 'webpack/hot/only-dev-server',
        './src/app.js'
    ],

    output: {
        path      : path.join(__dirname, '/public'),
        publicPath: '/',
        filename  : 'bundle.js'
    },

    devtool: 'source-map',

    module: {
        loaders: [
            {
                test   : /\.js$/,
                exclude: /(bower_components|node_modules)/,
                loader : 'babel',
                query  : {
                    presets: ['es2015']
                }
            },
            {
                test  : /\.css$/,
                loader: 'style-loader!css-loader?-url'
            }
        ]
    },

    resolve: {
        extensions: ['', '.js']
    },

    devServer: {
        contentBase: path.join(__dirname, '/public'),
        hot        : true
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.DedupePlugin()
    ]
};
