const path = require("path");
const { app, BrowserWindow } = require("electron");
require("./events");

if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    frame: false,
    width: 440,
    height: 260,
    menuBarVisible: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    alwaysOnTop: true,
    transparent: true,
    focusable: true,
  });

  mainWindow.loadFile(path.join(__dirname, "public", "index.html"));
  mainWindow.focus();
};

app.on("ready", createWindow);

app.on("window-all-closed", (e) => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
