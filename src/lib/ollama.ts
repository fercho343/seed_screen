import type { SlideRecord } from "../../electron/electron-env";

export const OLLAMA_URL = "http://localhost:11434";
export const SLIDE_LABELS = ["V1", "V2", "V3", "V4", "V5", "CHORUS", "BRIDGE", "INTRO", "OUTRO"];

const SLIDE_PROMPT = (chunk: string) =>
	`Divide song lines into presentation slides (max 4 lines each). Use | to join lines.
Labels: V1/V2/V3/V4 (verse), CHORUS, BRIDGE, INTRO, OUTRO.
Return ONLY a JSON array, no explanations: [{"label":"V1","text":"line1 | line2 | line3"}]

${chunk}

JSON:`;

export async function translateTextWithAI(
	model: string,
	text: string,
	targetLanguageName: string,
): Promise<string> {
	const prompt = `Translate the following song lyrics to ${targetLanguageName}. Keep the line breaks. Return ONLY the translated lyrics, no explanations, no quotes:\n\n${text}`;
	const res = await fetch(`${OLLAMA_URL}/api/generate`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ model, prompt, stream: false, options: { temperature: 0.2 } }),
	});
	const data = await res.json();
	return (data.response || "").trim();
}

export async function checkOllama(): Promise<{ ok: boolean; models: string[] }> {
	try {
		const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(3000) });
		const data = await res.json();
		const models = (data.models || []).map((m: { name: string }) => m.name);
		return { ok: true, models };
	} catch {
		return { ok: false, models: [] };
	}
}

export async function detectLanguageWithAI(model: string, sampleText: string): Promise<string | null> {
	const sample = sampleText.split("\n").filter(Boolean).slice(0, 6).join("\n");
	if (!sample.trim() || !model) return null;
	try {
		const res = await fetch(`${OLLAMA_URL}/api/generate`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model,
				prompt: `Detect the language of the following song lyrics. Return ONLY a two-letter ISO 639-1 code (es, en, fr, pt, de, it, zh, ko, ja). Nothing else:\n\n${sample}`,
				stream: false,
				options: { temperature: 0, num_predict: 4 },
			}),
		});
		const data = await res.json();
		return (data.response || "").trim().toLowerCase().slice(0, 2);
	} catch {
		return null;
	}
}

export async function searchLyricsWithAI(
	model: string,
	title: string,
	author: string,
	onToken: (full: string) => void,
): Promise<string> {
	const byLine = author.trim() ? ` by ${author.trim()}` : "";
	const prompt = `Write the complete and accurate song lyrics for "${title.trim()}"${byLine}.
Return ONLY the lyrics. Organize them with clear section labels like "Verse 1", "Chorus", "Bridge", etc. before each section.
Do not add any explanation, intro text, or commentary. Just the raw lyrics with section labels.`;
	const res = await fetch(`${OLLAMA_URL}/api/generate`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ model, prompt, stream: true, options: { temperature: 0.2, num_predict: 2048 } }),
	});
	if (!res.body) throw new Error("No response stream");
	const reader = res.body.getReader();
	const decoder = new TextDecoder();
	let full = "";
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		for (const line of decoder.decode(value).split("\n")) {
			if (!line.trim()) continue;
			try {
				const j = JSON.parse(line);
				if (j.response) {
					full += j.response;
					onToken(full);
				}
			} catch {
				// partial token line — ignore, more tokens will complete it
			}
		}
	}
	return full.trim();
}

function splitIntoChunks(lyrics: string, maxChars = 500): string[] {
	const paragraphs = lyrics
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter(Boolean);
	const chunks: string[] = [];
	let current: string[] = [];
	let currentLen = 0;

	for (const para of paragraphs) {
		const lines = para.split("\n");
		const subParas: string[] = [];
		if (para.length > maxChars) {
			const mid = Math.ceil(lines.length / 2);
			subParas.push(lines.slice(0, mid).join("\n"));
			subParas.push(lines.slice(mid).join("\n"));
		} else {
			subParas.push(para);
		}
		for (const sp of subParas) {
			if (currentLen + sp.length > maxChars && current.length > 0) {
				chunks.push(current.join("\n\n"));
				current = [sp];
				currentLen = sp.length;
			} else {
				current.push(sp);
				currentLen += sp.length;
			}
		}
	}
	if (current.length) chunks.push(current.join("\n\n"));
	return chunks;
}

async function streamOllama(
	model: string,
	prompt: string,
	signal: AbortSignal,
	onToken: (full: string) => void,
): Promise<string> {
	const res = await fetch(`${OLLAMA_URL}/api/generate`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		signal,
		body: JSON.stringify({ model, prompt, stream: true, options: { temperature: 0.1, num_predict: 1024 } }),
	});
	if (!res.body) return "";
	const reader = res.body.getReader();
	const decoder = new TextDecoder();
	let full = "";
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		for (const line of decoder.decode(value).split("\n")) {
			if (!line.trim()) continue;
			try {
				const j = JSON.parse(line);
				if (j.response) {
					full += j.response;
					onToken(full);
				}
			} catch {
				// partial token line — ignore
			}
		}
	}
	return full;
}

function extractJSONArray(raw: string): string | null {
	const start = raw.indexOf("[");
	if (start === -1) return null;
	let depth = 0;
	for (let i = start; i < raw.length; i++) {
		if (raw[i] === "[") depth++;
		else if (raw[i] === "]") {
			depth--;
			if (depth === 0) return raw.slice(start, i + 1);
		}
	}
	return null;
}

function parseSlides(raw: string, offset = 0): SlideRecord[] {
	const jsonStr = extractJSONArray(raw);
	if (!jsonStr) return [];
	let parsed: unknown;
	try {
		parsed = JSON.parse(jsonStr);
	} catch {
		try {
			parsed = JSON.parse(jsonStr.replace(/\n/g, "\\n"));
		} catch {
			return [];
		}
	}
	if (!Array.isArray(parsed)) return [];
	return parsed
		.map((s, i) => ({
			id: crypto.randomUUID(),
			label: SLIDE_LABELS.includes(s.label) ? s.label : `V${offset + i + 1}`,
			text: String(s.text || "")
				.replace(/ \| /g, "\n")
				.replace(/\|/g, "\n")
				.replace(/\\n/g, "\n")
				.trim(),
		}))
		.filter((s) => s.text);
}

export async function generateSlidesWithAI(
	model: string,
	lyrics: string,
	signal: AbortSignal,
	onProgress: (message: string) => void,
): Promise<SlideRecord[]> {
	const chunks = splitIntoChunks(lyrics, 500);
	const allSlides: SlideRecord[] = [];
	for (let i = 0; i < chunks.length; i++) {
		if (signal.aborted) break;
		onProgress(`Part ${i + 1} of ${chunks.length}: generating...`);
		const raw = await streamOllama(model, SLIDE_PROMPT(chunks[i]), signal, (partial) =>
			onProgress(`Part ${i + 1}/${chunks.length}: ${partial.length} characters...`),
		);
		const chunkSlides = parseSlides(raw, allSlides.length);
		allSlides.push(...chunkSlides);
		onProgress(`Part ${i + 1}/${chunks.length} done — ${allSlides.length} slides`);
	}
	return allSlides;
}
