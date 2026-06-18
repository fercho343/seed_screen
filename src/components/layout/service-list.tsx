import { Clipboard } from "lucide-react";

export function ServiceList() {
	return (
		<main className="flex flex-1 flex-col overflow-hidden rounded-lg bg-card">
			<div className="flex items-center justify-between border-b border-border px-4 py-2.5">
				<span className="text-[11px] font-semibold uppercase tracking-widest text-text-3">
					Service List
				</span>
				<span className="text-[11px] text-text-3">0</span>
			</div>

			<div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
				<div className="flex size-14 items-center justify-center rounded-xl bg-muted">
					<Clipboard className="size-7 text-text-3" />
				</div>
				<p className="text-[13px] font-semibold text-foreground">Empty list</p>
				<p className="text-[11px] text-text-3">
					Add songs from the library on the left
				</p>
			</div>
		</main>
	);
}
