const path              = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const IS_PROD = process.env.NODE_ENV === 'production';

const resolve = function (dir) {
    return path.join(__dirname, '..', dir)
}

const cssLoaders = function (options = {}) {
    const cssLoader = {
        loader : 'css-loader',
        options: {
            minimize: IS_PROD
        }
    }

    function generateLoaders (loader, loaderOptions) {
        const loaders = [ cssLoader ];

        if (loader) {
            loaders.push({
                loader : loader + '-loader',
                options: Object.assign({}, loaderOptions)
            });
        }

        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader'
            });
        } else {
            return ['vue-style-loader'].concat(loaders)
        }
    }

    return {
        css : generateLoaders(),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass')
    }
}

const styleLoaders = function (options) {
    const loaders = cssLoaders(options);

    return Object.keys(loaders).map((extension) => {
        const loader = loaders[extension];

        return {
            test: new RegExp(`\\.${extension}$`),
            use : loader
        };
    });
}

module.exports = { IS_PROD, resolve, cssLoaders, styleLoaders };
