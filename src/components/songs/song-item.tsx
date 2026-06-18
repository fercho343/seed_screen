import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SongItemProps {
	title: string;
	artist: string;
	tag?: string;
	avatarLetter: string;
	avatarClassName: string;
}

export function SongItem({
	title,
	artist,
	tag,
	avatarLetter,
	avatarClassName,
}: SongItemProps) {
	return (
		<div className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 hover:bg-muted">
			<div
				className={cn(
					"flex size-8 shrink-0 items-center justify-center rounded text-xs font-bold text-white",
					avatarClassName,
				)}
			>
				{avatarLetter}
			</div>

			<div className="flex min-w-0 flex-1 flex-col">
				<div className="flex items-center gap-1.5">
					<span className="truncate text-sm font-medium">{title}</span>
					{tag && (
						<Badge
							variant="outline"
							className="h-auto shrink-0 rounded border-primary/40 px-1 py-0 text-[10px] text-primary"
						>
							{tag}
						</Badge>
					)}
				</div>
				<span className="truncate text-xs text-muted-foreground">{artist}</span>
			</div>

			<Button
				variant="ghost"
				size="icon-sm"
				className="shrink-0 text-muted-foreground hover:text-foreground"
			>
				<Plus className="size-3.5" />
			</Button>
		</div>
	);
}
