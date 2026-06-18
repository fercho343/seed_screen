import { BookOpen, Image, Music, Plus, Search } from "lucide-react";
import { SongItem } from "@/components/songs/song-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
	{ id: "songs", label: "Songs", icon: Music },
	{ id: "bible", label: "Bible", icon: BookOpen },
	{ id: "media", label: "Media", icon: Image },
] as const;

const SONGS = [
	{
		id: "1",
		title: "Holy Forever",
		artist: "Chris Tomlin",
		tag: "ES",
		avatarLetter: "H",
		avatarClassName: "bg-blue-700",
	},
	{
		id: "2",
		title: "La niña de tus ojos",
		artist: "Daniel Calveti",
		avatarLetter: "L",
		avatarClassName: "bg-teal-700",
	},
];

export function LeftSidebar() {
	return (
		<aside className="flex w-64 shrink-0 flex-col overflow-hidden rounded-lg bg-card">
			<Tabs defaultValue="songs" className="mt-4">
				<TabsList variant="line" className="w-full">
					{TABS.map(({ id, label, icon: Icon }) => (
						<TabsTrigger
							key={id}
							value={id}
							className="flex-1 flex-col pb-4 text-[10px] font-medium after:bottom-0 data-active:bg-transparent data-active:text-primary data-active:after:bg-primary dark:data-active:bg-transparent"
						>
							<Icon className="size-4" />
							{label}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent
					value="songs"
					className="m-0 flex flex-1 flex-col overflow-hidden"
				>
					<div className="flex items-center gap-2 border-b px-3 py-2.5">
						<div className="relative flex-1">
							<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search..."
								className="h-7 pl-8 text-xs"
							/>
						</div>
						<Button size="icon-sm" className="shrink-0">
							<Plus className="size-3.5" />
						</Button>
					</div>

					<div className="px-3 py-2">
						<span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
							{SONGS.length} Songs
						</span>
					</div>

					<div className="flex flex-col overflow-y-auto px-1">
						{SONGS.map((song) => (
							<SongItem key={song.id} {...song} />
						))}
					</div>
				</TabsContent>

				<TabsContent value="bible" className="m-0 flex flex-1 flex-col" />
				<TabsContent value="media" className="m-0 flex flex-1 flex-col" />
			</Tabs>
		</aside>
	);
}
