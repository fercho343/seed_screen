import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";

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
	| { type: "showImage"; id: string };

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

export interface StartOptions {
	/** Set in dev (vite-plugin-electron sets process.env.VITE_DEV_SERVER_URL); the web app is proxied from there. */
	devServerUrl?: string;
	/** Built renderer directory (contains index.html + remote.html) used in production. */
	distDir: string;
	onCommand: (cmd: RemoteCommand) => void;
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

function localIp(): string {
	for (const addrs of Object.values(os.networkInterfaces())) {
		for (const addr of addrs ?? []) {
			if (addr.family === "IPv4" && !addr.internal) return addr.address;
		}
	}
	return "127.0.0.1";
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

export function start(opts: StartOptions) {
	if (server) return;
	onCommand = opts.onCommand;
	state = EMPTY_STATE;
	server = http.createServer((req, res) => {
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

