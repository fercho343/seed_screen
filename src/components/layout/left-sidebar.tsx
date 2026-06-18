import { BookOpen, Image, Music, Plus, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { type SongItemData, SongItem } from "@/components/songs/song-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
	{ id: "songs", label: "Songs", icon: Music },
	{ id: "bible", label: "Bible", icon: BookOpen },
	{ id: "media", label: "Media", icon: Image },
] as const;

const SONGS: SongItemData[] = [
	{
		id: "1",
		title: "Holy Forever",
		author: "Chris Tomlin",
		languages: ["ES"],
		slides: [
			{ id: "1-1", label: "V1", text: "Hear the saints throb a hymn\nFrom the throne of God" },
			{ id: "1-2", label: "C", text: "And on that day\nWhen the stars will fall" },
			{ id: "1-3", label: "C", text: "We will sing holy forever\nHoly forever" },
			{ id: "1-4", label: "B", text: "Even when my time on earth is done\nThe song goes on" },
		],
	},
	{
		id: "2",
		title: "Amazing Grace",
		author: "John Newton",
		slides: [
			{ id: "2-1", label: "V1", text: "Amazing grace, how sweet the sound\nThat saved a wretch like me" },
			{ id: "2-2", label: "V2", text: "I once was lost, but now am found\nWas blind but now I see" },
		],
	},
	{
		id: "3",
		title: "How Great Thou Art",
		author: "Stuart K. Hine",
		languages: ["ES", "FR"],
		slides: [
			{ id: "3-1", label: "V1", text: "O Lord my God, when I in awesome wonder" },
			{ id: "3-2", label: "C", text: "Then sings my soul, my Savior God, to Thee" },
			{ id: "3-3", label: "C", text: "How great Thou art, how great Thou art" },
		],
	},
];

export function LeftSidebar() {
	const [search, setSearch] = useState("");
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [serviceIds, setServiceIds] = useState<Set<string>>(new Set());

	const filtered = SONGS.filter(
		(s) =>
			s.title.toLowerCase().includes(search.toLowerCase()) ||
			s.author.toLowerCase().includes(search.toLowerCase()),
	);

	const toggleService = (id: string) => {
		setServiceIds((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	return (
		<aside className="flex w-70 shrink-0 flex-col overflow-hidden rounded-lg bg-card">
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
							className="shrink-0 bg-gradient-to-br from-accent-2 to-primary"
						>
							<Sparkles className="size-3.5" />
						</Button>
						<Button
							size="icon-sm"
							variant="outline"
							title="New song"
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
								<p className="text-xs font-medium text-text-3">No songs found</p>
								<p className="text-[11px] text-text-4">
									Try a different search term
								</p>
							</div>
						) : (
							filtered.map((song) => (
								<SongItem
									key={song.id}
									song={song}
									inService={serviceIds.has(song.id)}
									expanded={expandedId === song.id}
									onToggleExpand={() =>
										setExpandedId((cur) => (cur === song.id ? null : song.id))
									}
									onAdd={() => toggleService(song.id)}
									onEdit={() => {}}
								/>
							))
						)}
					</div>
				</TabsContent>

				<TabsContent
					value="bible"
					className="m-0 flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center"
				>
					<BookOpen className="size-7 text-text-4" />
					<p className="text-xs font-medium text-text-3">Bible search</p>
					<p className="text-[11px] text-text-4">Coming soon</p>
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
