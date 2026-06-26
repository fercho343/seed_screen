import { ChevronDown, ChevronRight, ChevronUp, ListMusic, X } from "lucide-react";
import { useState } from "react";
import type { RemoteState } from "../../../electron/electron-env";
import { PreviewCard } from "@/components/preview/preview-card";
import type { SlideSettings } from "@/lib/slide-settings";
import { cn } from "@/lib/utils";
import { ItemTypeIcon } from "../components/item-type-icon";
import { send } from "../lib/remote-api";

interface ServicePageProps {
	state: RemoteState | null;
	settings: SlideSettings;
}

export function ServicePage({ state, settings }: ServicePageProps) {
	const [sheetItemId, setSheetItemId] = useState<string | null>(null);
	const [sheetTitle, setSheetTitle] = useState("");

	if (!state || state.items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center">
				<ListMusic className="mb-3 size-10 text-muted-foreground/30" />
				<p className="text-sm text-muted-foreground">No items in the service</p>
			</div>
		);
	}

	const liveItemIdx = state.items.findIndex((i) => i.scheduleId === state.liveItemId);
	const sheetSlides = sheetItemId && state.selectedItemId === sheetItemId ? state.slides : null;

	function openSheet(itemId: string, title: string) {
		setSheetItemId(itemId);
		setSheetTitle(title);
		if (itemId !== state?.selectedItemId) send({ type: "selectItem", itemId });
	}

	function closeSheet() {
		setSheetItemId(null);
	}

	function goLive(itemId: string, slideId: string) {
		send({ type: "goLive", itemId, slideId });
		closeSheet();
	}

	function move(index: number, direction: -1 | 1) {
		const toIndex = index + direction;
		if (toIndex < 0 || toIndex >= state!.items.length) return;
		send({ type: "reorderService", fromIndex: index, toIndex });
	}

	return (
		<div className="flex flex-col gap-0 px-4 pt-4 pb-2">
			<div className="mb-3 flex items-end justify-between px-0.5">
				<div>
					<span className="text-[10px] font-bold tracking-widest text-primary uppercase">
						Live Flow
					</span>
					<h2 className="mt-0.5 text-[18px] font-bold text-foreground">
						{state.items.length} item{state.items.length !== 1 ? "s" : ""}
					</h2>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				{state.items.map((item, idx) => {
					const isLive = item.scheduleId === state.liveItemId;
					const isDone = liveItemIdx !== -1 && idx < liveItemIdx;

					return (
						<div
							key={item.scheduleId}
							className={cn(
								"relative flex items-center gap-2 overflow-hidden rounded-xl border p-3",
								isLive
									? "border-primary bg-card shadow-[0_0_12px_rgba(59,130,246,0.15)]"
									: isDone
										? "border-border bg-card/50 opacity-50"
										: "border-border bg-card",
							)}
						>
							<div className="flex shrink-0 flex-col gap-0.5">
								<button
									type="button"
									disabled={idx === 0}
									onClick={() => move(idx, -1)}
									className="flex size-5 items-center justify-center rounded text-muted-foreground/60 disabled:opacity-20 enabled:hover:text-foreground"
									aria-label="Move up"
								>
									<ChevronUp className="size-3.5" />
								</button>
								<button
									type="button"
									disabled={idx === state.items.length - 1}
									onClick={() => move(idx, 1)}
									className="flex size-5 items-center justify-center rounded text-muted-foreground/60 disabled:opacity-20 enabled:hover:text-foreground"
									aria-label="Move down"
								>
									<ChevronDown className="size-3.5" />
								</button>
							</div>

							<button
								type="button"
								onClick={() => openSheet(item.scheduleId, item.title)}
								className="flex flex-1 items-center gap-3 overflow-hidden text-left active:scale-[0.98]"
							>
								<div className="w-[30%] shrink-0">
									<PreviewCard
										label=""
										text={item.previewText}
										isEmpty={!item.previewText}
										settings={settings}
										fontScale={0.09}
									/>
								</div>

								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-1.5">
										{isLive && (
											<span className="shrink-0 rounded border border-primary/60 px-1 py-0.5 text-[9px] font-extrabold tracking-wide text-primary">
												LIVE
											</span>
										)}
										<span
											className={cn(
												"truncate text-[13px] font-semibold",
												isDone && "line-through opacity-60",
											)}
										>
											{item.title}
										</span>
									</div>
									<div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
										<ItemTypeIcon type={item.type} />
										<span>{item.slideCount} slides</span>
									</div>
								</div>

								<ChevronRight className="size-4 shrink-0 text-muted-foreground/40" />
							</button>

							{isLive && (
								<div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-primary/50 animate-pulse" />
							)}
						</div>
					);
				})}
			</div>

			{/* ── Slide sheet (bottom drawer) ───────────── */}
			<div
				className={cn(
					"fixed inset-0 z-30 bg-black/60 transition-opacity",
					sheetItemId ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
				)}
				onClick={closeSheet}
			/>
			<div
				className={cn(
					"fixed inset-x-0 bottom-0 z-40 flex max-h-[85vh] flex-col rounded-t-2xl bg-card shadow-2xl transition-transform duration-300",
					sheetItemId ? "translate-y-0" : "translate-y-full",
				)}
			>
				<div className="mx-auto mt-2.5 h-1 w-9 shrink-0 rounded-full bg-border" />
				<div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
					<span className="flex-1 truncate text-[15px] font-bold">{sheetTitle}</span>
					<button
						type="button"
						onClick={closeSheet}
						className="flex size-8 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-colors hover:text-foreground"
					>
						<X className="size-4" />
					</button>
				</div>
				<div className="grid grid-cols-2 gap-3 overflow-y-auto p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
					{!sheetSlides ? (
						<div className="col-span-full py-9 text-center text-sm text-muted-foreground">
							Loading slides...
						</div>
					) : (
						sheetSlides.map((s, i) => (
							<button
								key={s.id}
								type="button"
								onClick={() => sheetItemId && goLive(sheetItemId, s.id)}
								className="text-left"
							>
								<PreviewCard
									label={String(i + 1)}
									text={s.text}
									isLive={s.id === state.liveSlideId && sheetItemId === state.liveItemId}
									isEmpty={false}
									settings={settings}
								/>
							</button>
						))
					)}
				</div>
			</div>
		</div>
	);
}
