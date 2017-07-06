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

const writeData = () => {
    const nfc = new NFC();

    inquirer
        .prompt([
            { type: 'input', name: 'data', message: 'Data to write' }
        ])
        .then(({ data }) => {
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

        if (action === 'Get all data') {
            getAllData();
        }

        if (action === 'Write data') {
            writeData();
        }
    });
