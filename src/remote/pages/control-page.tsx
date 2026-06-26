import { ChevronLeft, ChevronRight, EyeOff, Image as ImageIcon } from "lucide-react";
import type { RemoteServiceItem, RemoteSlide, RemoteState } from "../../../electron/electron-env";
import { PreviewCard } from "@/components/preview/preview-card";
import { Button } from "@/components/ui/button";
import type { SlideSettings } from "@/lib/slide-settings";
import { cn } from "@/lib/utils";
import { send } from "../lib/remote-api";

export interface NextSlideInfo {
	slide: Pick<RemoteSlide, "text" | "label">;
	fromItem: RemoteServiceItem | null;
}

interface ControlPageProps {
	state: RemoteState | null;
	liveItem: RemoteServiceItem | undefined;
	nextSlide: NextSlideInfo | null;
	settings: SlideSettings;
}

export function ControlPage({ state, liveItem, nextSlide, settings }: ControlPageProps) {
	const isBlack = state?.screenMode?.kind === "black";
	const isLogo = state?.screenMode?.kind === "logo";
	const isImage = state?.screenMode?.kind === "image";

	const liveLabel = liveItem ? `● LIVE · ${liveItem.title}`.toUpperCase() : "NO SIGNAL";

	const nextLabel = nextSlide
		? nextSlide.fromItem
			? nextSlide.fromItem.title
			: nextSlide.slide.label || "Next"
		: "Up next";

	return (
		<div className="flex flex-col gap-4 px-4 pt-4 pb-2">
			{/* ── Live output ──────────────────────── */}
			<section className="flex flex-col gap-2">
				<div className="flex items-center justify-between px-0.5">
					<span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-primary uppercase">
						<span className="size-1.5 rounded-full bg-primary animate-pulse" />
						{liveLabel}
					</span>
					{state?.liveItemId &&
						state.selectedItemId === state.liveItemId &&
						state.slides.length > 0 && (
							<span className="text-[10px] font-semibold text-muted-foreground tabular-nums">
								{state.slides.findIndex((s) => s.id === state.liveSlideId) + 1}
								{" / "}
								{state.slides.length}
							</span>
						)}
				</div>

				<div className="relative">
					{isBlack ? (
						<div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border-2 border-primary bg-black shadow-[0_0_20px_rgba(59,130,246,0.25)]">
							<span className="absolute top-2 left-2 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-primary-foreground uppercase">
								● Black
							</span>
						</div>
					) : isLogo && state?.logo ? (
						<div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border-2 border-primary bg-black shadow-[0_0_20px_rgba(59,130,246,0.25)]">
							<img src={state.logo} alt="Logo" className="h-full w-full object-contain" />
							<span className="absolute top-2 left-2 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-primary-foreground uppercase">
								● Logo
							</span>
						</div>
					) : isImage ? (
						(() => {
							const screenMode = state!.screenMode as { kind: "image"; id: string };
							const img = state!.images.find((i) => i.id === screenMode.id);
							return (
								<div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border-2 border-primary bg-black shadow-[0_0_20px_rgba(59,130,246,0.25)]">
									{img && (
										<img src={img.dataUrl} alt={img.name} className="h-full w-full object-contain" />
									)}
									<span className="absolute top-2 left-2 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-primary-foreground uppercase">
										● {img?.name ?? "Image"}
									</span>
								</div>
							);
						})()
					) : (
						<div className={cn(state?.liveText && "shadow-[0_0_20px_rgba(59,130,246,0.15)]", "rounded-xl")}>
							<PreviewCard
								label={liveLabel}
								text={state?.liveText ?? undefined}
								isLive={!!state?.liveText}
								isEmpty={!state?.liveText}
								settings={settings}
								fontScale={0.13}
							/>
						</div>
					)}

					<Button
						size="sm"
						variant={isBlack ? "default" : "destructive"}
						className={cn(
							"absolute top-2 right-2 z-20 h-7 px-2.5 text-[11px] font-bold",
							isBlack && "bg-primary hover:bg-primary/90",
						)}
						onClick={() => send({ type: "black" })}
					>
						{isBlack ? "Resume" : "BLACK"}
					</Button>
				</div>
			</section>

			{/* ── Up next preview ───────────────────── */}
			<section className="flex flex-col gap-2">
				<div className="flex items-center justify-between px-0.5">
					<span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
						Up next
					</span>
					{nextSlide && <span className="text-[10px] italic text-muted-foreground">{nextLabel}</span>}
				</div>
				{nextSlide ? (
					<div className="opacity-75 transition-opacity hover:opacity-100">
						<PreviewCard
							label={nextLabel}
							text={nextSlide.slide.text}
							isLive={false}
							isEmpty={!nextSlide.slide.text}
							settings={settings}
							fontScale={0.1}
						/>
					</div>
				) : (
					<div className="flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-[12px] text-muted-foreground">
						No next slide
					</div>
				)}
			</section>

			{/* ── Prev / Next navigation ───────────── */}
			<section className="grid grid-cols-2 gap-3">
				<button
					type="button"
					onClick={() => send({ type: "prev" })}
					className="flex h-20 flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-card transition-all active:scale-95"
				>
					<ChevronLeft className="size-8 text-muted-foreground" strokeWidth={1.5} />
					<span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
						Previous
					</span>
				</button>
				<button
					type="button"
					onClick={() => send({ type: "next" })}
					className="flex h-20 flex-col items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95"
				>
					<ChevronRight className="size-8" strokeWidth={1.5} />
					<span className="text-[11px] font-semibold tracking-wider uppercase">Next slide</span>
				</button>
			</section>

			{/* ── Quick actions ────────────────────── */}
			<section className="flex flex-wrap items-center gap-2 pb-1">
				<button
					type="button"
					onClick={() => send({ type: "black" })}
					className={cn(
						"flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-[12px] font-semibold transition-all active:scale-95",
						isBlack
							? "border-primary bg-primary text-primary-foreground"
							: "border-destructive/40 bg-card text-destructive",
					)}
				>
					<EyeOff className="size-3.5" />
					Black
				</button>

				{state?.logo && (
					<button
						type="button"
						onClick={() => send({ type: "showLogo" })}
						className={cn(
							"flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-[12px] font-semibold transition-all active:scale-95",
							isLogo
								? "border-primary bg-primary text-primary-foreground"
								: "border-border bg-card text-foreground",
						)}
					>
						<ImageIcon className="size-3.5" />
						Logo
					</button>
				)}

				{state?.images.map((img) => {
					const active =
						state.screenMode?.kind === "image" && (state.screenMode as { id: string }).id === img.id;
					return (
						<button
							key={img.id}
							type="button"
							title={img.name}
							onClick={() => send({ type: "showImage", id: img.id })}
							className={cn(
								"h-10 w-14 shrink-0 overflow-hidden rounded-xl border transition-all active:scale-95",
								active ? "border-primary ring-2 ring-primary/40" : "border-border",
							)}
						>
							<img src={img.dataUrl} alt={img.name} className="h-full w-full object-cover" />
						</button>
					);
				})}
			</section>
		</div>
	);
}
