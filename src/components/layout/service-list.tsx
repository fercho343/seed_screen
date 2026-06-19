import { BookOpen, Clipboard, Music, X } from "lucide-react";
import type { ServiceItem } from "@/lib/service-types";

interface ServiceListProps {
	items: ServiceItem[];
	selectedId: string | null;
	onSelect: (scheduleId: string) => void;
	onActivate: (scheduleId: string) => void;
	onRemove: (scheduleId: string) => void;
}

export function ServiceList({ items, selectedId, onSelect, onActivate, onRemove }: ServiceListProps) {
	return (
		<main className="flex flex-1 flex-col overflow-hidden rounded-lg bg-card">
			<div className="flex items-center justify-between border-b border-border px-4 py-2.5">
				<span className="text-[11px] font-semibold uppercase tracking-widest text-text-3">
					Service List
				</span>
				<span className="text-[11px] text-text-3">{items.length}</span>
			</div>

			{items.length === 0 ? (
				<div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
					<div className="flex size-14 items-center justify-center rounded-xl bg-muted">
						<Clipboard className="size-7 text-text-3" />
					</div>
					<p className="text-[13px] font-semibold text-foreground">Empty list</p>
					<p className="text-[11px] text-text-3">
						Add songs from the library on the left
					</p>
				</div>
			) : (
				<div className="flex-1 overflow-y-auto p-1.5">
					{items.map((item, index) => (
						<div
							key={item.scheduleId}
							role="button"
							tabIndex={0}
							onClick={() => onSelect(item.scheduleId)}
							onDoubleClick={() => onActivate(item.scheduleId)}
							className={`group flex items-center gap-2.5 rounded-md px-2 py-2 cursor-pointer ${
								selectedId === item.scheduleId ? "bg-hover" : "hover:bg-hover"
							}`}
						>
							<div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent-2 text-[10px] font-bold text-white">
								{index + 1}
							</div>
							{item.type === "bible" ? (
								<BookOpen className="size-3.5 shrink-0 text-text-3" />
							) : (
								<Music className="size-3.5 shrink-0 text-text-3" />
							)}
							<div className="min-w-0 flex-1">
								<div className="truncate text-[12px] font-medium text-foreground">
									{item.title}
								</div>
								{item.subtitle && (
									<div className="truncate text-[10px] text-text-3">{item.subtitle}</div>
								)}
							</div>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onRemove(item.scheduleId);
								}}
								className="shrink-0 text-text-3 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
							>
								<X className="size-3.5" />
							</button>
						</div>
					))}
				</div>
			)}
		</main>
	);
}
