import { Loader2, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { SongInput, SongRecord } from "../../../electron/electron-env";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LANG_FULL_NAMES, LANG_NAMES } from "@/lib/languages";
import { checkOllama, translateTextWithAI } from "@/lib/ollama";

interface TranslateModalProps {
	song: SongRecord | null;
	open: boolean;
	onClose: () => void;
	onSaved: () => void;
}

interface Draft {
	slideId: string;
	label: string;
	original: string;
	draft: string;
}

export function TranslateModal({ song, open, onClose, onSaved }: TranslateModalProps) {
	const originalLang = song?.language ?? "es";
	const [targetLang, setTargetLang] = useState(originalLang === "es" ? "en" : "es");
	const [drafts, setDrafts] = useState<Draft[]>([]);
	const [ollama, setOllama] = useState<{ ok: boolean; models: string[] }>({ ok: false, models: [] });
	const [model, setModel] = useState("");
	const [translating, setTranslating] = useState(false);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (!open || !song) return;
		setTargetLang(originalLang === "es" ? "en" : "es");
		checkOllama().then((res) => {
			setOllama(res);
			if (res.models.length) setModel(res.models[0]);
		});
	}, [open, song, originalLang]);

	useEffect(() => {
		if (!song) return;
		setDrafts(
			song.slides.map((s) => ({
				slideId: s.id,
				label: s.label,
				original: s.text,
				draft: s.translations?.[targetLang] ?? "",
			})),
		);
	}, [song, targetLang]);

	if (!open || !song) return null;

	const setDraft = (slideId: string, value: string) => {
		setDrafts((prev) => prev.map((d) => (d.slideId === slideId ? { ...d, draft: value } : d)));
	};

	const translateAll = async () => {
		if (!ollama.ok || !model) return;
		setTranslating(true);
		const targetName = LANG_FULL_NAMES[targetLang] ?? targetLang;
		for (const d of drafts) {
			if (!d.original.trim()) continue;
			try {
				const translated = await translateTextWithAI(model, d.original, targetName);
				if (translated) setDraft(d.slideId, translated);
			} catch {
				// keep going with the remaining slides
			}
		}
		setTranslating(false);
	};

	const handleSave = async () => {
		setSaving(true);
		const draftMap = new Map(drafts.map((d) => [d.slideId, d.draft]));
		const updatedSlides = song.slides.map((slide) => {
			const draft = draftMap.get(slide.id);
			if (!draft?.trim()) return slide;
			return {
				...slide,
				translations: { ...(slide.translations ?? {}), [targetLang]: draft },
			};
		});
		const data: SongInput = {
			title: song.title,
			author: song.author,
			language: song.language,
			slides: updatedSlides,
		};
		await window.electronAPI.songsUpdate(song.id, data);
		onSaved();
		setSaving(false);
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="flex h-[620px] w-[760px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
				<div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
					<div className="min-w-0 flex-1">
						<span className="text-sm font-semibold text-foreground">Add translation</span>
						<span className="ml-2 text-xs text-text-3">{song.title}</span>
						<span className="ml-2 text-[11px] text-text-4">
							(original: {LANG_NAMES[originalLang] ?? originalLang})
						</span>
					</div>

					<Select value={targetLang} onValueChange={(v) => v && setTargetLang(v)}>
						<SelectTrigger className="h-8 w-32 border-border bg-input text-xs">
							<SelectValue>{(v: string) => LANG_NAMES[v] ?? v}</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{Object.entries(LANG_NAMES)
								.filter(([k]) => k !== originalLang)
								.map(([k, v]) => (
									<SelectItem key={k} value={k}>
										{v}
									</SelectItem>
								))}
						</SelectContent>
					</Select>

					{ollama.ok && (
						<Button
							size="sm"
							disabled={translating || !model}
							onClick={translateAll}
							className="gap-1.5 bg-gradient-to-br from-accent-2 to-primary"
						>
							{translating ? (
								<Loader2 className="size-3.5 animate-spin" />
							) : (
								<Sparkles className="size-3.5" />
							)}
							{translating ? "Translating..." : "Translate all with AI"}
						</Button>
					)}

					<button
						type="button"
						onClick={onClose}
						className="flex size-6 items-center justify-center rounded-md text-text-3 hover:bg-hover hover:text-foreground"
					>
						<X className="size-4" />
					</button>
				</div>

				<div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4">
					{drafts.map((d) => (
						<div key={d.slideId} className="grid grid-cols-2 gap-2.5">
							<div className="rounded-lg border border-border bg-input p-2.5">
								<div className="mb-1 text-[10px] font-semibold tracking-wide text-text-4 uppercase">
									{LANG_NAMES[originalLang] ?? "Original"} · {d.label}
								</div>
								<p className="whitespace-pre-wrap text-xs leading-relaxed text-text-3">
									{d.original}
								</p>
							</div>
							<div className="flex flex-col rounded-lg border border-border bg-input p-2.5">
								<div className="mb-1 text-[10px] font-semibold tracking-wide text-primary uppercase">
									{LANG_NAMES[targetLang] ?? targetLang}
								</div>
								<Textarea
									value={d.draft}
									onChange={(e) => setDraft(d.slideId, e.target.value)}
									placeholder="Write the translation..."
									className="min-h-[72px] flex-1 resize-none border-none bg-transparent p-0 text-xs leading-relaxed focus-visible:ring-0"
								/>
							</div>
						</div>
					))}
				</div>

				<div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
					<Button variant="outline" size="sm" className="bg-card" onClick={onClose}>
						Cancel
					</Button>
					<Button size="sm" disabled={saving} onClick={handleSave}>
						{saving ? "Saving..." : "Save translation"}
					</Button>
				</div>
			</div>
		</div>
	);
}
