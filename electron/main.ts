import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow, ipcMain, Menu, type MenuItemConstructorOptions } from "electron";
import Store from "electron-store";
import type { BackgroundItem } from "./electron-env";

interface StoreSchema {
	theme: string;
	backgrounds: BackgroundItem[];
}

const store = new Store<StoreSchema>({
	defaults: { theme: "marino", backgrounds: [] },
});

// In dev mode the app runs unpackaged, so Electron reports its own binary
// name ("Electron") in the macOS menu bar unless we override it explicitly.
app.setName("SeedScreen");

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
// biome-ignore lint/complexity/useLiteralKeys: false positive
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
	? path.join(process.env.APP_ROOT, "public")
	: RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
	win = new BrowserWindow({
		width: 1920,
		height: 1080,
		backgroundColor: "#0e1b2e",
		icon: path.join(process.env.VITE_PUBLIC, "logo.png"),
		webPreferences: {
			preload: path.join(__dirname, "preload.mjs"),
		},
	});

	// Test active push message to Renderer-process.
	win.webContents.on("did-finish-load", () => {
		win?.webContents.send("main-process-message", new Date().toLocaleString());
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(RENDERER_DIST, "index.html"));
	}
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
		win = null;
	}
});

const isMac = process.platform === "darwin";

const templateMenu: MenuItemConstructorOptions[] = [
	// En macOS, el primer menú suele ser el nombre de la app.
	// Usamos el operador spread (...) para insertarlo solo si es Mac.
	...(isMac
		? [
				{
					label: app.name,
					submenu: [
						{
							label: "Settings",
							accelerator: "CmdOrCtrl+,",
							click: () => win?.webContents.send("open-settings"),
						},
						{ label: "About", accelerator: "CmdOrCtrl+D" },
						{ type: "separator" as const },
						{ role: "quit" as const, label: "Quit" },
					],
				},
			]
		: []),

	{
		label: "Services",
		submenu: [
			{
				label: "Open Service",
				accelerator: "CmdOrCtrl+O",
				click: () => {
					console.log("¡Hola desde el menú del proceso principal!");
				},
			},
			{ type: "separator" as const },
			{
				label: "Save Service",
				accelerator: "CmdOrCtrl+S",
			},
			{
				label: "Save Service As",
				accelerator: "CmdOrCtrl+Shift+S",
			},
		],
	},
	{
		label: "Add",
		submenu: [
			{
				label: "New Song",
				accelerator: "CmdOrCtrl+N",
			},
			{
				label: "New song with AI",
				accelerator: "CmdOrCtrl+Shift+I",
			},
		],
	},
	{
		label: "Presentation",
		submenu: [
			{
				label: "Project",
				accelerator: "CmdOrCtrl+P",
			},
			{ type: "separator" as const },
			{
				label: "Show black screen",
				accelerator: "B",
			},
			{
				label: "Show logo",
				accelerator: "L",
			},
		],
	},
];

function getLocalIp(): string {
	const nets = os.networkInterfaces();
	for (const ifaceList of Object.values(nets)) {
		for (const addr of ifaceList ?? []) {
			if (addr.family === "IPv4" && !addr.internal) return addr.address;
		}
	}
	return "127.0.0.1";
}

ipcMain.handle("settings:get-all", () => ({
	theme: store.get("theme"),
	backgrounds: store.get("backgrounds"),
}));

ipcMain.handle("settings:set-theme", (_event, theme: string) => {
	store.set("theme", theme);
	return true;
});

ipcMain.handle(
	"backgrounds:add",
	(_event, bg: { name: string; type: "color" | "gradient"; value: string }) => {
		const item: BackgroundItem = { id: randomUUID(), ...bg };
		store.set("backgrounds", [...store.get("backgrounds"), item]);
		return item;
	},
);

ipcMain.handle("backgrounds:delete", (_event, id: string) => {
	store.set(
		"backgrounds",
		store.get("backgrounds").filter((bg) => bg.id !== id),
	);
	return true;
});

ipcMain.handle("sync:get-local-info", () => ({
	hostname: os.hostname(),
	ip: getLocalIp(),
	port: 3847,
}));

ipcMain.handle("sync:search-peers", async () => {
	// LAN discovery server isn't wired up yet — surface an empty result for now.
	return [];
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.whenReady().then(() => {
	createWindow();

	// Construir el menú desde la plantilla
	const menu = Menu.buildFromTemplate(templateMenu);

	// Establecerlo como el menú principal de la app
	Menu.setApplicationMenu(menu);
});
