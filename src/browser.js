const { app, BrowserWindow } = require('electron');
const path                   = require('path');
const url                    = require('url');
const updater                = require('./browser.updater');

// global reference
let win;

function createWindow() {
    const isDev = (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development');

    win = new BrowserWindow({
        fullscreen: !isDev,
        kiosk     : !isDev
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, '..', 'dist', 'index.html'),
        protocol: 'file:',
        slashes : true
    }));

    win.setMenu(null);

    if (isDev) {
        win.webContents.openDevTools();
    }

    win.on('closed', () => {
        // dereference
        win = null;
    });

    win.updater = updater();
}

app.on('ready', createWindow);

app.on('certificate-error', (e, webContents, reqUrl, error, certificate, callback) => {
    e.preventDefault();
    callback(true);
});

app.on('window-all-closed', () => app.quit());
