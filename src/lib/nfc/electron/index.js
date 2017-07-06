const fs         = require('fs');
const path       = require('path');
const shell      = require('shelljs');
const PCSCReader = require('./pcsc');

const OUTPUT_FILE = path.join(__dirname, '..', 'nfc.out');

class NFC {
    constructor() {
        this.pcsc = new PCSCReader();
        this.nfc  = null; // new NFCReader();

        shell.rm('-rf', OUTPUT_FILE);
        this.file = fs.createWriteStream(OUTPUT_FILE, { flags: 'a' });

        this.pcsc.on('log', (log) => this.printLog(log));
        this.pcsc.on('cardtype', (type) => this.printOut('cardtype', type));
        this.pcsc.on('uid', (uid) => this.printOut('uid', uid.toString('hex')));
        this.pcsc.on('data', (data) => this.printOut('data', data));
        this.pcsc.on('error', (err) => this.printErr(err.name, err.message));
    }

    write(data) {
        return this.pcsc.write(data);
    }

    printErr(name, message) {
        const out = JSON.stringify({ type: 'error', name, message });

        if (process.env.NFC_TO_FILE) {
            this.file.write(out + '\n', 'utf8');
        }

        if (process.env.NFC_TO_CONSOLE) {
            console.log(out);
        }
    }

    printOut(type = 'data', data) {
        const out = JSON.stringify({ type, data });

        if (process.env.NFC_TO_FILE) {
            this.file.write(out + '\n', 'utf8');
        }

        if (process.env.NFC_TO_CONSOLE) {
            console.log(out);
        }
    }

    printLog(data) {
        const out = JSON.stringify({ type: 'log', data });

        if (process.env.NFC_TO_FILE) {
            this.file.write(out + '\n', 'utf8');
        }

        if (process.env.NFC_TO_CONSOLE) {
            console.log(out);
        }
    }
}

module.exports = NFC;

if (require.main === module) {
    new NFC();
}