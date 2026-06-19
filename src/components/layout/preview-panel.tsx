import { PreviewCard } from "@/components/preview/preview-card";
import { Button } from "@/components/ui/button";
import type { SlideSettings } from "@/lib/slide-settings";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
	outputOpen: boolean;
	liveText?: string;
	nextText?: string;
	canProject: boolean;
	settings: SlideSettings;
	onProject: () => void;
	onGoBlack: () => void;
}

export function PreviewPanel({
	outputOpen,
	liveText,
	nextText,
	canProject,
	settings,
	onProject,
	onGoBlack,
}: PreviewPanelProps) {
	const hasLive = Boolean(liveText);
	const hasNext = Boolean(nextText);

	return (
		<aside className="flex w-70 shrink-0 flex-col gap-3 overflow-hidden rounded-lg bg-card p-3">
			<span className="text-[10px] font-bold uppercase tracking-widest text-text-3">
				Preview
			</span>

			<div className="flex flex-col gap-1.5">
				<div className="flex items-center justify-between text-[10px] text-text-3">
					<span>Live</span>
					{hasLive && <span className="text-emerald-400">Active</span>}
				</div>
				<PreviewCard label="Live" text={liveText} isEmpty={!hasLive} isLive={hasLive} settings={settings} />
			</div>

			<div className="flex flex-col gap-1.5">
				<span className="text-[10px] text-text-3">Next</span>
				<PreviewCard label="Next" text={nextText} isEmpty={!hasNext} settings={settings} />
			</div>

			<button
				type="button"
				disabled={!outputOpen || !canProject}
				onClick={onProject}
				className={cn(
					"rounded-lg border px-3 py-2.5 text-xs font-bold tracking-wide transition-colors",
					outputOpen && canProject
						? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
						: "cursor-not-allowed border-border bg-card text-text-4",
				)}
			>
				{!outputOpen
					? "Activate output first"
					: !canProject
						? "Select a slide to project"
						: "Project"}
			</button>

			<div className="flex gap-1.5">
				<Button
					variant="secondary"
					size="sm"
					disabled={!outputOpen}
					onClick={onGoBlack}
					className="flex-1 bg-background text-xs text-muted-foreground hover:bg-hover"
				>
					Black (B)
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled
					className="flex-1 bg-card text-xs text-muted-foreground hover:bg-hover"
				>
					Logo (L)
				</Button>
			</div>

			<div className="mt-auto rounded-lg border border-border bg-input p-2.5">
				<div className="flex items-center gap-1.5">
					<div
						className={cn(
							"size-2 rounded-full",
							outputOpen ? "bg-emerald-400 shadow-[0_0_6px_#4ade80]" : "bg-text-4",
						)}
					/>
					<span
						className={cn(
							"text-[11px] font-semibold",
							outputOpen ? "text-emerald-400" : "text-text-4",
						)}
					>
						{outputOpen ? "Output active" : "No output"}
					</span>
				</div>
				<p className="mt-1 text-[10px] leading-relaxed text-text-4">
					{outputOpen
						? "Double-click a slide, or use ← → to navigate live."
						: 'Press "Project" to activate output on the second monitor.'}
				</p>
			</div>
		</aside>
	);
}
