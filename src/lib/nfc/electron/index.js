const fs           = require('fs');
const path         = require('path');
const EventEmitter = require('events');
const PCSCReader   = require('./pcsc');

class NFC extends EventEmitter {
    constructor() {
        super();

        this.pcsc = new PCSCReader();
        this.nfc  = null; // new NFCReader();

        this.pcsc.on('log', (log) => this.emit('log', log))
        this.pcsc.on('error', (err) => this.emit('error', err));
        this.pcsc.on('reader', () => this.emit('reader'));
        this.pcsc.on('uid', (uid) => this.emit('uid', uid));
        this.pcsc.on('atr', (atr) => this.emit('atr', atr));
        this.pcsc.on('cardType', (cardType) => this.emit('cardType', cardType));
        this.pcsc.on('data', (data) => this.emit('data', data));
    }

    write(data) {
        return this.pcsc.write(data);
    }
}

module.exports = NFC;

if (require.main === module) {
    new NFC();
}
