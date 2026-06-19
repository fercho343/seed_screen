import { Check, Globe, Pencil, Plus, Trash2 } from "lucide-react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";

interface SongSlide {
	id: string;
	label: string;
	text: string;
}

export interface SongItemData {
	id: string;
	title: string;
	author: string;
	languages?: string[];
	slides: SongSlide[];
}

interface SongItemProps {
	song: SongItemData;
	inService: boolean;
	expanded: boolean;
	onToggleExpand: () => void;
	onAdd: () => void;
	onEdit: () => void;
	onTranslate: () => void;
	onDelete: () => void;
}

export function SongItem({
	song,
	inService,
	expanded,
	onToggleExpand,
	onAdd,
	onEdit,
	onTranslate,
	onDelete,
}: SongItemProps) {
	const preview = song.slides.slice(0, 3);
	const remaining = song.slides.length - preview.length;

	return (
		<ContextMenu>
			<ContextMenuTrigger
				render={
					<div>
						<div
							role="button"
							tabIndex={0}
							onClick={onToggleExpand}
							className={cn(
								"flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 transition-colors",
								expanded ? "bg-hover" : "hover:bg-hover",
							)}
						>
							<div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent-2 text-xs font-bold text-white">
								{song.title.charAt(0)}
							</div>

							<div className="flex min-w-0 flex-1 flex-col">
								<span className="truncate text-[12px] font-semibold text-foreground">
									{song.title}
								</span>
								<div className="flex items-center gap-1 text-[10px] text-text-3">
									<span className="truncate">{song.author || "Unknown author"}</span>
									{song.languages?.map((lang) => (
										<span
											key={lang}
											className="shrink-0 rounded-sm bg-primary/15 px-1 py-px text-[9px] font-bold text-primary"
										>
											{lang}
										</span>
									))}
								</div>
							</div>

							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onAdd();
								}}
								title={inService ? "Already in service" : "Add to service"}
								className={cn(
									"flex size-6 shrink-0 items-center justify-center rounded-md text-xs transition-colors",
									inService
										? "bg-emerald-500/15 text-emerald-400"
										: "bg-primary/15 text-primary hover:bg-primary/25",
								)}
							>
								{inService ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
							</button>
						</div>

						{expanded && (
							<div className="flex flex-col gap-2 px-2 pb-2 pl-12">
								<div className="flex flex-col gap-1">
									{preview.map((slide) => (
										<div
											key={slide.id}
											className="truncate border-l-2 border-border pl-2 text-[10px] text-text-3"
										>
											<span className="mr-1 text-[9px] font-semibold text-primary">{slide.label}</span>
											{slide.text.split("\n")[0]}
										</div>
									))}
									{remaining > 0 && (
										<span className="pl-2 text-[10px] text-text-3">+{remaining} more…</span>
									)}
								</div>

								<div className="flex gap-1.5">
									<button
										type="button"
										onClick={onAdd}
										className={cn(
											"flex-1 rounded-md px-3 py-1 text-[10px] font-bold text-white transition-colors",
											inService ? "bg-emerald-600 hover:bg-emerald-600/90" : "bg-primary hover:bg-primary/90",
										)}
									>
										{inService ? "✓ In service" : "+ Add to service"}
									</button>
									<button
										type="button"
										onClick={onEdit}
										className="rounded-md border border-border bg-card px-2.5 py-1 text-[10px] text-muted-foreground hover:bg-hover"
									>
										Edit
									</button>
								</div>
							</div>
						)}
					</div>
				}
			/>
			<ContextMenuContent>
				<ContextMenuItem onClick={onEdit}>
					<Pencil />
					Edit
				</ContextMenuItem>
				<ContextMenuItem onClick={onTranslate}>
					<Globe />
					Add translation
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem variant="destructive" onClick={onDelete}>
					<Trash2 />
					Delete
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
