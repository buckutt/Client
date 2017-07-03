const path = require('path');

const IS_PROD = process.env.NODE_ENV === 'production';

const resolve = function (dir) {
    return path.join(__dirname, '..', dir)
}

const cssLoaders = function (options = {}) {
    const cssLoader = [
        {
            loader: 'vue-style-loader',
            options: {
                sourceMap: true
            }
        },
        {
            loader : 'css-loader',
            options: {
                minimize: IS_PROD,
                importLoaders: 1,
                sourceMap: true
            }
        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: true,
                config: {
                    path: path.join(__dirname, 'postcss.config.js')
                }
            }
        }
    ]

    return {
        css: cssLoader
    };
};

const styleLoaders = function (options) {
    const loaders = cssLoaders(options);

    return Object.keys(loaders).map((extension) => {
        const loader = loaders[extension];

        return {
            test: new RegExp(`\\.${extension}$`),
            use : loader
        };
    });
};

module.exports = { IS_PROD, resolve, cssLoaders, styleLoaders };
