import { BookOpen, ChevronLeft, Loader2, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { BibleBook, BibleVerse } from "../../../electron/electron-env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ServiceItem } from "@/lib/service-types";
import { cn } from "@/lib/utils";

interface BiblePanelProps {
	onAddToService: (item: Omit<ServiceItem, "scheduleId">) => void;
}

type Level = "book" | "chapter" | "verse";

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

export function BiblePanel({ onAddToService }: BiblePanelProps) {
	const [books, setBooks] = useState<BibleBook[]>([]);
	const [bookQuery, setBookQuery] = useState("");
	const [level, setLevel] = useState<Level>("book");
	const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
	const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
	const [verses, setVerses] = useState<BibleVerse[] | null>(null);
	const [loadingVerses, setLoadingVerses] = useState(false);
	const [selectedVerses, setSelectedVerses] = useState<number[]>([]);

	useEffect(() => {
		window.electronAPI.bibleGetBooks().then(setBooks);
	}, []);

	useEffect(() => {
		if (!selectedBook || !selectedChapter) return;
		setLoadingVerses(true);
		setVerses(null);
		setSelectedVerses([]);
		window.electronAPI.bibleGetChapter(selectedBook.id, selectedChapter).then((v) => {
			setVerses(v);
			setLoadingVerses(false);
		});
	}, [selectedBook, selectedChapter]);

	const filteredBooks = useMemo(() => {
		const q = bookQuery.trim().toLowerCase();
		if (!q) return books;
		return books.filter(
			(b) => b.name.toLowerCase().includes(q) || b.abbr.toLowerCase().includes(q),
		);
	}, [books, bookQuery]);

	const pickBook = (book: BibleBook) => {
		setSelectedBook(book);
		setSelectedChapter(null);
		setVerses(null);
		setLevel("chapter");
	};

	const pickChapter = (num: number) => {
		setSelectedChapter(num);
		setLevel("verse");
	};

	const backToBooks = () => {
		setLevel("book");
		setSelectedBook(null);
		setSelectedChapter(null);
		setVerses(null);
	};

	const backToChapters = () => {
		setLevel("chapter");
		setSelectedChapter(null);
		setVerses(null);
	};

	const toggleVerse = (num: number) => {
		setSelectedVerses((prev) =>
			prev.includes(num) ? prev.filter((v) => v !== num) : [...prev, num],
		);
	};

	const addVerses = (nums: number[]) => {
		if (!nums.length || !verses || !selectedBook || !selectedChapter) return;
		const chosen = verses
			.filter((v) => nums.includes(v.v))
			.sort((a, b) => a.v - b.v);
		if (!chosen.length) return;
		const range = verseRange(nums);
		const ref = `${selectedBook.name} ${selectedChapter}:${range}`;
		onAddToService({
			sourceId: `bible-${selectedBook.id}-${selectedChapter}-${range}-${Date.now()}`,
			type: "bible",
			title: ref,
			// One slide per verse so each can be projected on its own; the verse
			// number stays in the text as a reference, the full ref is the label.
			slides: chosen.map((v) => ({
				id: crypto.randomUUID(),
				label: `${selectedBook.name} ${selectedChapter}:${v.v}`,
				text: `${v.v} ${v.t}`,
			})),
		});
		setSelectedVerses([]);
	};

	if (level === "book") {
		return (
			<div className="flex h-full flex-col">
				<div className="border-b border-border p-2.5">
					<div className="relative">
						<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-text-3" />
						<Input
							type="search"
							value={bookQuery}
							onChange={(e) => setBookQuery(e.target.value)}
							placeholder="Search books..."
							className="h-8 border-border bg-input pl-8 text-xs"
						/>
					</div>
				</div>
				<div className="flex-1 overflow-y-auto p-1.5">
					{filteredBooks.length === 0 ? (
						<p className="py-8 text-center text-xs text-text-3">No matches</p>
					) : (
						filteredBooks.map((book) => (
							<button
								key={book.id}
								type="button"
								onClick={() => pickBook(book)}
								className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left hover:bg-hover"
							>
								<span className="text-xs font-medium text-foreground">{book.name}</span>
								<span className="text-[10px] font-semibold text-text-3">{book.abbr}</span>
							</button>
						))
					)}
				</div>
			</div>
		);
	}

	if (level === "chapter" && selectedBook) {
		return (
			<div className="flex h-full flex-col overflow-y-auto p-2.5">
				<button
					type="button"
					onClick={backToBooks}
					className="mb-2.5 flex items-center gap-1 self-start text-[11px] text-text-3 hover:text-foreground"
				>
					<ChevronLeft className="size-3.5" />
					Books
				</button>
				<div className="mb-2 text-xs font-semibold text-foreground">{selectedBook.name}</div>
				<div className="flex flex-wrap gap-1.5">
					{Array.from({ length: selectedBook.chapterCount }, (_, i) => i + 1).map((ch) => (
						<button
							key={ch}
							type="button"
							onClick={() => pickChapter(ch)}
							className="flex size-8 items-center justify-center rounded-md bg-input text-xs text-muted-foreground hover:bg-hover hover:text-foreground"
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
			<div className="flex h-full flex-col overflow-hidden">
				<div className="flex items-center justify-between border-b border-border px-2.5 py-2">
					<button
						type="button"
						onClick={backToChapters}
						className="flex items-center gap-1 text-[11px] text-text-3 hover:text-foreground"
					>
						<ChevronLeft className="size-3.5" />
						Chapters
					</button>
					<span className="text-xs font-semibold text-foreground">
						{selectedBook.name} {selectedChapter}
					</span>
				</div>

				<div className="flex-1 overflow-y-auto p-2">
					{loadingVerses ? (
						<div className="flex flex-col items-center gap-2 py-8">
							<Loader2 className="size-5 animate-spin text-primary" />
							<span className="text-xs text-text-3">Loading…</span>
						</div>
					) : !verses || verses.length === 0 ? (
						<p className="py-8 text-center text-xs text-text-3">No verses found</p>
					) : (
						verses.map((v) => {
							const selected = selectedVerses.includes(v.v);
							return (
								<div
									key={v.v}
									role="button"
									tabIndex={0}
									onClick={() => toggleVerse(v.v)}
									className={cn(
										"group mb-0.5 flex cursor-pointer items-start gap-1.5 rounded-md border px-1.5 py-1.5",
										selected
											? "border-primary bg-primary/10"
											: "border-transparent hover:bg-hover",
									)}
								>
									<span className="mt-0.5 w-4 shrink-0 text-[10px] font-bold text-primary">
										{v.v}
									</span>
									<span className="flex-1 text-[11px] leading-relaxed text-foreground/90">
										{v.t}
									</span>
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											addVerses([v.v]);
										}}
										title="Add this verse"
										className="flex size-5 shrink-0 items-center justify-center rounded bg-primary text-white opacity-0 transition-opacity group-hover:opacity-100"
									>
										<Plus className="size-3" />
									</button>
								</div>
							);
						})
					)}
				</div>

				{selectedVerses.length > 0 && (
					<div className="border-t border-border p-2">
						<Button size="sm" className="w-full" onClick={() => addVerses(selectedVerses)}>
							Add {selectedVerses.length} verse{selectedVerses.length === 1 ? "" : "s"}
						</Button>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
			<BookOpen className="size-7 text-text-4" />
			<p className="text-xs font-medium text-text-3">Loading the Bible…</p>
		</div>
	);
}
