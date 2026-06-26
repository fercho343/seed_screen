import { BookOpen, Film, Music, SquarePlay } from "lucide-react";

export function ItemTypeIcon({ type }: { type: string }) {
	if (type === "bible") return <BookOpen className="size-4 text-muted-foreground" />;
	if (type === "video") return <Film className="size-4 text-muted-foreground" />;
	if (type === "youtube") return <SquarePlay className="size-4 text-red-500" />;
	return <Music className="size-4 text-muted-foreground" />;
}
