import { Loader2, Search, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SlideRecord } from "../../../electron/electron-env";
import { PreviewCard } from "@/components/preview/preview-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LANG_NAMES } from "@/lib/languages";
import { cn } from "@/lib/utils";

const OLLAMA = "http://localhost:11434";
const LABELS = ["V1", "V2", "V3", "V4", "V5", "CHORUS", "BRIDGE", "INTRO", "OUTRO"];

const SLIDE_PROMPT = (chunk: string) =>
	`Divide song lines into presentation slides (max 4 lines each). Use | to join lines.
Labels: V1/V2/V3/V4 (verse), CHORUS, BRIDGE, INTRO, OUTRO.
Return ONLY a JSON array, no explanations: [{"label":"V1","text":"line1 | line2 | line3"}]

${chunk}

JSON:`;

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
	const res = await fetch(`${OLLAMA}/api/generate`, {
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
				// Partial/invalid JSON line — skip, more tokens will complete it.
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
			label: LABELS.includes(s.label) ? s.label : `V${offset + i + 1}`,
			text: String(s.text || "")
				.replace(/ \| /g, "\n")
				.replace(/\|/g, "\n")
				.replace(/\\n/g, "\n")
				.trim(),
		}))
		.filter((s) => s.text);
}

interface AIImportModalProps {
	open: boolean;
	onClose: () => void;
	onSaved: () => void;
}

