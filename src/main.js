process.env.TARGET = 'electron';

const { app, BrowserWindow } = require('electron');
const path     = require('path');
const url      = require('url');
const config   = require('../config');
const NFC      = require('./lib/nfc');
// const updater = require('./lib/updater') TODO: updater

function createWindow() {
    const isDev = (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development');

    window = new BrowserWindow({
        fullscreen: !isDev,
        kiosk     : !isDev
    });

    if (isDev) {
        uri = process.env.URI || 'http://localhost:8081';
    } else {
        uri = url.format({
            pathname: path.join(__dirname, '..', 'dist', 'electron', 'index.html'),
            protocol: 'file:',
            slashes: true
        });
    }

    window.loadURL(uri);
    window.setMenu(null);

    if (isDev) {
        window.webContents.openDevTools();
    }

    window.on('closed', () => {
        // dereference
        window = null;
    });

    window.nfc = new NFC();
    // window.updater = updater(); TODO: updater

    const opts = {
        certificate: JSON.parse(config.certificate.path),
        password   : JSON.parse(config.certificate.password)
    };

    app.importCertificate(opts, result => console.log(result));
}

app.on('ready', createWindow);

app.on('certificate-error', (e, webContents, reqUrl, error, certificate, callback) => {
    e.preventDefault();
    callback(true);
});

app.on('window-all-closed', () => app.quit());
