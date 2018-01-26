module.exports = require(`./profiles/${process.env.NODE_ENV || 'production'}.json`);

console.log(module.exports);

module.exports.api = module.exports.api.replace(/\/$/, '');
