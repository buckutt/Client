const inquirer = require('inquirer');
const NFC      = require('.');

process.env.NFC_TO_FILE = false
process.env.NFC_TO_CONSOLE = false

const freeREPL = () => {
    const nfc = new NFC();

    inquirer
        .prompt([
            { type: 'input', name: 'adpu', message: 'ADPU to send « FF CA 00 00 00 ».' }
        ])
        .then(({ adpu }) => {
            adpu = adpu.split(' ').map(x => parseInt(x, 16))

            adpu = Buffer.from(adpu);
            nfc.pcsc.transmit(adpu)
                .then((data) => console.log(data))
                .catch((err) => console.log(err))
                .then(() => freeREPL())
        });
}

const getUid = () => {
    const nfc = new NFC();

    nfc.pcsc.on('uid', (uid) => {
        console.log(uid.toString('hex'));

        process.exit(0);
    });
};

const getAtr = () => {
    const nfc = new NFC();

    nfc.pcsc.on('atr', (data) => {
        console.log(data.toString('hex'));
    });

    nfc.pcsc.on('cardtype', (data) => {
        console.log(data);
        process.exit(0);
    });
};

const getAllData = () => {
    const nfc = new NFC();

    nfc.pcsc.on('data', (data) => {
        console.log(data.toString('hex'));
        process.exit(0);
    });
};

const getCredit = () => {
    const nfc = new NFC();

    nfc.pcsc.on('data', (data) => {
        const { decode }     = require('@buckless/signed-number');
        const signingKey     = JSON.parse(require('../../../../config/profiles/production').signingKey);
        const { creditSize } = require('../../../../config/profiles/production').ultralight;

        console.log(decode(data, signingKey));

        process.exit(0);
    });
};

const writeCredit = () => {
    const nfc = new NFC();

    inquirer
        .prompt([
            { type: 'input', name: 'credit', message: 'Credit (in cts)' }
        ])
        .then(({ credit }) => {
            const { encode }     = require('@buckless/signed-number');
            const signingKey     = JSON.parse(require('../../../../config/profiles/production').signingKey);
            const { creditSize } = require('../../../../config/profiles/production').ultralight;

            const cipher = encode(parseInt(credit, 10), signingKey, creditSize);

            nfc.pcsc.write(cipher)
                .then((newData) => {
                    console.log('\\o/');
                    process.exit(0);
                })
                .catch((err) => {
                    console.error(err);
                    process.exit(1);
                });
        })
};

const writeData = () => {
    const nfc = new NFC();

    inquirer
        .prompt([
            { type: 'input', name: 'data', message: 'Data to write' },
            { type: 'confirm', name: 'isHex', message: 'Raw hex ?' }
        ])
        .then(({ data, isHex }) => {
            data = isHex ? Buffer.from(data, 'hex') : data

            console.log('input:', data)

            nfc.pcsc.write(data)
                .then((newData) => {
                    console.log('old data:', nfc.pcsc.data);
                    console.log('new data:', newData.toString('hex'));
                    process.exit(0);
                })
                .catch((err) => {
                    console.error(err);
                    process.exit(1);
                });
        });
};

inquirer
    .prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Choose what to do',
            choices: [
                'Free REPL',
                'Get UID',
                'Get ATR / Card Type',
                'Read credit',
                'Write credit',
                'Get all data',
                'Write data'
            ]
        }
    ])
    .then(({ action }) => {
        if (action === 'Free REPL') {
            freeREPL();
        }

        if (action === 'Get UID') {
            getUid();
        }

        if (action === 'Get ATR / Card Type') {
            getAtr();
        }

        if (action === 'Read credit') {
            getCredit();
        }

        if (action === 'Write credit') {
            writeCredit();
        }

        if (action === 'Get all data') {
            getAllData();
        }

        if (action === 'Write data') {
            writeData();
        }
    });
