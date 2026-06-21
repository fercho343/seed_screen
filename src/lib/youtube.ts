/** Extracts the 11-char video id from any common YouTube URL form, or returns null. */
export function parseYouTubeId(input: string): string | null {
	const value = input.trim();
	if (!value) return null;
	// Bare id pasted directly.
	if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;
	try {
		const url = new URL(value);
		const host = url.hostname.replace(/^www\./, "");
		if (host === "youtu.be") {
			const id = url.pathname.slice(1, 12);
			return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
		}
		if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
			const v = url.searchParams.get("v");
			if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
			// /embed/<id>, /shorts/<id>, /live/<id>
			const m = url.pathname.match(/\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/);
			if (m) return m[1];
		}
	} catch {
		// not a URL
	}
	return null;
}

/** Privacy-friendly thumbnail URL for a video id. */
export function youtubeThumbnail(id: string): string {
	return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
}
