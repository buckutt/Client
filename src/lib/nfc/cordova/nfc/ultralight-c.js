const EventEmitter = require('events');
const Promise      = require('bluebird');

let config = require('../../../../../config');

module.exports = class UltralightC extends EventEmitter {
    constructor() {
        super();

        document.addEventListener('mifareTagDiscovered', (tag) => {
            console.log(tag);
            this.emit('uid', tag.tag.map((dec) => dec.toString(16)).join(''));
            this.emit('log', tag.tag.map((dec) => dec.toString(16)).join(''));
            this.emit('atr', module.exports.ATR);
            this.emit('cardType', 'ultralightC');

            console.time('NFC Write');

            this
                .connect()
                .then(() => this.read())
                .then((data) => {
                    this.emit('data', data.slice(0, config.ultralight.creditSize));
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            window.mifare.disconnect(
                () => { resolve(); },
                err => { reject(err); }
            );
        });
    }

    connect() {
        return new Promise((resolve, reject) => {
            window.mifare.connect(
                () => { resolve(); },
                err => { reject(err); }
            );
        });
    }

    read() {
        const { firstWritablePage, cardLength, creditSize } = config.ultralight;

        const repeat = Math.ceil(cardLength / 4);

        let initialPromise = Promise.resolve();

        const bufs = [];

        // add 4 each time (read 16 bytes each time)
        for (let page = 4; page < repeat; page += 4) {
            initialPromise = initialPromise.then(() => {
                return new Promise((resolve, reject) => {
                    window.mifare.read(
                        page,
                        (res) => {
                            bufs.push(res.data);
                            resolve();
                        },
                        (err) => {
                            console.log('err', err);
                            reject(err);
                        });
                });
            });
        }

        return initialPromise.then(() => bufs.join(''));
    }

    write(data) {
        const dataLength = config.ultralight.cardLength - config.ultralight.firstWritablePage * 4;

        const buf    = Buffer.from(data);
        const newBuf = Buffer.alloc(dataLength, 0);
        const subs   = [];

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
            sequence = sequence
                .then(() => {
                    return new Promise((resolve, reject) => {
                        window.mifare.write(
                            i + config.ultralight.firstWritablePage,
                            Array.from(page).map(int => int.toString(16)),
                            (res) => resolve(res),
                            (err) => {
                                console.log('error from write', err);
                                reject(err);
                            });
                    });
                })
                .then((res) => {
                    i = i + 1;
                });
        }

        return sequence
            .then(() => newBuf)
            .catch((err) => {
                throw new Error(`Write failed : ${err}`);
            });
    }
}

module.exports.ATR = Buffer.from([ 0x3B, 0x8F, 0x80, 0x01, 0x80, 0x4F, 0x0C, 0xA0, 0x00, 0x00, 0x03, 0x06, 0x03, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x68 ]);
