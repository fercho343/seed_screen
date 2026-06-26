import { BookOpen, ChevronLeft, Clapperboard, Image as ImageIcon, Loader2, Music, Plus, Search, SquarePlay } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { BibleBook, BibleLang, BibleVerse, MediaRecord, SongRecord } from "../../../electron/electron-env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LANG_NAMES } from "@/lib/languages";
import { cn } from "@/lib/utils";
import { parseYouTubeId } from "@/lib/youtube";
import { fetchBibleBooks, fetchBibleChapter, fetchMedia, fetchSongs } from "../lib/library-api";
import { send } from "../lib/remote-api";

const LIB_TABS = [
	{ id: "songs", label: "Songs", icon: Music },
	{ id: "bible", label: "Scriptures", icon: BookOpen },
	{ id: "media", label: "Media", icon: ImageIcon },
] as const;

function verseRange(nums: number[]): string {
	if (!nums.length) return "";
	const sorted = [...nums].sort((a, b) => a - b);
	const ranges: string[] = [];
	let start = sorted[0];
	let end = sorted[0];
	for (let i = 1; i < sorted.length; i++) {
		if (sorted[i] === end + 1) {
			end = sorted[i];
		} else {
			ranges.push(start === end ? `${start}` : `${start}-${end}`);
			start = sorted[i];
			end = sorted[i];
		}
	}
	ranges.push(start === end ? `${start}` : `${start}-${end}`);
	return ranges.join(",");
}

// ─── Songs ────────────────────────────────────────────────────────────────────

function SongsTab({ search }: { search: string }) {
	const [songs, setSongs] = useState<SongRecord[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchSongs()
			.then(setSongs)
			.finally(() => setLoading(false));
	}, []);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return songs;
		return songs.filter((s) => s.title.toLowerCase().includes(q) || s.author.toLowerCase().includes(q));
	}, [songs, search]);

	const addSong = (song: SongRecord) => {
		send({
			type: "addToService",
			item: {
				sourceId: String(song.id),
				type: "song",
				title: song.title,
				subtitle: song.author,
				language: song.language,
				slides: song.slides,
			},
		});
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-16 text-muted-foreground">
				<Loader2 className="size-5 animate-spin" />
			</div>
		);
	}

	if (filtered.length === 0) {
		return <p className="py-12 text-center text-xs text-muted-foreground">No songs found</p>;
	}

	return (
		<div className="flex flex-col gap-2 px-4 pb-4">
			{filtered.map((song) => (
				<div
					key={song.id}
					className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
				>
					<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
						<Music className="size-4 text-muted-foreground" />
					</div>
					<div className="min-w-0 flex-1">
						<p className="truncate text-[13px] font-semibold text-foreground">{song.title}</p>
						<p className="truncate text-[11px] text-muted-foreground">
							{song.author} · {song.slides[0]?.text ?? ""}
						</p>
					</div>
					<Button size="sm" variant="outline" className="shrink-0 text-[11px]" onClick={() => addSong(song)}>
						Add to Service
					</Button>
				</div>
			))}
		</div>
	);
}

// ─── Scriptures (Bible) ───────────────────────────────────────────────────────

