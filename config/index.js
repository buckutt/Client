const config = require(`./${process.env.NODE_ENV || 'production'}.json`);

module.exports = config;
