import {app, BrowserWindow} from 'electron';

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 280, height: 300, frame: false, resizable: false});
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    if (process.env.NODE_ENV == "develop") {
        mainWindow.openDevTools();
    }
    
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