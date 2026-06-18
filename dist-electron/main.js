import path from "node:path";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow, Menu } from "electron";
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    backgroundColor: "#0e1b2e",
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
const isMac = process.platform === "darwin";
const templateMenu = [
  // En macOS, el primer menú suele ser el nombre de la app.
  // Usamos el operador spread (...) para insertarlo solo si es Mac.
  ...isMac ? [
    {
      label: app.name,
      submenu: [
        { label: "Settings", accelerator: "CmdOrCtrl+," },
        { label: "About", accelerator: "CmdOrCtrl+D" },
        { type: "separator" },
        { role: "quit", label: "Quit" }
      ]
    }
  ] : [],
  {
    label: "Services",
    submenu: [
      {
        label: "Open Service",
        accelerator: "CmdOrCtrl+O",
        click: () => {
          console.log("¡Hola desde el menú del proceso principal!");
        }
      },
      { type: "separator" },
      {
        label: "Save Service",
        accelerator: "CmdOrCtrl+S"
      },
      {
        label: "Save Service As",
        accelerator: "CmdOrCtrl+Shift+S"
      }
    ]
  },
  {
    label: "Add",
    submenu: [
      {
        label: "New Song",
        accelerator: "CmdOrCtrl+N"
      },
      {
        label: "New song with AI",
        accelerator: "CmdOrCtrl+Shift+I"
      }
    ]
  },
  {
    label: "Presentation",
    submenu: [
      {
        label: "Project",
        accelerator: "CmdOrCtrl+P"
      },
      { type: "separator" },
      {
        label: "Show black screen",
        accelerator: "B"
      },
      {
        label: "Show logo",
        accelerator: "L"
      }
    ]
  }
];
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
  const menu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(menu);
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
