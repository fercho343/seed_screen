import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import type { BibleBook, BibleLang, BibleVerse, MediaRecord, SongRecord } from "./electron-env";
import { localIp } from "./net-util";

const PORT = 3849;

const MIME: Record<string, string> = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".woff2": "font/woff2",
	".json": "application/json; charset=utf-8",
};

export interface RemoteServiceSlideInput {
	id: string;
	label: string;
	text: string;
	reference?: string;
	translations?: Record<string, string>;
	mediaUrl?: string;
	youtubeId?: string;
}

export interface RemoteServiceItemInput {
	sourceId: string;
	type: "song" | "bible" | "image" | "video" | "youtube";
	title: string;
	subtitle?: string;
	language?: string;
	slides: RemoteServiceSlideInput[];
}

export interface RemoteBackground {
	type: "color" | "gradient";
	value: string;
}

export interface RemoteServiceItem {
	scheduleId: string;
	title: string;
	type: string;
	slideCount: number;
	/** First slide's text, or the upcoming slide's text when this item is live. */
	previewText: string;
}

export interface RemoteSlide {
	id: string;
	label: string;
	text: string;
}

export interface RemoteImage {
	id: string;
	name: string;
	dataUrl: string;
}

export type RemoteScreenMode =
	| { kind: "black" }
	| { kind: "logo" }
	| { kind: "image"; id: string }
	| null;

export interface RemoteState {
	outputOpen: boolean;
	background: RemoteBackground;
	items: RemoteServiceItem[];
	selectedItemId: string | null;
	slides: RemoteSlide[];
	selectedSlideId: string | null;
	liveItemId: string | null;
	liveSlideId: string | null;
	liveText: string | null;
	screenMode: RemoteScreenMode;
	logo: string | null;
	images: RemoteImage[];
}

export type RemoteCommand =
	| { type: "next" }
	| { type: "prev" }
	| { type: "black" }
	| { type: "selectItem"; itemId: string }
	| { type: "goLive"; itemId: string; slideId: string }
	| { type: "toggleOutput" }
	| { type: "showLogo" }
	| { type: "showImage"; id: string }
	| { type: "addToService"; item: RemoteServiceItemInput }
	| { type: "reorderService"; fromIndex: number; toIndex: number };

const EMPTY_STATE: RemoteState = {
	outputOpen: false,
	background: { type: "color", value: "#000000" },
	items: [],
	selectedItemId: null,
	slides: [],
	selectedSlideId: null,
	liveItemId: null,
	liveSlideId: null,
	liveText: null,
	screenMode: null,
	logo: null,
	images: [],
};

let server: http.Server | null = null;
let state: RemoteState = EMPTY_STATE;
let onCommand: ((cmd: RemoteCommand) => void) | null = null;
const clients = new Set<http.ServerResponse>();

export interface RemoteLibrary {
	getSongs: () => SongRecord[];
	getBibleBooks: (lang: BibleLang) => BibleBook[];
	getBibleChapter: (bookId: string, chapter: number, lang: BibleLang) => BibleVerse[];
	getMedia: () => MediaRecord[];
	getMediaFile: (id: number) => { filePath: string; mimeType: string } | null;
}

export interface StartOptions {
	/** Set in dev (vite-plugin-electron sets process.env.VITE_DEV_SERVER_URL); the web app is proxied from there. */
	devServerUrl?: string;
	/** Built renderer directory (contains index.html + remote.html) used in production. */
	distDir: string;
	onCommand: (cmd: RemoteCommand) => void;
	/** Read-only data the Library page needs — the remote is a plain browser page with no IPC access. */
	library: RemoteLibrary;
}

async function serveDev(devServerUrl: string, reqUrl: string, res: http.ServerResponse) {
	const target = devServerUrl.replace(/\/$/, "") + (reqUrl === "/" ? "/remote.html" : reqUrl);
	try {
		const upstream = await fetch(target);
		res.writeHead(upstream.status, {
			"Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
		});
		res.end(Buffer.from(await upstream.arrayBuffer()));
	} catch {
		res.writeHead(502);
		res.end("Remote dev server unreachable");
	}
}

