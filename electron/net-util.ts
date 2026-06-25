import os from "node:os";

// Adapter names that are almost never the real LAN: VM/container/VPN/Apple-internal.
const VIRTUAL_RE =
	/(vethernet|virtualbox|vmware|hyper-?v|wsl|default switch|loopback|docker|tailscale|zerotier|utun|llw|awdl|bridge|ppp|tun|tap)/i;

interface Iface {
	name: string;
	address: string;
	netmask: string;
}

function candidates(): Iface[] {
	const out: Iface[] = [];
	for (const [name, addrs] of Object.entries(os.networkInterfaces())) {
		for (const a of addrs ?? []) {
			if (a.family !== "IPv4" || a.internal) continue;
			if (a.address.startsWith("169.254.")) continue; // APIPA / link-local
			out.push({ name, address: a.address, netmask: a.netmask });
		}
	}
	return out;
}

// Higher score = more likely to be the real LAN interface the router is on.
function score(i: Iface): number {
	let s = 0;
	if (VIRTUAL_RE.test(i.name)) s -= 100;
	if (i.address.startsWith("192.168.56.")) s -= 60; // VirtualBox host-only default
	if (i.address.startsWith("192.168.")) s += 30;
	else if (i.address.startsWith("10.")) s += 25;
	else if (/^172\.(1[6-9]|2\d|3[01])\./.test(i.address)) s += 10; // often Docker/WSL/Hyper-V
	return s;
}

/** Best guess at the machine's reachable LAN IPv4 address. */
export function localIp(): string {
	const list = candidates();
	if (list.length === 0) return "127.0.0.1";
	list.sort((a, b) => score(b) - score(a));
	return list[0].address;
}

function directedBroadcast(address: string, netmask: string): string | null {
	const a = address.split(".").map(Number);
	const m = netmask.split(".").map(Number);
	if (a.length !== 4 || m.length !== 4 || [...a, ...m].some(Number.isNaN)) return null;
	return a.map((oct, idx) => (oct & m[idx]) | (~m[idx] & 0xff)).join(".");
}

/**
 * Broadcast targets for UDP discovery. On a multi-homed host (common on Windows),
 * the limited 255.255.255.255 broadcast only leaves one OS-chosen interface, so we
 * also target each interface's subnet-directed broadcast (e.g. 192.168.1.255) to make
 * sure announcements actually reach the LAN the peers are on.
 */
export function broadcastAddresses(): string[] {
	const set = new Set<string>(["255.255.255.255"]);
	for (const i of candidates()) {
		const b = directedBroadcast(i.address, i.netmask);
		if (b) set.add(b);
	}
	return [...set];
}
