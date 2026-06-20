import { ChevronDown, ChevronUp, Loader2, Search, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SongInput, SongRecord } from "../../../electron/electron-env";
import { PreviewCard } from "@/components/preview/preview-card";
import { Badge } from "@/components/ui/badge";
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
import { DEFAULT_SLIDE_SETTINGS, type SlideSettings } from "@/lib/slide-settings";
import {
	checkOllama,
	detectLanguageWithAI,
	generateSlidesWithAI,
	searchLyricsWithAI,
	SLIDE_LABELS,
} from "@/lib/ollama";
import { cn } from "@/lib/utils";

type Mode = "manual" | "paste" | "ai";

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
	initialMode?: Mode;
	slideSettings?: SlideSettings;
	onClose: () => void;
	onSaved: () => void;
}

export function SongForm({
	song,
	open,
	initialMode = "manual",
	slideSettings = DEFAULT_SLIDE_SETTINGS,
	onClose,
	onSaved,
}: SongFormProps) {
	const isEdit = !!song;
	// The slide editor preview uses the live background but always flat — slide
	// authoring shouldn't show the animated mesh, only a static tonal backdrop.
	const previewSettings: SlideSettings = { ...slideSettings, animated: false };

	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [language, setLanguage] = useState("es");
	const [mode, setMode] = useState<Mode>("manual");
	const [slides, setSlides] = useState<SongInput["slides"]>([
		{ id: crypto.randomUUID(), label: "V1", text: "" },
	]);
	const [activeSlide, setActiveSlide] = useState(0);
	const [pasteText, setPasteText] = useState("");
	const [aiLyrics, setAiLyrics] = useState("");
	const [ollamaOk, setOllamaOk] = useState<boolean | null>(null);
	const [models, setModels] = useState<string[]>([]);
	const [model, setModel] = useState("");
	const [detecting, setDetecting] = useState(false);
	const [searching, setSearching] = useState(false);
	const [generating, setGenerating] = useState(false);
	const [progress, setProgress] = useState("");
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const abortRef = useRef<AbortController | null>(null);

	useEffect(() => {
		if (!open) return;
		setTitle(song?.title ?? "");
		setAuthor(song?.author ?? "");
		setLanguage(song?.language ?? "es");
		setSlides(
			song?.slides?.length
				? song.slides.map((s) => ({ ...s }))
				: [{ id: crypto.randomUUID(), label: "V1", text: "" }],
		);
		setActiveSlide(0);
		setMode(initialMode);
		setPasteText("");
		setAiLyrics("");
		setError("");
	}, [open, song, initialMode]);

	useEffect(() => {
		checkOllama().then(({ ok, models: ms }) => {
			setOllamaOk(ok);
			setModels(ms);
			if (ms.length) setModel(ms[0]);
		});
	}, []);

	const previewCount = useMemo(() => splitLyricsIntoSlides(pasteText).length, [pasteText]);

	if (!open) return null;

	const detectLanguage = async (text?: string) => {
		const sample = text ?? slides.map((s) => s.text).filter(Boolean).slice(0, 3).join("\n");
		if (!sample.trim() || !model) return;
		setDetecting(true);
		const code = await detectLanguageWithAI(model, sample);
		if (code && LANG_NAMES[code]) setLanguage(code);
		setDetecting(false);
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
		try {
			const full = await searchLyricsWithAI(model, title, author, setAiLyrics);
			if (full) {
				setAiLyrics(full);
				detectLanguage(full);
			} else {
				setError("The AI couldn't find the lyrics. Try another model or write them manually.");
			}
		} catch (e) {
			setError(`Search failed: ${e instanceof Error ? e.message : String(e)}`);
		}
		setSearching(false);
	};

	const generateWithAI = async () => {
		if (!aiLyrics.trim()) {
			setError("Paste or search the lyrics before generating");
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
			const generated = await generateSlidesWithAI(model, aiLyrics, controller.signal, setProgress);
			if (!generated.length) throw new Error("The AI couldn't generate slides. Try another model.");
			setSlides(generated);
			setActiveSlide(0);
			setMode("manual");
		} catch (e) {
			if (e instanceof Error && e.name === "AbortError") return;
			setError(e instanceof Error ? e.message : String(e));
		} finally {
			setGenerating(false);
			setProgress("");
		}
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

	const handleClose = () => {
		abortRef.current?.abort();
		onClose();
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
			onClick={(e) => e.target === e.currentTarget && handleClose()}
		>
			<div className="flex h-[660px] w-[880px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
				<div className="flex items-center justify-between border-b border-border px-5 py-3.5">
					<span className="text-sm font-semibold text-foreground">
						{isEdit ? "Edit song" : "New song"}
					</span>
					<button
						type="button"
						onClick={handleClose}
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
								<Button
									variant="outline"
									size="icon-sm"
									disabled={detecting || !ollamaOk}
									title={ollamaOk ? "Detect language with AI" : "Ollama is not available"}
									onClick={() => detectLanguage()}
									className="shrink-0 bg-input text-primary"
								>
									<Sparkles className="size-3.5" />
								</Button>
							</div>
						</div>

						<div className="border-t border-border pt-3">
							<div className="mb-2 flex flex-col gap-1">
								{(
									[
										["manual", "Build slides"],
										["paste", "Paste lyrics"],
										["ai", "Generate with AI"],
									] as const
								).map(([m, label]) => (
									<button
										key={m}
										type="button"
										onClick={() => setMode(m)}
										className={cn(
											"flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-[11px] font-medium transition-colors",
											mode === m
												? "bg-primary text-primary-foreground"
												: "bg-input text-text-3 hover:text-foreground",
										)}
									>
										{label}
										{m === "ai" && ollamaOk !== null && (
											<Badge
												variant="outline"
												className={cn(
													"h-4 gap-1 px-1.5 text-[9px]",
													ollamaOk
														? "border-emerald-700 text-emerald-400"
														: "border-red-900 text-red-400",
												)}
											>
												<span
													className={cn(
														"size-1.5 rounded-full",
														ollamaOk ? "bg-emerald-400" : "bg-red-400",
													)}
												/>
												{ollamaOk ? "Ollama" : "Sin Ollama"}
											</Badge>
										)}
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

						{mode === "ai" && (
							<div className="flex flex-col gap-2">
								<span className="text-[11px] font-semibold tracking-wide text-text-3 uppercase">
									Ollama model
								</span>
								{ollamaOk === false ? (
									<div className="rounded-lg border border-red-900 bg-red-950/40 px-2.5 py-2 text-[11px] text-red-300">
										⚠ Could not connect to Ollama on localhost:11434.
									</div>
								) : models.length === 0 ? (
									<div className="rounded-lg border border-border bg-input px-2.5 py-2 text-[11px] text-text-3">
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
											{SLIDE_LABELS.map((l) => (
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
									settings={previewSettings}
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

						{mode === "ai" && (
							<>
								<div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/10 px-3.5 py-2.5">
									<span className="flex-1 text-xs text-foreground">
										{!ollamaOk
											? "Ollama is not available"
											: searching
												? "Searching for lyrics..."
												: title.trim()
													? `Search lyrics for "${title.trim()}"${author.trim() ? ` — ${author.trim()}` : ""} with AI`
													: "Write the title to search the lyrics automatically"}
									</span>
									<Button
										size="sm"
										disabled={searching || !title.trim() || !model || !ollamaOk}
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

								<div className="flex items-center justify-between">
									<span className="text-[11px] font-semibold tracking-wide text-text-3 uppercase">
										Full lyrics
										{searching && (
											<span className="ml-2 font-normal text-primary normal-case">writing...</span>
										)}
									</span>
									<span className="text-[11px] text-text-4">{aiLyrics.length} characters</span>
								</div>
								<Textarea
									value={aiLyrics}
									onChange={(e) => setAiLyrics(e.target.value)}
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

								{generating ? (
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
								) : (
									<div className="flex items-center justify-between rounded-lg border border-border bg-input p-3">
										<span className="text-xs text-text-3">
											AI splits the lyrics into labeled slides automatically
										</span>
										<Button
											size="sm"
											disabled={!aiLyrics.trim() || !ollamaOk || !model}
											onClick={generateWithAI}
											className="gap-1.5 bg-gradient-to-br from-accent-2 to-primary"
										>
											<Sparkles className="size-3.5" />
											Generate slides
										</Button>
									</div>
								)}
							</>
						)}
					</div>
				</div>

				<div className="flex items-center justify-between border-t border-border px-5 py-3">
					<span className="text-xs text-red-400">{error}</span>
					<div className="flex gap-2">
						<Button variant="outline" size="sm" className="bg-card" onClick={handleClose}>
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