function BibleTab({ search }: { search: string }) {
	const [lang, setLang] = useState<BibleLang>("es");
	const [books, setBooks] = useState<BibleBook[]>([]);
	const [level, setLevel] = useState<"book" | "chapter" | "verse">("book");
	const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
	const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
	const [verses, setVerses] = useState<BibleVerse[] | null>(null);
	const [loadingVerses, setLoadingVerses] = useState(false);
	const [selectedVerses, setSelectedVerses] = useState<number[]>([]);

	useEffect(() => {
		fetchBibleBooks(lang).then(setBooks);
	}, [lang]);

	useEffect(() => {
		if (!selectedBook || !selectedChapter) return;
		setLoadingVerses(true);
		setVerses(null);
		setSelectedVerses([]);
		fetchBibleChapter(selectedBook.id, selectedChapter, lang).then((v) => {
			setVerses(v);
			setLoadingVerses(false);
		});
	}, [selectedBook, selectedChapter, lang]);

	const changeLang = (next: BibleLang) => {
		setLang(next);
		setLevel("book");
		setSelectedBook(null);
		setSelectedChapter(null);
		setVerses(null);
	};

	const filteredBooks = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return books;
		return books.filter((b) => b.name.toLowerCase().includes(q) || b.abbr.toLowerCase().includes(q));
	}, [books, search]);

	async function addVerses(nums: number[]) {
		if (!nums.length || !verses || !selectedBook || !selectedChapter) return;
		const chosen = verses.filter((v) => nums.includes(v.v)).sort((a, b) => a.v - b.v);
		if (!chosen.length) return;
		const range = verseRange(nums);
		const ref = `${selectedBook.name} ${selectedChapter}:${range}`;

		const otherLang: BibleLang = lang === "es" ? "en" : "es";
		const otherVerses = await fetchBibleChapter(selectedBook.id, selectedChapter, otherLang);
		const otherByVerse = new Map(otherVerses.map((v) => [v.v, v.t]));

		send({
			type: "addToService",
			item: {
				sourceId: `bible-${selectedBook.id}-${selectedChapter}-${range}-${Date.now()}`,
				type: "bible",
				title: ref,
				language: lang,
				slides: chosen.map((v) => {
					const otherText = otherByVerse.get(v.v);
					return {
						id: crypto.randomUUID(),
						label: `${selectedBook.name} ${selectedChapter}:${v.v}`,
						reference: `${selectedBook.name} ${selectedChapter}:${v.v}`,
						text: v.t,
						translations: otherText ? { [otherLang]: otherText } : undefined,
					};
				}),
			},
		});
		setSelectedVerses([]);
	}

	const langSelect = (
		<Select value={lang} onValueChange={(v) => v && changeLang(v as BibleLang)}>
			<SelectTrigger size="sm" className="h-8 w-[88px] shrink-0 border-border bg-input text-xs">
				<SelectValue>{(v: string) => LANG_NAMES[v] ?? v}</SelectValue>
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="es">{LANG_NAMES.es}</SelectItem>
				<SelectItem value="en">{LANG_NAMES.en}</SelectItem>
			</SelectContent>
		</Select>
	);

	if (level === "book") {
		return (
			<div className="flex flex-col gap-2 px-4 pb-4">
				<div className="flex justify-end">{langSelect}</div>
				{filteredBooks.length === 0 ? (
					<p className="py-12 text-center text-xs text-muted-foreground">No matches</p>
				) : (
					filteredBooks.map((book) => (
						<button
							key={book.id}
							type="button"
							onClick={() => {
								setSelectedBook(book);
								setSelectedChapter(null);
								setVerses(null);
								setLevel("chapter");
							}}
							className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 text-left"
						>
							<span className="text-[13px] font-medium text-foreground">{book.name}</span>
							<span className="text-[10px] font-semibold text-muted-foreground">{book.abbr}</span>
						</button>
					))
				)}
			</div>
		);
	}

	if (level === "chapter" && selectedBook) {
		return (
			<div className="flex flex-col gap-3 px-4 pb-4">
				<button
					type="button"
					onClick={() => setLevel("book")}
					className="flex items-center gap-1 self-start text-[11px] text-muted-foreground"
				>
					<ChevronLeft className="size-3.5" />
					Books
				</button>
				<div className="text-[13px] font-semibold text-foreground">{selectedBook.name}</div>
				<div className="flex flex-wrap gap-1.5">
					{Array.from({ length: selectedBook.chapterCount }, (_, i) => i + 1).map((ch) => (
						<button
							key={ch}
							type="button"
							onClick={() => {
								setSelectedChapter(ch);
								setLevel("verse");
							}}
							className="flex size-9 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground"
						>
							{ch}
						</button>
					))}
				</div>
			</div>
		);
	}

	if (level === "verse" && selectedBook && selectedChapter) {
		return (
			<div className="flex flex-col gap-2 px-4 pb-4">
				<div className="flex items-center justify-between">
					<button
						type="button"
						onClick={() => setLevel("chapter")}
						className="flex items-center gap-1 text-[11px] text-muted-foreground"
					>
						<ChevronLeft className="size-3.5" />
						Chapters
					</button>
					<span className="text-[13px] font-semibold text-foreground">
						{selectedBook.name} {selectedChapter}
					</span>
				</div>

				{loadingVerses ? (
					<div className="flex items-center justify-center py-12 text-muted-foreground">
						<Loader2 className="size-5 animate-spin" />
					</div>
				) : !verses || verses.length === 0 ? (
					<p className="py-12 text-center text-xs text-muted-foreground">No verses found</p>
				) : (
					verses.map((v) => {
						const selected = selectedVerses.includes(v.v);
						return (
							<button
								key={v.v}
								type="button"
								onClick={() =>
									setSelectedVerses((prev) =>
										prev.includes(v.v) ? prev.filter((n) => n !== v.v) : [...prev, v.v],
									)
								}
								className={cn(
									"flex items-start gap-2 rounded-md border px-2 py-2 text-left",
									selected ? "border-primary bg-primary/10" : "border-transparent bg-card",
								)}
							>
								<span className="mt-0.5 w-5 shrink-0 text-[10px] font-bold text-primary">{v.v}</span>
								<span className="flex-1 text-[12px] leading-relaxed text-foreground/90">{v.t}</span>
							</button>
						);
					})
				)}

				{selectedVerses.length > 0 && (
					<Button size="sm" className="mt-1 w-full" onClick={() => addVerses(selectedVerses)}>
						Add {selectedVerses.length} verse{selectedVerses.length === 1 ? "" : "s"} to Service
					</Button>
				)}
			</div>
		);
	}

	return null;
}

