const path         = require('path');
const fs           = require('fs');
const { Readable } = require('stream');
const EventEmitter = require('events');
const socketio     = require('socket.io-client');
const unzip        = require('unzip');

function applyUpdate(source, target) {
    const r = new Readable();
    r.push(Buffer.from(source));
    r.push(null);

    r.pipe(unzip.Extract({ path: path.join(__dirname, '..', target) }));
}

let io;

module.exports = function (token) {
    if (io) {
        io.close();
    }

    const emitter = new EventEmitter();

    io = socketio(config.api, {
        strictSSL         : false,
        rejectUnauthorized: false,
        extraHeaders      : {
            origin       : 'https://localhost:3006',
            Authorization: `Bearer ${token}`
        }
    });

    io.on('connected', () => {
        io.on('update', (update) => {
            if (update.hasOwnProperty('data')) {
                applyUpdate(update.data, 'dist');
            }

            if (update.hasOwnProperty('nfc')) {
                applyUpdate(update.nfc, 'nfc');
            }

            if (update.hasOwnProperty('package')) {
                fs.writeFileSync(path.join(__dirname, '..', 'package.json', update.package));
            }

            emitter.emit('update');
        });
    });

    return emitter;
}
