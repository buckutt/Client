/* eslint-disable no-bitwise */

const Promise  = require('bluebird');
const pcsclite = require('@pokusew/pcsclite');

let config = require('../config');

const classic = require('./classic');
const desfire = require('./desfire');

const pcsc = pcsclite();
function printErr(message, additional) {
    console.log(JSON.stringify({ type: 'error', message, additional }));
}

function printOut(data) {
    console.log(JSON.stringify({ type: 'data', data }));
}

function printLog(data) {
    console.log(JSON.stringify({ type: 'log', data }));
}

let cardPresent = false;

pcsc.on('reader', (reader) => {
    let protocol;

    const connect  = Promise.promisify(reader.connect, { context: reader });
    const transmit = (buf, size) =>
        Promise.promisify(reader.transmit, { context: reader })(buf, size, protocol);

    reader.on('error', (err) => {
        printErr('Reader error', err.message.toString());
    });

    reader.on('status', function readerStatus(status) {
        /* check what has changed */
        const changes = this.state ^ status.state;

        if (changes) {
            if ((changes & this.SCARD_STATE_EMPTY) && (status.state & this.SCARD_STATE_EMPTY)) {
                reader.disconnect(reader.SCARD_LEAVE_CARD, (err) => {
                    if (err) {
                        printErr('Leave error', err.message.toString());
                        return;
                    }

                    if (cardPresent) {
                        process.exit(0);
                    }
                });
            } else if ((changes & this.SCARD_STATE_PRESENT) && (status.state & this.SCARD_STATE_PRESENT)) {
                cardPresent = true;

                let handledCard = false;

                connect({ share_mode: this.SCARD_SHARE_SHARED })
                    .then((protocol_) => {
                        protocol = protocol_;
                    })
                    .then(() =>
                        classic(config, transmit, printLog, printOut, printErr)
                    )
                    .then((wasClassic) => {
                        handledCard = handledCard || wasClassic;

                        if (!wasClassic) {
                            return desfire(config, transmit, printLog, printOut, printErr);
                        }
                    })
                    .then((wasDesfire) => {
                        handledCard = handledCard || wasDesfire;
                    })
                    .then(() => {
                        if (!handledCard) {
                            throw new Error('Unknown card');
                        }
                    })
                    .catch(err =>
                        printErr('Reader error', err.message.toString())
                    );
            }
        }
    });
});

pcsc.on('error', (err) => {
    printErr('PCSC error', err.message.toString());
});
