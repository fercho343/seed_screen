import { randomUUID } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
	app,
	BrowserWindow,
	ipcMain,
	Menu,
	screen,
	type MenuItemConstructorOptions,
} from "electron";
import Store from "electron-store";
import { addSong, deleteSong, getSongs, type SongInput, updateSong } from "./db";
import type { BackgroundItem } from "./electron-env";

interface StoreSchema {
	theme: string;
	backgrounds: BackgroundItem[];
}

const store = new Store<StoreSchema>({
	defaults: { theme: "marino", backgrounds: [] },
});

interface BibleVerseItem {
	type: string;
	verse_numbers: number[];
	lines: string[];
}

interface BibleChapter {
	chapter_usfm?: string;
	is_chapter?: boolean;
	items: BibleVerseItem[];
}

interface BibleBookRaw {
	book_usfm: string;
	name: string;
	chapters: BibleChapter[];
}

interface BibleData {
	books: BibleBookRaw[];
}

let bibleData: BibleData | null = null;

function getBible(): BibleData {
	if (bibleData) return bibleData;
	const packagedPath = path.join(process.resourcesPath, "bible.json");
	const devPath = path.join(__dirname, "../resources/bible.json");
	const file = fs.existsSync(packagedPath) ? packagedPath : devPath;
	bibleData = JSON.parse(fs.readFileSync(file, "utf-8"));
	return bibleData as BibleData;
}

const BOOK_ABBRS: Record<string, string> = {
	GEN: "Gen", EXO: "Exo", LEV: "Lev", NUM: "Num", DEU: "Deu", JOS: "Jos", JDG: "Jdg", RUT: "Rut",
	"1SA": "1Sa", "2SA": "2Sa", "1KI": "1Ki", "2KI": "2Ki", "1CH": "1Ch", "2CH": "2Ch",
	EZR: "Ezr", NEH: "Neh", EST: "Est", JOB: "Job", PSA: "Psa", PRO: "Pro", ECC: "Ecc",
	SNG: "Sng", ISA: "Isa", JER: "Jer", LAM: "Lam", EZK: "Ezk", DAN: "Dan", HOS: "Hos",
	JOL: "Jol", AMO: "Amo", OBA: "Oba", JON: "Jon", MIC: "Mic", NAM: "Nam", HAB: "Hab",
	ZEP: "Zep", HAG: "Hag", ZEC: "Zec", MAL: "Mal",
	MAT: "Mat", MRK: "Mrk", LUK: "Luk", JHN: "Jhn", ACT: "Act", ROM: "Rom",
	"1CO": "1Co", "2CO": "2Co", GAL: "Gal", EPH: "Eph", PHP: "Php", COL: "Col",
	"1TH": "1Th", "2TH": "2Th", "1TI": "1Ti", "2TI": "2Ti", TIT: "Tit", PHM: "Phm",
	HEB: "Heb", JAS: "Jas", "1PE": "1Pe", "2PE": "2Pe", "1JN": "1Jn", "2JN": "2Jn",
	"3JN": "3Jn", JUD: "Jud", REV: "Rev",
};

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

let outputWin: BrowserWindow | null = null;

