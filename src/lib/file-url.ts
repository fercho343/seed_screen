/** Converts an absolute filesystem path (as stored in the media DB) into a `file://` URL usable in <img>/<video> src. */
export function toFileUrl(filePath: string): string {
	const normalized = filePath.replace(/\\/g, "/");
	const prefix = normalized.startsWith("/") ? "file://" : "file:///";
	return prefix + encodeURI(normalized);
}
