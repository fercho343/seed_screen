import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
	app,
	BrowserWindow,
	dialog,
	ipcMain,
	Menu,
	protocol,
	screen,
	type MenuItemConstructorOptions,
} from "electron";
import Store from "electron-store";
import {
	addMedia,
	addSong,
	deleteMedia,
	deleteSong,
	getMedia,
	getSongs,
	importSongs,
	type SongInput,
	updateSong,
} from "./db";
import type { BackgroundItem, ImageAsset } from "./electron-env";
import * as remote from "./remote";
import type { RemoteState } from "./remote";
import * as sync from "./sync";

interface StoreSchema {
	theme: string;
	backgrounds: BackgroundItem[];
	logo: string | null;
	images: ImageAsset[];
}

const store = new Store<StoreSchema>({
	defaults: { theme: "marino", backgrounds: [], logo: null, images: [] },
});

const IMAGE_MIME: Record<string, string> = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".webp": "image/webp",
	".svg": "image/svg+xml",
};

/** Opens a native file picker for images and returns it as a base64 data URL, or null if cancelled. */
function pickImageAsDataUrl(): { name: string; dataUrl: string } | null {
	const result = dialog.showOpenDialogSync({
		properties: ["openFile"],
		filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "gif", "webp", "svg"] }],
	});
	const filePath = result?.[0];
	if (!filePath) return null;
	const ext = path.extname(filePath).toLowerCase();
	const mime = IMAGE_MIME[ext] ?? "application/octet-stream";
	const base64 = fs.readFileSync(filePath).toString("base64");
	return {
		name: path.basename(filePath, ext),
		dataUrl: `data:${mime};base64,${base64}`,
	};
}

const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "m4v"];
const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp"];

const MEDIA_MIME: Record<string, string> = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".webp": "image/webp",
	".mp4": "video/mp4",
	".webm": "video/webm",
	".mov": "video/quicktime",
	".m4v": "video/x-m4v",
};

function mediaDir(): string {
	const dir = path.join(app.getPath("userData"), "media");
	fs.mkdirSync(dir, { recursive: true });
	return dir;
}

// Renderer windows load over http://localhost (dev) or file:// (prod), and Chromium blocks
// <img>/<video> from a non-file origin reading arbitrary file:// paths. A privileged custom
// scheme sidesteps that — it behaves like a normal fetchable origin regardless of how the
// page itself was loaded.
protocol.registerSchemesAsPrivileged([
	{
		scheme: "media",
		privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true, corsEnabled: true },
	},
]);

/**
 * Maps a stored media file path to a `media://file/<name>` URL.
 * The explicit "file" host matters: for a registered standard scheme, `media:///<name>`
 * would parse the filename into the host slot, so we pin a constant host and keep the
 * real filename in the path where the handler reads it back.
 */
function mediaUrlFor(filePath: string): string {
	return `media://file/${encodeURIComponent(path.basename(filePath))}`;
}

/** Opens a native file picker for images/videos, copies the pick into the app's media folder, and adds it to the DB. */
function pickAndAddMedia() {
	const result = dialog.showOpenDialogSync({
		properties: ["openFile", "multiSelections"],
		filters: [{ name: "Media", extensions: [...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS] }],
	});
	for (const filePath of result ?? []) {
		const ext = path.extname(filePath).toLowerCase().slice(1);
		const type = VIDEO_EXTENSIONS.includes(ext) ? "video" : "image";
		const destPath = path.join(mediaDir(), `${randomUUID()}.${ext}`);
		fs.copyFileSync(filePath, destPath);
		addMedia({ type, title: path.basename(filePath, path.extname(filePath)), filePath: destPath });
	}
}

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
			// Output videos must start playing the instant they're sent — there's no user
			// gesture available on the audience screen to satisfy the default autoplay policy.
			autoplayPolicy: "no-user-gesture-required",
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
				click: () => win?.webContents.send("menu-go-black"),
			},
			{
				label: "Show logo",
				accelerator: "L",
				click: () => win?.webContents.send("menu-show-logo"),
			},
			{ type: "separator" as const },
			{
				label: "Remote Control",
				type: "checkbox" as const,
				checked: false,
				accelerator: "CmdOrCtrl+Shift+R",
				click: (menuItem) => {
					if (menuItem.checked) {
						remote.start({
							devServerUrl: VITE_DEV_SERVER_URL,
							distDir: RENDERER_DIST,
							onCommand: (cmd) => win?.webContents.send("remote:command", cmd),
						});
						win?.webContents.send("remote:status-changed", {
							active: true,
							url: remote.getUrl(),
						});
					} else {
						remote.stop();
						win?.webContents.send("remote:status-changed", { active: false, url: null });
					}
				},
			},
		],
	},
];

