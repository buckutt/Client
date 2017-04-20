const config = require(`./profiles/${process.env.NODE_ENV || 'production'}.json`);

module.exports = config;
