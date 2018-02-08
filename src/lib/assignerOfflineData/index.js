if (process.env.TARGET === 'electron') {
    module.exports = require('./browser');
} else {
    module.exports = require('./'+process.env.TARGET);
}
