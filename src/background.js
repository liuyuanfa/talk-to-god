import { app, protocol, BrowserWindow, Tray, Menu } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require("path");
const iconPath = path.join(__dirname, "../public/icon.png");

let tray; // 托盘设置
let win; // 应用窗口
let flashTrayTimer; // 托盘图标闪烁计时器
let forceQuit = false;
let logined = false;

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  win = new BrowserWindow({
    width: 800,
    minWidth: 800,
    height: 600,
    minHeight: 600,
    // autoHideMenuBar: true,
    icon: iconPath, // 应用图标
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    // if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    win.removeMenu(); // 打包后版本去除菜单栏
    win.loadURL("app://./index.html");
  }
  createTray();
  // tray = new Tray(iconPath);
  // tray.setToolTip("TalkToGod");
  // tray.on("click", () => {
  //   if (win.isVisible()) {
  //     win.hide();
  //   } else {
  //     win.show();
  //   }
  // });
  // tray.on("right-click", () => {
  //   const menuConfig = Menu.buildFromTemplate([
  //     {
  //       label: "退出",
  //       click: () => app.quit(),
  //     },
  //   ]);
  //   tray.popUpContextMenu(menuConfig);
  // });
  win.on("close", (e) => {
    if (logined && !forceQuit) {
      e.preventDefault();
      win.hide();
    } else {
      win = null;
      app.quit();
    }
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("ready", async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   try {
  //     // await installExtension(VUEJS3_DEVTOOLS)
  //   } catch (e) {
  //     console.error("Vue Devtools failed to install:", e.toString());
  //   }
  // }
  createWindow();
});

if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

// 创建托盘图标
function createTray() {
  tray = new Tray(iconPath);
  const menu = Menu.buildFromTemplate([
    {
      label: "打开主界面",
      click: () => {
        if (win.isMinimized()) win.restore();
        win.show();
        flashTray(false);
      },
    },
    {
      label: "退出",
      click: () => {
        if (process.platform !== "darwin") {
          win.show();
          win.webContents.send("clearLogInfo");
          win = null;
          app.quit();
        }
      },
    },
  ]);
  tray.setContextMenu(menu);
  tray.setToolTip("TalkToGod");
  tray.on("click", () => {
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
    flashTray(false);
  });
}

// 托盘图标闪烁
function flashTray(bool) {
  let hasIcon = false;
  if (bool) {
    if (flashTrayTimer) return;
    flashTrayTimer = setInterval(() => {
      tray.setImage(hasIcon ? iconPath : "");
      hasIcon = !hasIcon;
    }, 500);
  } else {
    if (flashTrayTimer) {
      clearInterval(flashTrayTimer);
      flashTrayTimer = null;
    }
    tray.setImage(iconPath);
  }
}

function destroyTray() {
  flashTray(false);
  tray.destroy();
  tray = null;
}
