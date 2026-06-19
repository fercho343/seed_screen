import { BookOpen, Image, Music, Plus, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import type { SongRecord } from "../../../electron/electron-env";
import { BiblePanel } from "@/components/bible/bible-panel";
import { SongItem } from "@/components/songs/song-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ServiceItem } from "@/lib/service-types";

const TABS = [
	{ id: "songs", label: "Songs", icon: Music },
	{ id: "bible", label: "Bible", icon: BookOpen },
	{ id: "media", label: "Media", icon: Image },
] as const;

interface LeftSidebarProps {
	songs: SongRecord[];
	service: ServiceItem[];
	onAddToService: (item: Omit<ServiceItem, "scheduleId">) => void;
	onNewSong: () => void;
	onEditSong: (song: SongRecord) => void;
	onTranslateSong: (song: SongRecord) => void;
	onDeleteSong: (song: SongRecord) => void;
	onOpenAIImport: () => void;
}

// Language codes that have at least one non-empty translation across the slides.
function translatedLanguages(song: SongRecord): string[] {
	const langs = new Set<string>();
	for (const slide of song.slides) {
		for (const [code, text] of Object.entries(slide.translations ?? {})) {
			if (text?.trim()) langs.add(code.toUpperCase());
		}
	}
	return [...langs];
}

export function LeftSidebar({
	songs,
	service,
	onAddToService,
	onNewSong,
	onEditSong,
	onTranslateSong,
	onDeleteSong,
	onOpenAIImport,
}: LeftSidebarProps) {
	const [search, setSearch] = useState("");
	const [expandedId, setExpandedId] = useState<number | null>(null);

	const filtered = songs.filter(
		(s) =>
			s.title.toLowerCase().includes(search.toLowerCase()) ||
			s.author.toLowerCase().includes(search.toLowerCase()),
	);

	const isInService = (songId: number) =>
		service.some((item) => item.type === "song" && item.sourceId === String(songId));

	const addSong = (song: SongRecord) => {
		onAddToService({
			sourceId: String(song.id),
			type: "song",
			title: song.title,
			subtitle: song.author,
			language: song.language,
			slides: song.slides,
		});
	};

	return (
		<aside className="flex w-70 pt-2 shrink-0 flex-col overflow-hidden rounded-lg bg-card">
			<Tabs defaultValue="songs" className="flex flex-1 flex-col gap-0 overflow-hidden">
				<TabsList
					variant="line"
					className="h-auto w-full shrink-0 gap-0 rounded-none border-b border-border bg-muted p-0"
				>
					{TABS.map(({ id, label, icon: Icon }) => (
						<TabsTrigger
							key={id}
							value={id}
							className="flex-1 flex-col gap-1 rounded-none border-none py-2.5 text-[11px] font-medium text-text-3 after:bottom-0 after:bg-primary data-active:bg-card data-active:text-foreground data-active:shadow-none dark:data-active:border-none dark:data-active:bg-card"
						>
							<Icon className="size-3.5" />
							{label}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent
					value="songs"
					className="m-0 flex flex-1 flex-col overflow-hidden"
				>
					<div className="flex items-center gap-1.5 px-2.5 py-2.5">
						<div className="relative flex-1">
							<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-text-3" />
							<Input
								type="search"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search songs..."
								className="h-8 border-border bg-input pl-8 text-xs"
							/>
						</div>
						<Button
							size="icon-sm"
							title="Import with AI"
							onClick={onOpenAIImport}
							className="shrink-0 bg-gradient-to-br from-accent-2 to-primary"
						>
							<Sparkles className="size-3.5" />
						</Button>
						<Button
							size="icon-sm"
							variant="outline"
							title="New song"
							onClick={onNewSong}
							className="shrink-0 bg-card"
						>
							<Plus className="size-3.5" />
						</Button>
					</div>

					<div className="px-3 py-1.5">
						<span className="text-[10px] font-semibold uppercase tracking-widest text-text-3">
							{filtered.length} song{filtered.length === 1 ? "" : "s"}
						</span>
					</div>

					<div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-1.5 pb-2">
						{filtered.length === 0 ? (
							<div className="flex flex-1 flex-col items-center justify-center gap-1 px-4 py-8 text-center">
								<Music className="size-7 text-text-4" />
								<p className="text-xs font-medium text-text-3">
									{songs.length === 0 ? "No songs yet" : "No songs found"}
								</p>
								<p className="text-[11px] text-text-4">
									{songs.length === 0 ? "Add one with the + button above" : "Try a different search term"}
								</p>
							</div>
						) : (
							filtered.map((song) => (
								<SongItem
									key={song.id}
									song={{
										id: String(song.id),
										title: song.title,
										author: song.author,
										languages: translatedLanguages(song),
										slides: song.slides,
									}}
									inService={isInService(song.id)}
									expanded={expandedId === song.id}
									onToggleExpand={() =>
										setExpandedId((cur) => (cur === song.id ? null : song.id))
									}
									onAdd={() => addSong(song)}
									onEdit={() => onEditSong(song)}
									onTranslate={() => onTranslateSong(song)}
									onDelete={() => onDeleteSong(song)}
								/>
							))
						)}
					</div>
				</TabsContent>

				<TabsContent value="bible" className="m-0 flex flex-1 flex-col overflow-hidden">
					<BiblePanel onAddToService={onAddToService} />
				</TabsContent>

				<TabsContent
					value="media"
					className="m-0 flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center"
				>
					<Image className="size-7 text-text-4" />
					<p className="text-xs font-medium text-text-3">Media library</p>
					<p className="text-[11px] text-text-4">Coming soon</p>
				</TabsContent>
			</Tabs>
		</aside>
	);
}
