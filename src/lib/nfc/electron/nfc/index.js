const PCSCReader = require('./pcsc');

class NFC {
    constructor(output = true) {
        this.pcsc = new PCSCReader();
        this.nfc  = null // new NFCReader();

        if (output) {
            this.pcsc.on('log', (log) => this.printLog(log));
            this.pcsc.on('cardtype', (type) => this.printOut('cardtype', type));
            this.pcsc.on('uid', (uid) => this.printOut('uid', uid.toString('hex')));
            this.pcsc.on('data', (data) => this.printOut('data', data));
            this.pcsc.on('error', (err) => this.printErr(err.name, err.message));
        }
    }

    write(data) {
        return this.pcsc.write(data);
    }

    printErr(name, message) {
        console.log(JSON.stringify({ type: 'error', name, message }));
    }

    printOut(type = 'data', data) {
        console.log(JSON.stringify({ type, data }));
    }

    printLog(data) {
        console.log(JSON.stringify({ type: 'log', data }));
    }
}

module.exports = NFC;

if (require.main === module) {
    new NFC();
}
