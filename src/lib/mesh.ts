import type { SlideBackground } from "@/lib/slide-settings";

function parseHexColors(value: string): string[] {
	return value.match(/#[0-9a-fA-F]{3,8}/g) ?? [];
}

function hexToRgb(hex: string): [number, number, number] {
	const h = hex.replace("#", "");
	const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6);
	return [
		parseInt(full.slice(0, 2), 16),
		parseInt(full.slice(2, 4), 16),
		parseInt(full.slice(4, 6), 16),
	];
}

/** Mix a color toward white by `amt` (0..1) so blobs glow against a dark base. */
function lighten(hex: string, amt: number): string {
	const [r, g, b] = hexToRgb(hex);
	const mix = (c: number) => Math.round(c + (255 - c) * amt);
	return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

export interface MeshBlob {
	from: string;
	to: string;
}

/**
 * Derive three glowing radial-gradient blobs from a background's own colors,
 * so the animated "liquid/mesh" effect stays tonally tied to the chosen
 * background instead of using fixed unrelated hues.
 */
export function meshBlobs(bg: SlideBackground): MeshBlob[] {
	let colors = parseHexColors(bg.value);
	if (colors.length === 0) colors = ["#1a1a2e"];
	while (colors.length < 3) colors.push(colors[colors.length - 1]);

	return [
		{ from: lighten(colors[0], 0.45), to: colors[1] },
		{ from: lighten(colors[1], 0.4), to: colors[2 % colors.length] },
		{ from: lighten(colors[2 % colors.length], 0.5), to: colors[0] },
	];
}
