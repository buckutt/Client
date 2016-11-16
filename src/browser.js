const { app, BrowserWindow } = require('electron');
const config                 = require('./config');
const path                   = require('path');
const url                    = require('url');

// global reference
let win;

function createWindow() {
    win = new BrowserWindow({
        fullscreen: true,
        kiosk     : true
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, '..', 'dist', 'index.html'),
        protocol: 'file:',
        slashes : true
    }));

    win.setMenu(null);

    if (!process.env.NODE_ENV || process.env.NODE_ENV.trim() !== 'production') {
        win.webContents.openDevTools();
    }

    win.on('closed', () => {
        // dereference
        win = null;
    });
}

app.on('ready', createWindow);

app.on('certificate-error', (e, webContents, reqUrl, error, certificate, callback) => {
    if (reqUrl.indexOf(config.api) === 0) {
        e.preventDefault();
        callback(true);
    } else {
        callback(false);
    }
});

app.on('window-all-closed', () => app.quit());