// ─── Media ────────────────────────────────────────────────────────────────────

function MediaTab({ search }: { search: string }) {
	const [media, setMedia] = useState<MediaRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [youtubeUrl, setYoutubeUrl] = useState("");
	const youtubeId = parseYouTubeId(youtubeUrl);
	const youtubeError = youtubeUrl.trim().length > 0 && !youtubeId;

	useEffect(() => {
		fetchMedia()
			.then(setMedia)
			.finally(() => setLoading(false));
	}, []);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return media;
		return media.filter((m) => m.title.toLowerCase().includes(q));
	}, [media, search]);

	const addMedia = (item: MediaRecord) => {
		send({
			type: "addToService",
			item: {
				sourceId: String(item.id),
				type: item.type,
				title: item.title,
				slides: [{ id: crypto.randomUUID(), label: item.title, text: item.title, mediaUrl: item.url }],
			},
		});
	};

	const addYoutube = () => {
		if (!youtubeId) return;
		send({
			type: "addToService",
			item: {
				sourceId: youtubeId,
				type: "youtube",
				title: "YouTube video",
				subtitle: "YouTube",
				slides: [{ id: crypto.randomUUID(), label: "YouTube", text: "YouTube video", youtubeId }],
			},
		});
		setYoutubeUrl("");
	};

	return (
		<div className="flex flex-col gap-3 px-4 pb-4">
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
					<SquarePlay className="size-3.5 text-red-500" />
					YouTube
				</div>
				<div className="flex items-center gap-1.5">
					<Input
						value={youtubeUrl}
						onChange={(e) => setYoutubeUrl(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && addYoutube()}
						placeholder="Paste a YouTube link..."
						className="h-9 border-border bg-input text-xs"
					/>
					<Button size="sm" disabled={!youtubeId} onClick={addYoutube} className="shrink-0">
						Add
					</Button>
				</div>
				{youtubeError && <span className="text-[10px] text-red-400">Invalid YouTube link</span>}
			</div>

			{loading ? (
				<div className="flex items-center justify-center py-12 text-muted-foreground">
					<Loader2 className="size-5 animate-spin" />
				</div>
			) : filtered.length === 0 ? (
				<p className="py-12 text-center text-xs text-muted-foreground">No media found</p>
			) : (
				filtered.map((item) => (
					<div
						key={item.id}
						className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5"
					>
						<div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
							{item.type === "image" ? (
								<img src={item.url} alt={item.title} className="h-full w-full object-cover" />
							) : (
								<Clapperboard className="size-4 text-muted-foreground" />
							)}
						</div>
						<div className="min-w-0 flex-1">
							<p className="truncate text-[13px] font-medium text-foreground">{item.title}</p>
							<p className="text-[11px] text-muted-foreground">{item.type === "image" ? "Image" : "Video"}</p>
						</div>
						<Button size="sm" variant="outline" className="shrink-0 text-[11px]" onClick={() => addMedia(item)}>
							<Plus className="size-3.5" />
							Add
						</Button>
					</div>
				))
			)}
		</div>
	);
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function LibraryPage() {
	const [search, setSearch] = useState("");

	return (
		<div className="flex flex-col gap-3 pt-4">
			<div className="relative px-4">
				<Search className="pointer-events-none absolute left-7 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="search"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search songs, bibles, or media..."
					className="h-10 border-border bg-input pl-8 text-xs"
				/>
			</div>

			<Tabs defaultValue="songs" className="gap-3">
				<TabsList variant="line" className="mx-4 gap-0 self-start rounded-lg bg-muted p-1">
					{LIB_TABS.map(({ id, label }) => (
						<TabsTrigger
							key={id}
							value={id}
							className="rounded-md px-3.5 py-1.5 text-[12px] font-medium data-active:bg-card data-active:text-foreground data-active:shadow-none"
						>
							{label}
						</TabsTrigger>
					))}
				</TabsList>
				<TabsContent value="songs">
					<SongsTab search={search} />
				</TabsContent>
				<TabsContent value="bible">
					<BibleTab search={search} />
				</TabsContent>
				<TabsContent value="media">
					<MediaTab search={search} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
