const { IS_PROD } = require('./utils');

module.exports = IS_PROD ?
    require('./webpack.production.config') :
    require('./webpack.development.config');
