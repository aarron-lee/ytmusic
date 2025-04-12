const { app, BrowserWindow, Tray, Menu } = require("electron");
const path = require("path");
const { initializeSettings, IS_WINDOW_HIDDEN } = require("./src/settings");
const { setItem, getItem } = initializeSettings(app);

let win;
let tray;

async function createWindow() {
  const show = !getItem(IS_WINDOW_HIDDEN);
  win = new BrowserWindow({
    useContentSize: true,
    show,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.setMenuBarVisibility(false);

  // win.webContents.openDevTools();

  createTray();

  tray.on("click", () => {
    const toggleWindow = () => {
      const windowIsVisible = win.isVisible();
      if (windowIsVisible) {
        win.hide();
        setItem(IS_WINDOW_HIDDEN, true);
      } else {
        win.show();
        setItem(IS_WINDOW_HIDDEN, false);
      }
    };
    toggleWindow();
  });

  win.loadURL("https://music.youtube.com");
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function createTray() {
  tray = new Tray(path.join(__dirname, "./img/icon.png"));

  const contextMenu = createContextMenu();

  tray?.setToolTip("ytmusic");
  tray?.setContextMenu(contextMenu);
}

function createContextMenu() {
  const toggleWindow = () => {
    const windowIsVisible = win.isVisible();
    if (windowIsVisible) {
      win.hide();
      setItem(IS_WINDOW_HIDDEN, true);
    } else {
      win.show();
      setItem(IS_WINDOW_HIDDEN, false);
    }
  };

  const contextMenu = Menu.buildFromTemplate([
    { label: "Toggle Window", click: toggleWindow },
    { label: "Quit", click: () => app.quit() },
  ]);

  return contextMenu;
}

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