ipcMain.handle("settings:get-all", () => ({
	theme: store.get("theme"),
	backgrounds: store.get("backgrounds"),
	logo: store.get("logo"),
	images: store.get("images"),
}));

ipcMain.handle("settings:set-theme", (_event, theme: string) => {
	store.set("theme", theme);
	return true;
});

ipcMain.handle("settings:pick-logo", () => {
	const picked = pickImageAsDataUrl();
	if (!picked) return null;
	store.set("logo", picked.dataUrl);
	return picked.dataUrl;
});

ipcMain.handle("settings:clear-logo", () => {
	store.set("logo", null);
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

ipcMain.handle("images:add", () => {
	const picked = pickImageAsDataUrl();
	if (picked) {
		const item: ImageAsset = { id: randomUUID(), ...picked };
		store.set("images", [...store.get("images"), item]);
	}
	return store.get("images");
});

ipcMain.handle("images:delete", (_event, id: string) => {
	store.set(
		"images",
		store.get("images").filter((img) => img.id !== id),
	);
	return store.get("images");
});

ipcMain.handle("sync:get-local-info", () => sync.getLocalInfo());

ipcMain.handle("sync:get-peers", () => sync.getPeers());

ipcMain.handle("sync:search-peers", async () => {
	// Broadcast a fresh announce, then give peers a moment to reply before listing.
	sync.reannounce();
	await new Promise((r) => setTimeout(r, 2500));
	return sync.getPeers();
});

ipcMain.handle("sync:fetch-songs", (_event, ip: string, port: number) => sync.fetchSongs(ip, port));

ipcMain.handle("sync:import-songs", (_event, incoming: SongInput[]) => importSongs(incoming));

ipcMain.handle("remote:get-status", () => ({
	active: remote.isActive(),
	url: remote.isActive() ? remote.getUrl() : null,
}));

ipcMain.handle("remote:push-state", (_event, state: RemoteState) => {
	remote.setState(state);
	return true;
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

ipcMain.handle("output:show-image", (_event, dataUrl: string) => {
	outputWin?.webContents.send("show-image", dataUrl);
	return true;
});

ipcMain.handle("output:show-video", (_event, fileUrl: string) => {
	outputWin?.webContents.send("show-video", fileUrl);
	return true;
});

ipcMain.handle("songs:get-all", () => getSongs());

ipcMain.handle("songs:add", (_event, input: SongInput) => addSong(input));

ipcMain.handle("songs:update", (_event, id: number, input: SongInput) => updateSong(id, input));

ipcMain.handle("songs:delete", (_event, id: number) => deleteSong(id));

function withUrl<T extends { filePath: string }>(rows: T[]) {
	return rows.map((row) => ({ ...row, url: mediaUrlFor(row.filePath) }));
}

ipcMain.handle("media:get-all", () => withUrl(getMedia()));

ipcMain.handle("media:add", () => {
	pickAndAddMedia();
	return withUrl(getMedia());
});

ipcMain.handle("media:delete", (_event, id: number) => {
	const removed = deleteMedia(id);
	if (removed) {
		fs.rm(removed.filePath, { force: true }, () => {});
	}
	return withUrl(getMedia());
});

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
	protocol.handle("media", async (request) => {
		// URLs are media://file/<name> — the filename lives in the path, host is a constant.
		const url = new URL(request.url);
		const name = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
		const filePath = path.join(mediaDir(), name);
		// Guard against the resolved path escaping the media directory (e.g. via "..").
		if (!filePath.startsWith(mediaDir())) {
			return new Response("Forbidden", { status: 403 });
		}
		try {
			const data = await fs.promises.readFile(filePath);
			return new Response(data, {
				headers: { "Content-Type": MEDIA_MIME[path.extname(filePath).toLowerCase()] ?? "application/octet-stream" },
			});
		} catch {
			console.error(`[media] file not found: ${filePath}`);
			return new Response("Not found", { status: 404 });
		}
	});

	createWindow();

	// Construir el menú desde la plantilla
	const menu = Menu.buildFromTemplate(templateMenu);

	// Establecerlo como el menú principal de la app
	Menu.setApplicationMenu(menu);

	screen.on("display-added", () => win?.webContents.send("displays-changed"));
	screen.on("display-removed", () => win?.webContents.send("displays-changed"));

	sync.start((peer) => win?.webContents.send("sync-peer-found", peer));
});

app.on("before-quit", () => {
	sync.stop();
	remote.stop();
});
