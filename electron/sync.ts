import dgram from "node:dgram";
import http from "node:http";
import os from "node:os";
import { getSongs } from "./db";
import { broadcastAddresses, localIp } from "./net-util";

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

function packet(type: "hello" | "hello-reply"): Buffer {
	return Buffer.from(
		JSON.stringify({
			app: APP_ID,
			type,
			hostname: os.hostname(),
			port: HTTP_PORT,
			songCount: getSongs().length,
		}),
	);
}

function announce() {
	if (!udpSocket) return;
	const msg = packet("hello");
	// Send to the limited broadcast AND each interface's directed broadcast, so the
	// announce actually leaves the real LAN adapter on multi-homed hosts (Windows).
	for (const target of broadcastAddresses()) {
		try {
			udpSocket.send(msg, 0, msg.length, UDP_PORT, target);
		} catch {
			// some targets may be unreachable on a given host; others still go out
		}
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
		const selfHost = os.hostname();
		udpSocket = dgram.createSocket({ type: "udp4", reuseAddr: true });
		udpSocket.on("error", () => {});
		udpSocket.on("message", (raw, rinfo) => {
			try {
				const data = JSON.parse(raw.toString());
				if (data.app !== APP_ID) return;
				if (data.type !== "hello" && data.type !== "hello-reply") return;
				// Ignore our own broadcast (it can come back on another interface with a
				// different source IP, so match on hostname rather than address).
				if (data.hostname && data.hostname === selfHost) return;

				const peer: Peer = {
					ip: rinfo.address,
					hostname: data.hostname || rinfo.address,
					port: data.port || HTTP_PORT,
					songCount: data.songCount || 0,
					lastSeen: Date.now(),
				};
				peers.set(rinfo.address, peer);
				onPeer?.(peer);

				// Answer a "hello" directly (unicast) so discovery converges even when one
				// side's broadcast can't reach the other (common with Windows + virtual NICs).
				// "hello-reply" is NOT answered, which prevents an endless ping-pong.
				if (data.type === "hello" && udpSocket) {
					const reply = packet("hello-reply");
					try {
						udpSocket.send(reply, 0, reply.length, rinfo.port || UDP_PORT, rinfo.address);
					} catch {
						// ignore unicast failures
					}
				}
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
