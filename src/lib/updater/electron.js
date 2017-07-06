const http         = require('http');
const path         = require('path');
const fs           = require('fs');
const { Readable } = require('stream');
// const unzip        = require('unzip');
const EventEmitter = require('events');
const electron     = require('electron');

const UPDATE_TEXT = 'Une mise à jour a été effectuée. Recharger pour mettre à jour ? (cela entraînera une déconnexion)';

function applyUpdate(source, target) {
    const r = new Readable();
    r.push(Buffer.from(source));
    r.push(null);

    r.pipe(unzip.Extract({ path: path.join(__dirname, '..', target) }));
}

// TODO : move to socket.io client listener
function listenToUpdates() {
    const emitter = new EventEmitter();

    const server = http.createServer((req, res) => {
        let body = Buffer.alloc(0);

        req.on('data', (data) => {
            body = Buffer.concat([body, data]);
        });

        req.on('end', () => {
            const update = JSON.parse(body.toString());

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

            return res.end();
        });
    });

    server.listen(8080);

    return emitter;
}

export function init() {
    // electron.remote.getCurrentWindow().updater.on('update', () => {
    //     if (window.confirm(UPDATE_TEXT)) {
    //         nfc.restartNFC();
    //         require('child_process').execSync('yarn install');
    //         location.reload(true);
    //     }
    // });

    // TODO
}
