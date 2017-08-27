module.exports = require(`./profiles/${process.env.NODE_ENV || 'production'}.json`);

module.exports.api = module.exports.api.replace(/\/$/, '');
