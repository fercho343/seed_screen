import { PreviewCard } from "@/components/preview/preview-card";
import { Button } from "@/components/ui/button";

export function PreviewPanel() {
	return (
		<aside className="flex w-60 shrink-0 flex-col overflow-hidden rounded-lg bg-card">
			<div className="border-b px-3 py-2.5">
				<span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
					Preview
				</span>
			</div>

			<div className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
				<div className="flex flex-col gap-1.5">
					<span className="text-xs text-muted-foreground">Live Output</span>
					<PreviewCard badge="Live Output" />
				</div>

				<div className="flex flex-col gap-1.5">
					<span className="text-xs text-muted-foreground">Next</span>
					<PreviewCard badge="Next" />
				</div>

				<p className="text-center text-[11px] text-muted-foreground">
					Activate output first
				</p>

				<div className="flex gap-2">
					<Button variant="secondary" size="sm" className="flex-1 text-xs">
						Black (B)
					</Button>
					<Button variant="outline" size="sm" className="flex-1 text-xs">
						Logo (L)
					</Button>
				</div>
			</div>

			<div className="border-t px-3 py-2.5">
				<div className="flex items-center gap-1.5">
					<div className="size-1.5 rounded-full bg-muted-foreground" />
					<span className="text-xs font-medium text-muted-foreground">
						No output
					</span>
				</div>
				<p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
					Press "PROJECT" to activate output on the second monitor.
				</p>
			</div>
		</aside>
	);
}
