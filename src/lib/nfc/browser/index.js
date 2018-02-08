const { EventEmitter } = require('events');

module.exports = class NFC extends EventEmitter {
    constructor() {
        super();
        console.warn('NFC is not available in browser');
    }

    write(data) {
        console.warn('nfc-write-disabled', data);
    }

    dataToCredit(data, signingKey) {
        console.warn('nfc-data-to-credit-disabled', data);
    }

    creditToData(credit, signingKey) {
        console.warn('nfc-credit-to-data-disabled', credit);
    }
}
