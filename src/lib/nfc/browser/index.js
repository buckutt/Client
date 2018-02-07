const { EventEmitter } = require('events');

module.exports = class NFC extends EventEmitter {
    constructor() {
        super();
        console.warn('NFC is not available in browser');
    }

    listenNFC() {
        console.log('Listening on NFC');
    }
}
