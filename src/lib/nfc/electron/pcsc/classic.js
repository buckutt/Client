const config = require('../../../../../config');

module.exports.read = function classic(transmit, log, callback) {
    return transmit(Buffer.from(JSON.parse(config.classic.fileId)), 40)
        .then((data) => {
            const code = data.toString().replace(/\D+/g, '');

            if (code.length > 0) {
                callback(code);

                return true;
            }

            return false;
        });
};

module.exports.write = (data) => {

};

module.exports.ATR = Buffer.from([ 0x3B, 0x8F, 0x80, 0x01, 0x80, 0x4F, 0x0C, 0xA0, 0x00, 0x00, 0x03, 0x06, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x6A ]);
