const { BrowserWindow } = require('electron');
const { autoUpdater }   = require('electron-updater');

function notify(title, message) {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length === 0) {
        return;
    }

    windows[0].webContents.send('notify', title, message);
}

module.exports = () => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development') {
        return;
    }

    autoUpdater.signals.updateDownloaded((it) => {
        const msg = `La version ${it.version} a été téléchargée et sera installé automatiquement à la fermeture.`;
        notify('Nouvelle version', msg);
    });

    autoUpdater.checkForUpdates();
};