function createOutputWindow(displayId?: number) {
	const displays = screen.getAllDisplays();
	const primary = screen.getPrimaryDisplay();
	const target =
		(displayId
			? displays.find((d) => d.id === displayId)
			: displays.find((d) => d.id !== primary.id)) ?? primary;
	const isExternal = target.id !== primary.id;
	const bounds = target.bounds;

	outputWin = new BrowserWindow({
		x: bounds.x,
		y: bounds.y,
		width: bounds.width,
		height: bounds.height,
		// True OS fullscreen only makes sense on a genuine external display —
		// fullscreening the primary display would hide the control window too.
		// A frameless, always-on-top window sized to the full display still
		// covers the whole screen either way.
		fullscreen: isExternal,
		frame: false,
		alwaysOnTop: true,
		backgroundColor: "#000000",
		webPreferences: {
			preload: path.join(__dirname, "preload.mjs"),
		},
	});

	if (VITE_DEV_SERVER_URL) {
		outputWin.loadURL(`${VITE_DEV_SERVER_URL}#output`);
	} else {
		outputWin.loadFile(path.join(RENDERER_DIST, "index.html"), { hash: "output" });
	}

	outputWin.on("closed", () => {
		outputWin = null;
		win?.webContents.send("output-window-closed");
	});
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
		label: "Edit",
		submenu: [
			{ label: "Undo", role: "undo" as const },
			{ label: "Redo", role: "redo" as const },
			{ type: "separator" as const },
			{ label: "Cut", role: "cut" as const },
			{ label: "Copy", role: "copy" as const },
			{ label: "Paste", role: "paste" as const },
			{ label: "Select All", role: "selectAll" as const },
		],
	},
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
				click: () => win?.webContents.send("menu-new-song"),
			},
			{
				label: "New song with AI",
				accelerator: "CmdOrCtrl+Shift+I",
				click: () => win?.webContents.send("menu-new-song-ai"),
			},
		],
	},
	{
		label: "Presentation",
		submenu: [
			{
				label: "Project",
				accelerator: "CmdOrCtrl+P",
				click: () => win?.webContents.send("menu-toggle-output"),
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

ipcMain.handle("output:toggle", (_event, displayId?: number) => {
	if (outputWin) {
		outputWin.close();
		return { opened: false };
	}
	createOutputWindow(displayId);
	return { opened: true };
});

ipcMain.handle("output:get-status", () => ({ isOpen: outputWin !== null }));

ipcMain.handle("displays:get-all", () => {
	const all = screen.getAllDisplays();
	const primary = screen.getPrimaryDisplay();
	return all.map((d) => ({
		id: d.id,
		label: d.id === primary.id ? "Primary Display" : "External Monitor",
		isPrimary: d.id === primary.id,
	}));
});

ipcMain.handle("output:send-slide", (_event, slide: { text: string; settings: unknown }) => {
	outputWin?.webContents.send("show-slide", slide);
	return true;
});

ipcMain.handle("output:go-black", () => {
	outputWin?.webContents.send("go-black");
	return true;
});

ipcMain.handle("songs:get-all", () => getSongs());

ipcMain.handle("songs:add", (_event, input: SongInput) => addSong(input));

ipcMain.handle("songs:update", (_event, id: number, input: SongInput) => updateSong(id, input));

ipcMain.handle("songs:delete", (_event, id: number) => deleteSong(id));

ipcMain.handle("bible:get-books", () => {
	return getBible().books.map((b, i) => ({
		id: b.book_usfm,
		name: b.name,
		abbr: BOOK_ABBRS[b.book_usfm] ?? b.book_usfm,
		chapterCount: b.chapters.filter((c) => c.is_chapter !== false).length,
		index: i,
	}));
});

ipcMain.handle("bible:get-chapter", (_event, bookId: string, chapterNum: number) => {
	const book = getBible().books.find((b) => b.book_usfm === bookId);
	if (!book) return [];
	const chapters = book.chapters.filter((c) => c.is_chapter !== false);
	const chapter = chapters[chapterNum - 1];
	if (!chapter) return [];
	return chapter.items
		.filter((it) => it.type === "verse" && it.verse_numbers.length > 0)
		.map((it) => ({ v: it.verse_numbers[0], t: it.lines.join(" ") }));
});

ipcMain.handle("bible:search", (_event, query: string) => {
	if (!query || query.length < 3) return [];
	const q = query.toLowerCase();
	const results: {
		bookName: string;
		abbr: string;
		chapter: number;
		verse: number;
		text: string;
	}[] = [];
	for (const book of getBible().books) {
		const abbr = BOOK_ABBRS[book.book_usfm] ?? book.book_usfm;
		const chapters = book.chapters.filter((c) => c.is_chapter !== false);
		for (let ci = 0; ci < chapters.length; ci++) {
			for (const it of chapters[ci].items) {
				if (it.type !== "verse" || !it.verse_numbers.length) continue;
				const text = it.lines.join(" ");
				if (text.toLowerCase().includes(q)) {
					results.push({ bookName: book.name, abbr, chapter: ci + 1, verse: it.verse_numbers[0], text });
					if (results.length >= 60) return results;
				}
			}
		}
	}
	return results;
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

	screen.on("display-added", () => win?.webContents.send("displays-changed"));
	screen.on("display-removed", () => win?.webContents.send("displays-changed"));
});
