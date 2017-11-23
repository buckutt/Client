const { EventEmitter }   = require('events');
const NFCReader          = require('./nfc');
const { encode, decode } = require('@buckless/signed-number');

module.exports = class NFC extends EventEmitter {
    constructor() {
        super();

        this.nfc = new NFCReader();

        this.nfc.on('log', (log) => this.emit('log', log))
        this.nfc.on('error', (err) => this.emit('error', err));
        this.nfc.on('reader', () => this.emit('reader'));
        this.nfc.on('uid', (uid) => this.emit('uid', uid));
        this.nfc.on('atr', (atr) => this.emit('atr', atr));
        this.nfc.on('cardType', (cardType) => this.emit('cardType', cardType));
        this.nfc.on('data', (data) => this.emit('data', data));
    }

    write(data) {
        return this.nfc.write(data);
    }

    dataToCredit(data, signingKey) {
        return decode(data, signingKey);
    }

    creditToData(credit, signingKey) {
        return encode(credit, signingKey);
    }
}