function serveStatic(distDir: string, reqUrl: string, res: http.ServerResponse) {
	const urlPath = reqUrl === "/" ? "/remote.html" : reqUrl.split("?")[0];
	const filePath = path.join(distDir, decodeURIComponent(urlPath));
	if (!filePath.startsWith(distDir)) {
		res.writeHead(403);
		res.end();
		return;
	}
	fs.readFile(filePath, (err, data) => {
		if (err) {
			res.writeHead(404);
			res.end();
			return;
		}
		res.setHeader("Content-Type", MIME[path.extname(filePath)] ?? "application/octet-stream");
		res.end(data);
	});
}

export function setState(next: RemoteState) {
	state = next;
	const payload = `data: ${JSON.stringify(state)}\n\n`;
	for (const res of clients) res.write(payload);
}

export function isActive(): boolean {
	return server !== null;
}

export function getUrl(): string {
	return `http://${localIp()}:${PORT}`;
}

function sendJson(res: http.ServerResponse, data: unknown) {
	res.writeHead(200, {
		"Content-Type": "application/json; charset=utf-8",
		"Access-Control-Allow-Origin": "*",
	});
	res.end(JSON.stringify(data));
}

function bibleLang(value: string | null): BibleLang {
	return value === "en" ? "en" : "es";
}

export function start(opts: StartOptions) {
	if (server) return;
	onCommand = opts.onCommand;
	state = EMPTY_STATE;
	server = http.createServer((req, res) => {
		const url = new URL(req.url ?? "/", "http://localhost");

		if (req.method === "GET" && url.pathname === "/api/library/songs") {
			sendJson(res, opts.library.getSongs());
			return;
		}
		if (req.method === "GET" && url.pathname === "/api/library/bible/books") {
			sendJson(res, opts.library.getBibleBooks(bibleLang(url.searchParams.get("lang"))));
			return;
		}
		if (req.method === "GET" && url.pathname === "/api/library/bible/chapter") {
			const bookId = url.searchParams.get("book") ?? "";
			const chapter = Number(url.searchParams.get("chapter"));
			sendJson(res, opts.library.getBibleChapter(bookId, chapter, bibleLang(url.searchParams.get("lang"))));
			return;
		}
		if (req.method === "GET" && url.pathname === "/api/library/media") {
			sendJson(res, opts.library.getMedia());
			return;
		}
		if (req.method === "GET" && url.pathname.startsWith("/api/media-file/")) {
			const id = Number(url.pathname.slice("/api/media-file/".length));
			const file = Number.isFinite(id) ? opts.library.getMediaFile(id) : null;
			if (!file) {
				res.writeHead(404);
				res.end();
				return;
			}
			res.setHeader("Content-Type", file.mimeType);
			fs.createReadStream(file.filePath).pipe(res);
			return;
		}
		if (req.method === "GET" && req.url === "/api/events") {
			res.writeHead(200, {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
				"Access-Control-Allow-Origin": "*",
			});
			res.write(`data: ${JSON.stringify(state)}\n\n`);
			clients.add(res);
			req.on("close", () => clients.delete(res));
			return;
		}
		if (req.method === "POST" && req.url === "/api/command") {
			let body = "";
			req.on("data", (chunk) => {
				body += chunk;
			});
			req.on("end", () => {
				try {
					onCommand?.(JSON.parse(body) as RemoteCommand);
				} catch {
					// ignore malformed command
				}
				res.setHeader("Access-Control-Allow-Origin", "*");
				res.end("{}");
			});
			return;
		}
		if (req.method === "GET" && req.url) {
			if (opts.devServerUrl) serveDev(opts.devServerUrl, req.url, res);
			else serveStatic(opts.distDir, req.url, res);
			return;
		}
		res.writeHead(404);
		res.end();
	});
	server.on("error", () => {});
	server.listen(PORT, "0.0.0.0");
}

export function stop() {
	for (const res of clients) res.end();
	clients.clear();
	server?.close();
	server = null;
	onCommand = null;
	state = EMPTY_STATE;
}

