import type { ImageAsset } from "../../../electron/electron-env";
import { PreviewCard } from "@/components/preview/preview-card";
import { Button } from "@/components/ui/button";
import type { SlideSettings } from "@/lib/slide-settings";
import { cn } from "@/lib/utils";

type ScreenMode = { kind: "black" } | { kind: "logo" } | { kind: "image"; id: string } | null;

interface PreviewPanelProps {
	outputOpen: boolean;
	liveText?: string;
	liveTitle?: string;
	nextText?: string;
	nextTitle?: string;
	canProject: boolean;
	settings: SlideSettings;
	onProject: () => void;
	onGoBlack: () => void;
	logo: string | null;
	images: ImageAsset[];
	onShowLogo: () => void;
	onShowImage: (image: ImageAsset) => void;
	screenMode: ScreenMode;
}

export function PreviewPanel({
	outputOpen,
	liveText,
	liveTitle,
	nextText,
	nextTitle,
	canProject,
	settings,
	onProject,
	onGoBlack,
	logo,
	images,
	onShowLogo,
	onShowImage,
	screenMode,
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
				<PreviewCard
						label="Live"
						text={liveText}
						title={liveTitle}
						isEmpty={!hasLive}
						isLive={hasLive}
						settings={settings}
					/>
			</div>

			<div className="flex flex-col gap-1.5">
				<span className="text-[10px] text-text-3">Next</span>
				<PreviewCard
						label="Next"
						text={nextText}
						title={nextTitle}
						isEmpty={!hasNext}
						settings={settings}
					/>
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
					className={cn(
						"flex-1 text-xs",
						screenMode?.kind === "black"
							? "bg-emerald-600 text-white hover:bg-emerald-600/90"
							: "bg-background text-muted-foreground hover:bg-hover",
					)}
				>
					{screenMode?.kind === "black" && "● "}Black (B)
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={!outputOpen || !logo}
					onClick={onShowLogo}
					className={cn(
						"flex-1 text-xs",
						screenMode?.kind === "logo"
							? "border-emerald-500 bg-emerald-600/15 text-emerald-400"
							: "bg-card text-muted-foreground hover:bg-hover",
					)}
				>
					{screenMode?.kind === "logo" && "● "}Logo (L)
				</Button>
			</div>

			{images.length > 0 && (
				<div className="flex flex-col gap-1.5">
					<span className="text-[10px] text-text-3">Background images</span>
					<div className="grid grid-cols-3 gap-1.5">
						{images.map((img) => {
							const active = screenMode?.kind === "image" && screenMode.id === img.id;
							return (
								<button
									key={img.id}
									type="button"
									disabled={!outputOpen}
									title={img.name}
									onClick={() => onShowImage(img)}
									className={cn(
										"relative overflow-hidden rounded-md border disabled:opacity-40",
										active ? "border-emerald-500 ring-2 ring-emerald-500/50" : "border-border",
									)}
								>
									<img src={img.dataUrl} alt={img.name} className="h-10 w-full object-cover" />
									{active && (
										<span className="absolute top-0.5 right-0.5 size-2 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]" />
									)}
								</button>
							);
						})}
					</div>
				</div>
			)}

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
