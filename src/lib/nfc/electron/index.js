const EventEmitter = require('events');
const { spawn }    = require('child_process');
// const nfc          = require('./nfc');

module.exports = class NFC extends EventEmitter {
    constructor() {
        super();
        console.warn('NFC is not available in electron');
        this.listenNFC();
    }

    listenNFC() {
        // TODO
        console.log('Listening on NFC');
    }
};
