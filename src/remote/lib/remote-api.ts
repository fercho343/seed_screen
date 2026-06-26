import { useEffect, useState } from "react";
import type { RemoteCommand, RemoteState } from "../../../electron/electron-env";

export function send(cmd: RemoteCommand) {
	fetch("/api/command", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(cmd),
	}).catch(() => {});
}

export function useRemoteState() {
	const [state, setState] = useState<RemoteState | null>(null);
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		const es = new EventSource("/api/events");
		es.onmessage = (ev) => {
			setState(JSON.parse(ev.data));
			setConnected(true);
		};
		es.onerror = () => setConnected(false);
		return () => es.close();
	}, []);

	return { state, connected };
}
