const { app, BrowserWindow, BrowserView } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    const view = new BrowserView();
    win.setBrowserView(view);
    view.setBounds({ x: 0, y: 50, width: 1000, height: 650 });
    view.webContents.loadURL("https://www.google.com");

    win.loadFile("index.html");

    // Listen for search requests from the HTML
    const { ipcMain } = require("electron");
    ipcMain.on("search", (event, query) => {
        view.webContents.loadURL("https://www.google.com/search?q=" + encodeURIComponent(query));
    });
}

app.whenReady().then(createWindow);
