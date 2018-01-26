const io     = require('socket.io-client');
const fs     = require('fs');
const config = require('../../../config');

const opts = {
    pfx               : fs.readFileSync(JSON.parse(config.certificate.path)),
    passphrase        : JSON.parse(config.certificate.password),
    rejectUnauthorized: false
};

module.exports = () => io(JSON.parse(config.api), opts);
