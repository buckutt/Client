/* eslint-disable no-bitwise */

const EventEmitter = require('events');
const Promise      = require('bluebird');

let config = require('../../../../../config');

const classic     = require('./classic');
const desfire     = require('./desfire');
const ultralightC = require('./ultralight-c');

const GET_ATR = Buffer.from([ 0xFF, 0xCA, 0xFA, 0x00, 0x00 ]);
const GET_UID = Buffer.from([ 0xFF, 0xCA, 0x00, 0x00, 0x00 ]);

module.exports = class PCSCLite extends EventEmitter {
    constructor() {
        super();

        this.pcsc     = require('@pokusew/pcsclite')();
        this.reader   = null;
        this.protocol = null;
        this.cardType = null;
        this.uid      = null;
        this.atr      = null;
        this.data     = null;

        this.pcsc.on('reader', (reader) => {
            this.reader = reader;

            this.reader.on('error', (err) => {
                this.emit('error', { name: 'Reader error', message: err.message.toString() });
            });

            this.reader.on('status', (status) => {
                const changes = this.reader.state ^ status.state;
                this.emit('reader');

                if (changes) {
                    if ((changes & this.reader.SCARD_STATE_EMPTY) && (status.state & this.reader.SCARD_STATE_EMPTY)) {
                        this.disconnect();
                    } else if ((changes & this.reader.SCARD_STATE_PRESENT) && (status.state & this.reader.SCARD_STATE_PRESENT)) {
                        setTimeout(() => {
                            this.handleCard();
                        }, 150);
                    }
                }
            });
        });

        this.pcsc.on('error', (err) => {
            this.emit('error', { name: 'PCSC error', message: err.message.toString() });
        });
    }

    connect(...args) {
        return Promise.promisify(this.reader.connect.bind(this.reader))(...args);
    }

    transmit(buf, size = 255) {
        return Promise.promisify(this.reader.transmit.bind(this.reader))(buf, size, this.protocol);
    }

    disconnect() {
        this.reader.disconnect(this.reader.SCARD_LEAVE_CARD, (err) => {
            if (err) {
                this.emit('error', { name: 'Disconnect error', message: err.message.toString() });
            }
        });
    }

    handleCard() {
        this.connect({ share_mode: this.reader.SCARD_SHARE_SHARED })
            .then((protocol) => {
                this.protocol = protocol;

                return this.transmit(GET_UID);
            }).then((uid) => {
                // remove 90 00 success code
                uid = uid.slice(0, -2);
                this.emit('uid', uid);

                this.uid = uid;

                return this.transmit(GET_ATR)
            }).then((ATR) => {
                // remove 90 00 success code
                ATR = ATR.slice(0, -2);

                this.atr = ATR;

                let method

                if (Buffer.compare(ATR, ultralightC.ATR) === 0) {
                    this.cardType = 'ultralightC';

                    method = ultralightC;
                } else if (Buffer.compare(ATR, desfire.ATR) === 0) {
                    this.cardType = 'desfire';

                    method = desfire;
                } else if (Buffer.compare(ATR, classic.ATR) === 0) {
                    this.cardType = 'classic';

                    method = classic;
                } else {
                    this.emit('error', { name: 'Unknown card', message: ATR });
                    return;
                }

                this.emit('atr', this.atr);
                this.emit('cardtype', this.cardType);

                return method.read(
                    (...args) => this.transmit(...args),
                    (log) => this.emit('log', log),
                    (data) => {
                        this.data = data;
                        this.emit('data', data)
                    },
                    (err) => this.emit('error', { name: 'Card error', message: err })
                );
            })
            .catch((err) => {
                this.emit('error', { name: 'Reader error', message: err.message.toString() });
            });
    }

    write(data) {
        let method;

        if (this.cardType === 'ultralightC') {
            method = ultralightC
        }

        return method.write(data,
            (...args) => this.transmit(...args),
            (log) => this.emit('log', log),
            (err) => this.emit('error', { name: 'Card error', message: err })
        );
    }
}

