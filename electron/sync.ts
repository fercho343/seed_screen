import dgram from "node:dgram";
import http from "node:http";
import os from "node:os";
import { getSongs } from "./db";

const HTTP_PORT = 3847;
const UDP_PORT = 3848;
const APP_ID = "seedscreen";

export interface Peer {
	ip: string;
	hostname: string;
	port: number;
	songCount: number;
	lastSeen: number;
}

const peers = new Map<string, Peer>();
let httpServer: http.Server | null = null;
let udpSocket: dgram.Socket | null = null;
let announceTimer: NodeJS.Timeout | null = null;

function localIp(): string {
	for (const addrs of Object.values(os.networkInterfaces())) {
		for (const addr of addrs ?? []) {
			if (addr.family === "IPv4" && !addr.internal) return addr.address;
		}
	}
	return "127.0.0.1";
}

function announce() {
	if (!udpSocket) return;
	const msg = Buffer.from(
		JSON.stringify({
			app: APP_ID,
			type: "hello",
			hostname: os.hostname(),
			port: HTTP_PORT,
			songCount: getSongs().length,
		}),
	);
	try {
		udpSocket.send(msg, 0, msg.length, UDP_PORT, "255.255.255.255");
	} catch {
		// broadcast may fail transiently; next interval retries
	}
}

export function start(onPeer?: (peer: Peer) => void) {
	if (!httpServer) {
		httpServer = http.createServer((req, res) => {
			res.setHeader("Content-Type", "application/json");
			res.setHeader("Access-Control-Allow-Origin", "*");
			if (req.url === "/api/info") {
				res.end(JSON.stringify({ hostname: os.hostname(), songCount: getSongs().length, port: HTTP_PORT, app: APP_ID }));
			} else if (req.url === "/api/songs") {
				res.end(JSON.stringify({ songs: getSongs() }));
			} else {
				res.writeHead(404);
				res.end("{}");
			}
		});
		httpServer.on("error", () => {});
		httpServer.listen(HTTP_PORT, "0.0.0.0");
	}

	if (!udpSocket) {
		const self = localIp();
		udpSocket = dgram.createSocket({ type: "udp4", reuseAddr: true });
		udpSocket.on("error", () => {});
		udpSocket.on("message", (raw, rinfo) => {
			if (rinfo.address === self) return;
			try {
				const data = JSON.parse(raw.toString());
				if (data.app !== APP_ID || data.type !== "hello") return;
				const peer: Peer = {
					ip: rinfo.address,
					hostname: data.hostname || rinfo.address,
					port: data.port || HTTP_PORT,
					songCount: data.songCount || 0,
					lastSeen: Date.now(),
				};
				peers.set(rinfo.address, peer);
				onPeer?.(peer);
			} catch {
				// ignore malformed packets
			}
		});
		udpSocket.bind(UDP_PORT, () => {
			udpSocket?.setBroadcast(true);
			announce();
		});
		announceTimer = setInterval(announce, 6000);
	}
}

export function getLocalInfo() {
	return { ip: localIp(), hostname: os.hostname(), port: HTTP_PORT, songCount: getSongs().length };
}

export function getPeers(): Peer[] {
	const cutoff = Date.now() - 20000;
	const active: Peer[] = [];
	for (const [ip, peer] of peers) {
		if (peer.lastSeen > cutoff) active.push(peer);
		else peers.delete(ip);
	}
	return active;
}

export function reannounce() {
	announce();
}

export function fetchSongs(ip: string, port: number): Promise<unknown[]> {
	return new Promise((resolve, reject) => {
		const req = http.request(
			{ hostname: ip, port: port || HTTP_PORT, path: "/api/songs", method: "GET", timeout: 8000 },
			(res) => {
				let data = "";
				res.on("data", (c) => {
					data += c;
				});
				res.on("end", () => {
					try {
						resolve(JSON.parse(data).songs ?? []);
					} catch {
						reject(new Error("Invalid response"));
					}
				});
			},
		);
		req.on("timeout", () => {
			req.destroy();
			reject(new Error("Timed out"));
		});
		req.on("error", (e) => reject(new Error(e.message)));
		req.end();
	});
}

export function stop() {
	if (announceTimer) clearInterval(announceTimer);
	udpSocket?.close();
	httpServer?.close();
	announceTimer = null;
	udpSocket = null;
	httpServer = null;
}
