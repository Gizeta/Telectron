import {app, BrowserWindow} from 'electron';

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 310, height: 300, frame: false, resizable: false});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});