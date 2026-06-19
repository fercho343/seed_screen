import { ChevronDown, ChevronUp, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SongInput, SongRecord } from "../../../electron/electron-env";
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

function splitLyricsIntoSlides(text: string) {
	return text
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter(Boolean)
		.map((p, i) => ({ id: crypto.randomUUID(), label: `V${i + 1}`, text: p }));
}

interface SongFormProps {
	song: SongRecord | null;
	open: boolean;
	onClose: () => void;
	onSaved: () => void;
}

export function SongForm({ song, open, onClose, onSaved }: SongFormProps) {
	const isEdit = !!song;

	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [language, setLanguage] = useState("es");
	const [mode, setMode] = useState<"manual" | "paste">("manual");
	const [slides, setSlides] = useState<SongInput["slides"]>([
		{ id: crypto.randomUUID(), label: "V1", text: "" },
	]);
	const [activeSlide, setActiveSlide] = useState(0);
	const [pasteText, setPasteText] = useState("");
	const [ollamaOk, setOllamaOk] = useState(false);
	const [detecting, setDetecting] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!open) return;
		setTitle(song?.title ?? "");
		setAuthor(song?.author ?? "");
		setLanguage(song?.language ?? "es");
		setSlides(
			song?.slides?.length ? song.slides.map((s) => ({ ...s })) : [{ id: crypto.randomUUID(), label: "V1", text: "" }],
		);
		setActiveSlide(0);
		setMode("manual");
		setPasteText("");
		setError("");
	}, [open, song]);

	useEffect(() => {
		fetch(`${OLLAMA}/api/tags`, { signal: AbortSignal.timeout(2000) })
			.then(() => setOllamaOk(true))
			.catch(() => setOllamaOk(false));
	}, []);

	const previewCount = useMemo(() => splitLyricsIntoSlides(pasteText).length, [pasteText]);

	if (!open) return null;

	const detectLanguage = async () => {
		const sample = slides.map((s) => s.text).filter(Boolean).slice(0, 3).join("\n");
		if (!sample.trim()) return;
		setDetecting(true);
		try {
			const res = await fetch(`${OLLAMA}/api/generate`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					model: "llama3.2",
					prompt: `Detect the language of the following song lyrics. Return ONLY a two-letter ISO 639-1 language code (es, en, fr, pt, de, it, zh, ko, ja). Return only the code, nothing else:\n\n${sample}`,
					stream: false,
					options: { temperature: 0, num_predict: 4 },
				}),
			});
			const data = await res.json();
			const code = (data.response || "").trim().toLowerCase().slice(0, 2);
			if (LANG_NAMES[code]) setLanguage(code);
		} catch {
			// Ollama not reachable or model missing — leave language unchanged.
		}
		setDetecting(false);
	};

	const updateSlide = (idx: number, field: "label" | "text", value: string) => {
		setSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
	};

	const addSlide = () => {
		setSlides((prev) => [...prev, { id: crypto.randomUUID(), label: `V${prev.length + 1}`, text: "" }]);
		setActiveSlide(slides.length);
	};

	const removeSlide = (idx: number) => {
		if (slides.length === 1) return;
		setSlides((prev) => prev.filter((_, i) => i !== idx));
		setActiveSlide((cur) => Math.max(0, cur - (idx <= cur ? 1 : 0)));
	};

	const moveSlide = (idx: number, dir: -1 | 1) => {
		const next = idx + dir;
		if (next < 0 || next >= slides.length) return;
		const arr = [...slides];
		[arr[idx], arr[next]] = [arr[next], arr[idx]];
		setSlides(arr);
		setActiveSlide(next);
	};

	const createSlidesFromLyrics = () => {
		const generated = splitLyricsIntoSlides(pasteText);
		if (!generated.length) return;
		setSlides(generated);
		setActiveSlide(0);
		setMode("manual");
	};

	const handleSave = async () => {
		if (!title.trim()) {
			setError("Title is required");
			return;
		}
		if (slides.some((s) => !s.text.trim())) {
			setError("Every slide needs text");
			return;
		}
		setSaving(true);
		setError("");
		try {
			const data: SongInput = { title, author, language, slides };
			if (isEdit) {
				await window.electronAPI.songsUpdate(song.id, data);
			} else {
				await window.electronAPI.songsAdd(data);
			}
			onSaved();
		} catch (e) {
			setError(`Failed to save: ${e instanceof Error ? e.message : String(e)}`);
			setSaving(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="flex h-[640px] w-[860px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
				<div className="flex items-center justify-between border-b border-border px-5 py-3.5">
					<span className="text-sm font-semibold text-foreground">
						{isEdit ? "Edit song" : "New song"}
					</span>
					<button
						type="button"
						onClick={onClose}
						className="flex size-6 items-center justify-center rounded-md text-text-3 hover:bg-hover hover:text-foreground"
					>
						<X className="size-4" />
					</button>
				</div>

				<div className="flex flex-1 overflow-hidden">
					<div className="flex w-64 shrink-0 flex-col gap-4 overflow-y-auto border-r border-border p-4">
						<div>
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
						<div>
							<span className="mb-1.5 block text-[11px] font-semibold tracking-wide text-text-3 uppercase">
								Artist / Author
							</span>
							<Input
								value={author}
								onChange={(e) => setAuthor(e.target.value)}
								placeholder="Author or band"
								className="h-8 border-border bg-input text-xs"
							/>
						</div>
						<div>
							<span className="mb-1.5 block text-[11px] font-semibold tracking-wide text-text-3 uppercase">
								Original language
							</span>
							<div className="flex gap-1.5">
								<Select value={language} onValueChange={(v) => v && setLanguage(v)}>
									<SelectTrigger className="h-8 flex-1 border-border bg-input text-xs">
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
								{ollamaOk && (
									<Button
										variant="outline"
										size="icon-sm"
										disabled={detecting}
										title="Detect language with AI"
										onClick={detectLanguage}
										className="shrink-0 bg-input text-primary"
									>
										<Sparkles className="size-3.5" />
									</Button>
								)}
							</div>
						</div>

						<div className="border-t border-border pt-3">
							<div className="mb-2 flex gap-1.5">
								{(["manual", "paste"] as const).map((m) => (
									<button
										key={m}
										type="button"
										onClick={() => setMode(m)}
										className={cn(
											"flex-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
											mode === m
												? "bg-primary text-primary-foreground"
												: "bg-input text-text-3 hover:text-foreground",
										)}
									>
										{m === "manual" ? "Build slides" : "Paste lyrics"}
									</button>
								))}
							</div>
						</div>

						{mode === "manual" && (
							<div className="flex flex-1 flex-col gap-2 overflow-hidden">
								<div className="flex items-center justify-between">
									<span className="text-[11px] font-semibold tracking-wide text-text-3 uppercase">
										Slides
									</span>
									<button
										type="button"
										onClick={addSlide}
										className="rounded-md bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground hover:bg-primary/90"
									>
										+ Add
									</button>
								</div>
								<div className="flex flex-col gap-1 overflow-y-auto">
									{slides.map((s, i) => (
										<div
											key={s.id}
											role="button"
											tabIndex={0}
											onClick={() => setActiveSlide(i)}
											className={cn(
												"group flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-left",
												i === activeSlide
													? "border-primary bg-primary/10"
													: "border-transparent hover:bg-hover",
											)}
										>
											<span className="w-11 shrink-0 text-[10px] font-bold text-text-3">
												{s.label}
											</span>
											<span className="flex-1 truncate text-[11px] text-text-3">
												{s.text.slice(0, 24) || "(empty)"}
											</span>
											<div className="flex shrink-0 gap-0.5 opacity-0 group-hover:opacity-100">
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														moveSlide(i, -1);
													}}
													disabled={i === 0}
													className="text-text-3 hover:text-foreground disabled:opacity-30"
												>
													<ChevronUp className="size-3" />
												</button>
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														moveSlide(i, 1);
													}}
													disabled={i === slides.length - 1}
													className="text-text-3 hover:text-foreground disabled:opacity-30"
												>
													<ChevronDown className="size-3" />
												</button>
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														removeSlide(i);
													}}
													disabled={slides.length === 1}
													className="text-text-3 hover:text-red-400 disabled:opacity-30"
												>
													<X className="size-3" />
												</button>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					<div className="flex flex-1 flex-col gap-3 overflow-hidden p-5">
						{mode === "manual" && slides[activeSlide] && (
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
								</div>

								<Textarea
									value={slides[activeSlide].text}
									onChange={(e) => updateSlide(activeSlide, "text", e.target.value)}
									placeholder="Write the slide text here..."
									className="flex-1 resize-none border-border bg-input text-sm leading-relaxed"
								/>

								<PreviewCard
									label={slides[activeSlide].label}
									text={slides[activeSlide].text}
									isEmpty={!slides[activeSlide].text}
								/>
							</>
						)}

						{mode === "paste" && (
							<>
								<span className="text-[11px] font-semibold tracking-wide text-text-3 uppercase">
									Full lyrics
								</span>
								<Textarea
									value={pasteText}
									onChange={(e) => setPasteText(e.target.value)}
									placeholder={
										"Paste the full lyrics here. Separate sections with a blank line —\neach blank-line break becomes its own slide.\n\nVerse 1\nLine one\nLine two\n\nChorus\nLine three\nLine four"
									}
									className="flex-1 resize-none border-border bg-input font-mono text-xs leading-relaxed"
								/>
								<div className="flex items-center justify-between rounded-lg border border-border bg-input p-3">
									<span className="text-xs text-text-3">
										{previewCount > 0
											? `${previewCount} slide${previewCount === 1 ? "" : "s"} will be created from blank-line breaks`
											: "Paste lyrics above — slides are created from blank-line breaks"}
									</span>
									<Button size="sm" disabled={!previewCount} onClick={createSlidesFromLyrics}>
										Create slides
									</Button>
								</div>
							</>
						)}
					</div>
				</div>

				<div className="flex items-center justify-between border-t border-border px-5 py-3">
					<span className="text-xs text-red-400">{error}</span>
					<div className="flex gap-2">
						<Button variant="outline" size="sm" className="bg-card" onClick={onClose}>
							Cancel
						</Button>
						<Button size="sm" disabled={saving} onClick={handleSave}>
							{saving ? "Saving..." : isEdit ? "Update song" : "Save song"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