export function AIImportModal({ open, onClose, onSaved }: AIImportModalProps) {
	const [step, setStep] = useState<"input" | "preview">("input");
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [language, setLanguage] = useState("es");
	const [detectingLang, setDetectingLang] = useState(false);
	const [lyrics, setLyrics] = useState("");
	const [models, setModels] = useState<string[]>([]);
	const [model, setModel] = useState("");
	const [ollamaOk, setOllamaOk] = useState<boolean | null>(null);
	const [slides, setSlides] = useState<SlideRecord[]>([]);
	const [activeSlide, setActiveSlide] = useState(0);
	const [generating, setGenerating] = useState(false);
	const [searching, setSearching] = useState(false);
	const [saving, setSaving] = useState(false);
	const [progress, setProgress] = useState("");
	const [error, setError] = useState("");
	const abortRef = useRef<AbortController | null>(null);

	useEffect(() => {
		if (!open) return;
		setStep("input");
		setTitle("");
		setAuthor("");
		setLanguage("es");
		setLyrics("");
		setSlides([]);
		setError("");
		fetch(`${OLLAMA}/api/tags`, { signal: AbortSignal.timeout(3000) })
			.then((r) => r.json())
			.then((data) => {
				const ms = (data.models || []).map((m: { name: string }) => m.name);
				setModels(ms);
				if (ms.length) setModel(ms[0]);
				setOllamaOk(true);
			})
			.catch(() => {
				setOllamaOk(false);
				setError("Could not connect to Ollama on localhost:11434");
			});
	}, [open]);

	if (!open) return null;

	const detectLanguage = async (text?: string) => {
		const sample = (text ?? lyrics).split("\n").filter(Boolean).slice(0, 6).join("\n");
		if (!sample.trim() || !ollamaOk || !model) return;
		setDetectingLang(true);
		try {
			const res = await fetch(`${OLLAMA}/api/generate`, {
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
			const code = (data.response || "").trim().toLowerCase().slice(0, 2);
			if (LANG_NAMES[code]) setLanguage(code);
		} catch {
			// best-effort
		}
		setDetectingLang(false);
	};

	const searchLyrics = async () => {
		if (!title.trim()) {
			setError("Write the title first");
			return;
		}
		if (!model) {
			setError("Select a model");
			return;
		}
		setError("");
		setSearching(true);
		const byLine = author.trim() ? ` by ${author.trim()}` : "";
		const prompt = `Write the complete and accurate song lyrics for "${title.trim()}"${byLine}.
Return ONLY the lyrics. Organize them with clear section labels like "Verse 1", "Chorus", "Bridge", etc. before each section.
Do not add any explanation, intro text, or commentary. Just the raw lyrics with section labels.`;
		try {
			const res = await fetch(`${OLLAMA}/api/generate`, {
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
							setLyrics(full);
						}
					} catch {
						// partial token line — ignore
					}
				}
			}
			if (full.trim()) {
				setLyrics(full.trim());
				detectLanguage(full.trim());
			} else {
				setError("The AI couldn't find the lyrics. Try another model or write them manually.");
			}
		} catch (e) {
			setError(`Search failed: ${e instanceof Error ? e.message : String(e)}`);
		}
		setSearching(false);
	};

	const generate = async () => {
		if (!lyrics.trim()) {
			setError("Paste the lyrics before generating");
			return;
		}
		if (!model) {
			setError("Select a model");
			return;
		}
		setError("");
		setGenerating(true);
		const controller = new AbortController();
		abortRef.current = controller;
		try {
			const chunks = splitIntoChunks(lyrics, 500);
			const allSlides: SlideRecord[] = [];
			for (let i = 0; i < chunks.length; i++) {
				if (controller.signal.aborted) break;
				setProgress(`Part ${i + 1} of ${chunks.length}: generating...`);
				const raw = await streamOllama(model, SLIDE_PROMPT(chunks[i]), controller.signal, (partial) =>
					setProgress(`Part ${i + 1}/${chunks.length}: ${partial.length} characters...`),
				);
				const chunkSlides = parseSlides(raw, allSlides.length);
				allSlides.push(...chunkSlides);
				setProgress(`Part ${i + 1}/${chunks.length} done — ${allSlides.length} slides`);
			}
			if (!allSlides.length) throw new Error("The AI couldn't generate slides. Try another model.");
			setSlides(allSlides);
			setActiveSlide(0);
			setStep("preview");
		} catch (e) {
			if (e instanceof Error && e.name === "AbortError") return;
			setError(e instanceof Error ? e.message : String(e));
		} finally {
			setGenerating(false);
			setProgress("");
		}
	};

	const updateSlide = (idx: number, field: "label" | "text", val: string) =>
		setSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));

	const addSlide = () => {
		setSlides((prev) => [...prev, { id: crypto.randomUUID(), label: `V${prev.length + 1}`, text: "" }]);
		setActiveSlide(slides.length);
	};

	const removeSlide = (idx: number) => {
		setSlides((prev) => prev.filter((_, i) => i !== idx));
		setActiveSlide((cur) => Math.max(0, Math.min(cur, slides.length - 2)));
	};

	const handleSave = async () => {
		if (!title.trim()) {
			setError("Title is required");
			return;
		}
		if (!slides.length) {
			setError("No slides to save");
			return;
		}
		setSaving(true);
		setError("");
		try {
			await window.electronAPI.songsAdd({ title, author, language, slides });
			onSaved();
		} catch (e) {
			setError(`Failed to save: ${e instanceof Error ? e.message : String(e)}`);
			setSaving(false);
		}
	};

	const handleCancel = () => {
		abortRef.current?.abort();
		onClose();
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
			onClick={(e) => e.target === e.currentTarget && handleCancel()}
		>
			<div className="flex h-[680px] w-[920px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
				<div className="flex items-center justify-between border-b border-border px-5 py-3.5">
					<div className="flex items-center gap-3">
						<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-2 to-primary text-white">
							<Sparkles className="size-4" />
						</div>
						<div>
							<h2 className="text-sm font-semibold text-foreground">Import with AI</h2>
							<p className="text-[11px] text-text-3">
								{step === "input"
									? "Paste the lyrics and generate slides automatically"
									: "Review and edit the generated slides"}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2.5">
						<div className="flex items-center gap-1.5 rounded-full border border-border bg-input px-2.5 py-1">
							<span
								className={cn(
									"size-1.5 rounded-full",
									ollamaOk === null ? "bg-amber-400" : ollamaOk ? "bg-emerald-400" : "bg-red-400",
								)}
							/>
							<span className="text-[11px] text-text-3">
								{ollamaOk === null ? "Connecting..." : ollamaOk ? "Ollama OK" : "No connection"}
							</span>
						</div>
						<button
							type="button"
							onClick={handleCancel}
							className="flex size-6 items-center justify-center rounded-md text-text-3 hover:bg-hover hover:text-foreground"
						>
							<X className="size-4" />
						</button>
					</div>
				</div>

				<div className="flex border-b border-border bg-input">
					{["Lyrics", "Slides"].map((s, i) => {
						const active = i === 0 ? step === "input" : step === "preview";
						return (
							<div
								key={s}
								className={cn(
									"flex items-center gap-2 border-b-2 px-6 py-2.5 text-xs font-semibold",
									active ? "border-accent-2 text-foreground" : "border-transparent text-text-4",
								)}
							>
								<span
									className={cn(
										"flex size-5 items-center justify-center rounded-full text-[11px] text-white",
										active ? "bg-accent-2" : "bg-muted",
									)}
								>
									{i + 1}
								</span>
								{s}
							</div>
						);
					})}
				</div>

				<div className="flex flex-1 overflow-hidden">
					{step === "input" && (
						<div className="flex flex-1 flex-col gap-3.5 overflow-y-auto p-5">
							<div className="flex gap-3">
								<div className="flex-1">
									<span className="mb-1.5 block text-[11px] font-semibold tracking-wide text-text-3 uppercase">
										Title *
									</span>
									<Input
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										placeholder="Song name"
										className="h-8 border-border bg-input text-xs"
										autoFocus
									/>
								</div>
								<div className="flex-1">
									<span className="mb-1.5 block text-[11px] font-semibold tracking-wide text-text-3 uppercase">
										Artist / Author
									</span>
									<Input
										value={author}
										onChange={(e) => setAuthor(e.target.value)}
										placeholder="Elevation Worship, Hillsong..."
										className="h-8 border-border bg-input text-xs"
									/>
								</div>
							</div>

							{ollamaOk && (
								<div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/10 px-3.5 py-2.5">
									<span className="flex-1 text-xs text-foreground">
										{searching
											? "Searching for lyrics..."
											: title.trim()
												? `Search lyrics for "${title.trim()}"${author.trim() ? ` — ${author.trim()}` : ""} with AI`
												: "Write the title to search the lyrics automatically"}
									</span>
									<Button
										size="sm"
										disabled={searching || !title.trim() || !model}
										onClick={searchLyrics}
										className="gap-1.5 bg-gradient-to-br from-accent-2 to-primary"
									>
										{searching ? (
											<Loader2 className="size-3.5 animate-spin" />
										) : (
											<Search className="size-3.5" />
										)}
										{searching ? "Searching..." : "Search lyrics with AI"}
									</Button>
								</div>
							)}

							<div className="flex items-end gap-3">
								<div className="flex-1">
									<span className="mb-1.5 block text-[11px] font-semibold tracking-wide text-text-3 uppercase">
										Original language
									</span>
									<Select value={language} onValueChange={(v) => v && setLanguage(v)}>
										<SelectTrigger className="h-8 w-full border-border bg-input text-xs">
											<SelectValue>{(v: string) => LANG_NAMES[v] ?? v}</SelectValue>
										</SelectTrigger>
										<SelectContent>
											{Object.entries(LANG_NAMES).map(([k, v]) => (
												<SelectItem key={k} value={k}>
													{v}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								{ollamaOk && (
									<Button
										variant="outline"
										size="sm"
										disabled={detectingLang || !lyrics.trim()}
										onClick={() => detectLanguage()}
										className="bg-input text-primary"
									>
										{detectingLang ? "…" : "✦ Detect"}
									</Button>
								)}
							</div>

							<div>
								<span className="mb-1.5 block text-[11px] font-semibold tracking-wide text-text-3 uppercase">
									Ollama model
								</span>
								{ollamaOk === false ? (
									<div className="rounded-lg border border-red-900 bg-red-950/40 px-3.5 py-2.5 text-xs text-red-300">
										⚠ Could not connect to Ollama on localhost:11434. Make sure it's running.
									</div>
								) : models.length === 0 ? (
									<div className="rounded-lg border border-border bg-input px-3.5 py-2 text-xs text-text-3">
										Loading models...
									</div>
								) : (
									<Select value={model} onValueChange={(v) => v && setModel(v)}>
										<SelectTrigger className="h-8 w-full border-border bg-input text-xs">
											<SelectValue>{(v: string) => v}</SelectValue>
										</SelectTrigger>
										<SelectContent>
											{models.map((m) => (
												<SelectItem key={m} value={m}>
													{m}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							</div>

							<div className="flex flex-1 flex-col gap-1.5">
								<div className="flex items-center justify-between">
									<span className="text-[11px] font-semibold tracking-wide text-text-3 uppercase">
										Song lyrics *{" "}
										{searching && (
											<span className="ml-2 font-normal text-primary normal-case">writing...</span>
										)}
									</span>
									<span className="text-[11px] text-text-4">{lyrics.length} characters</span>
								</div>
								<Textarea
									value={lyrics}
									onChange={(e) => setLyrics(e.target.value)}
									onBlur={(e) => {
										if (!searching && e.target.value.trim().length > 30) detectLanguage(e.target.value);
									}}
									placeholder={
										'Paste the full lyrics here, or use "Search lyrics with AI" above...\n\nExample:\nVerse 1\nA thousand generations...\n\nChorus\nHoly, holy, holy...'
									}
									className={cn(
										"flex-1 resize-none border-border bg-input font-mono text-xs leading-relaxed",
										searching && "opacity-70",
									)}
								/>
							</div>

							{generating && (
								<div className="flex items-center gap-2.5 rounded-lg border border-primary bg-primary/10 px-3.5 py-2.5">
									<Loader2 className="size-4 animate-spin text-primary" />
									<span className="text-xs text-primary">{progress}</span>
									<button
										type="button"
										onClick={() => abortRef.current?.abort()}
										className="ml-auto rounded-md border border-border px-2.5 py-1 text-[11px] text-text-3 hover:text-foreground"
									>
										Cancel
									</button>
								</div>
							)}
						</div>
					)}

					{step === "preview" && (
						<div className="flex flex-1 overflow-hidden">
							<div className="flex w-64 shrink-0 flex-col gap-1.5 overflow-y-auto border-r border-border p-3">
								<div className="mb-1 flex items-center justify-between">
									<span className="text-[11px] font-semibold tracking-wide text-text-3 uppercase">
										{slides.length} slides
									</span>
									<button
										type="button"
										onClick={addSlide}
										className="rounded-md bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground hover:bg-primary/90"
									>
										+ Add
									</button>
								</div>
								{slides.map((s, i) => (
									<div
										key={s.id}
										role="button"
										tabIndex={0}
										onClick={() => setActiveSlide(i)}
										className={cn(
											"flex items-start gap-2 rounded-md border px-2 py-1.5 text-left",
											i === activeSlide
												? "border-primary bg-primary/10"
												: "border-transparent hover:bg-hover",
										)}
									>
										<span className="mt-0.5 shrink-0 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
											{s.label}
										</span>
										<span className="line-clamp-2 flex-1 text-[11px] text-text-3">
											{s.text || "(empty)"}
										</span>
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												removeSlide(i);
											}}
											className="shrink-0 text-text-3 hover:text-red-400"
										>
											<X className="size-3" />
										</button>
									</div>
								))}
							</div>

							<div className="flex flex-1 flex-col gap-3 overflow-hidden p-5">
								<div className="flex gap-3 border-b border-border pb-3">
									<div className="flex-1">
										<span className="mb-1.5 block text-[11px] font-semibold tracking-wide text-text-3 uppercase">
											Title
										</span>
										<Input
											value={title}
											onChange={(e) => setTitle(e.target.value)}
											className="h-8 border-border bg-input text-xs"
										/>
									</div>
									<div className="flex-1">
										<span className="mb-1.5 block text-[11px] font-semibold tracking-wide text-text-3 uppercase">
											Author
										</span>
										<Input
											value={author}
											onChange={(e) => setAuthor(e.target.value)}
											className="h-8 border-border bg-input text-xs"
										/>
									</div>
								</div>

								{slides[activeSlide] && (
									<>
										<div className="flex items-center gap-2.5">
											<Select
												value={slides[activeSlide].label}
												onValueChange={(v) => v && updateSlide(activeSlide, "label", v)}
											>
												<SelectTrigger className="h-8 w-32 border-border bg-input text-xs">
													<SelectValue>{(v: string) => v}</SelectValue>
												</SelectTrigger>
												<SelectContent>
													{LABELS.map((l) => (
														<SelectItem key={l} value={l}>
															{l}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<span className="text-xs text-text-3">
												Slide {activeSlide + 1} of {slides.length}
											</span>
											<button
												type="button"
												onClick={() => {
													setStep("input");
													setSlides([]);
												}}
												className="ml-auto rounded-md border border-border bg-input px-2.5 py-1 text-[11px] text-text-3 hover:text-foreground"
											>
												← Back to lyrics
											</button>
										</div>

										<Textarea
											value={slides[activeSlide].text}
											onChange={(e) => updateSlide(activeSlide, "text", e.target.value)}
											className="flex-1 resize-none border-border bg-input text-sm leading-relaxed"
										/>

										<PreviewCard
											label={slides[activeSlide].label}
											text={slides[activeSlide].text}
											isEmpty={!slides[activeSlide].text}
										/>
									</>
								)}
							</div>
						</div>
					)}
				</div>

				<div className="flex items-center justify-between border-t border-border px-5 py-3">
					<span className="text-xs text-red-400">{error}</span>
					<div className="flex gap-2">
						<Button variant="outline" size="sm" className="bg-card" onClick={handleCancel}>
							Cancel
						</Button>
						{step === "input" ? (
							<Button
								size="sm"
								disabled={generating || !ollamaOk || !model}
								onClick={generate}
								className="gap-1.5 bg-gradient-to-br from-accent-2 to-primary"
							>
								{generating ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
								{generating ? "Generating..." : "Generate slides"}
							</Button>
						) : (
							<Button
								size="sm"
								disabled={saving || !title.trim()}
								onClick={handleSave}
								className="bg-emerald-600 text-white hover:bg-emerald-600/90"
							>
								{saving ? "Saving..." : `Save song (${slides.length} slides)`}
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
