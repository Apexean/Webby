const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Create BrowserView (the actual web content)
    const view = new BrowserView({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.setBrowserView(view);
    view.setBounds({ x: 0, y: 48, width: 1000, height: 652 });
    view.webContents.loadURL("https://www.bing.com");

    // Load your UI
    win.loadFile("index.html");

    // ⭐ NAVIGATION EVENTS ⭐

    // Address bar navigation
    ipcMain.on("navigate", (event, url) => {
        if (!url.startsWith("http")) {
            url = "https://www.bing.com/search?q=" + encodeURIComponent(url);
        }
        view.webContents.loadURL(url);
    });

    // Back button
    ipcMain.on("back", () => {
        if (view.webContents.canGoBack()) {
            view.webContents.goBack();
        }
    });

    // Forward button
    ipcMain.on("forward", () => {
        if (view.webContents.canGoForward()) {
            view.webContents.goForward();
        }
    });

    // Home button
    ipcMain.on("home", () => {
        view.webContents.loadURL("https://www.bing.com");
    });

    // ⭐ UPDATE ADDRESS BAR WHEN PAGE CHANGES ⭐
    view.webContents.on("did-navigate", (event, url) => {
        win.webContents.send("update-address", url);
    });

    view.webContents.on("did-navigate-in-page", (event, url) => {
        win.webContents.send("update-address", url);
    });

    // ⭐ DOWNLOAD SUPPORT ⭐
    view.webContents.session.on("will-download", (event, item) => {
        const filePath = path.join(app.getPath("downloads"), item.getFilename());
        item.setSavePath(filePath);

        item.on("updated", () => {
            const percent = Math.round(item.getReceivedBytes() / item.getTotalBytes() * 100);
            console.log(`Downloading: ${percent}%`);
        });

        item.on("done", (e, state) => {
            if (state === "completed") {
                console.log("Download complete:", filePath);
            } else {
                console.log("Download failed:", state);
            }
        });
    });
}

app.whenReady().then(createWindow);
