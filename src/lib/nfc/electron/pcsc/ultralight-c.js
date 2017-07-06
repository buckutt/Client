const config = require('../../../../../config');

module.exports.read = (transmit, log, callback, err) => {
    return transmit(Buffer.from([ 0xFF, 0xB0, 0x00, 0x00, config.ultralight.cardLength ]))
        .then((data) => {
            // remove first pages (uid, etc.) and success code
            data = data.slice(config.ultralight.firstWritablePage * 4, -2).toString('hex');

            callback(data);
        });
};

module.exports.write = (data, transmit, log, callback, err) => {
    const dataLength = config.ultralight.cardLength - config.ultralight.firstWritablePage * 4;

    const buf    = Buffer.from(data);
    const newBuf = Buffer.alloc(dataLength, 0);
    const subs   = []

    // Copy data inside our fixed-length buffer (length must be divisible by 4)
    for (let i = 0; i < dataLength; ++i) {
        newBuf[i] = buf[i] || 0;
    }

    /**
     * Generate buffers, 4 bytes length, to fill ultralight pages
     */
    let i = 0
    do {
        const subBuf = Buffer.alloc(4, 0);

        subBuf[0] = newBuf[i + 0];
        subBuf[1] = newBuf[i + 1];
        subBuf[2] = newBuf[i + 2];
        subBuf[3] = newBuf[i + 3];

        subs.push(subBuf);

        i = i + 4;
    } while (i <= buf.length);

    let sequence = Promise.resolve();

    // Write in sequence
    i = 0;

    for (let page of subs) {
        sequence = sequence.then(() => {
            console.log(Buffer.from([ 0xFF, 0xD6, 0x00, i + config.ultralight.firstWritablePage, 0x04, ...page ]));
            const res = transmit(Buffer.from([ 0xFF, 0xD6, 0x00, i + config.ultralight.firstWritablePage, 0x04, ...page ]));

            if (res.toString('hex') !== '9000') {
                throw new Error(`Write failed : ${res.toString('hex')}`);
            }
            console.log(res.toString('hex'));

            i = i + 1;
        });
    }

    return sequence.then(() => newBuf);
};

module.exports.ATR = Buffer.from([ 0x3B, 0x8F, 0x80, 0x01, 0x80, 0x4F, 0x0C, 0xA0, 0x00, 0x00, 0x03, 0x06, 0x03, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x68 ]);
