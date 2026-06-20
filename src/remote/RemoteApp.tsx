import { useEffect, useMemo, useRef, useState } from "react";
import type { RemoteCommand, RemoteState } from "../../electron/electron-env";
import { PreviewCard } from "@/components/preview/preview-card";
import { Button } from "@/components/ui/button";
import type { SlideBackground, SlideSettings } from "@/lib/slide-settings";
import { cn } from "@/lib/utils";

function send(cmd: RemoteCommand) {
	fetch("/api/command", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(cmd),
	}).catch(() => {});
}

function useRemoteState() {
	const [state, setState] = useState<RemoteState | null>(null);
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		const es = new EventSource("/api/events");
		es.onmessage = (ev) => {
			setState(JSON.parse(ev.data));
			setConnected(true);
		};
		es.onerror = () => setConnected(false);
		return () => es.close();
	}, []);

	return { state, connected };
}

function settingsFor(bg: SlideBackground): SlideSettings {
	return {
		fontSize: 48,
		bold: true,
		italic: false,
		textAlign: "center",
		animated: false,
		background: bg,
	};
}

interface SheetState {
	itemId: string;
	title: string;
}

export function RemoteApp() {
	const { state, connected } = useRemoteState();
	const [sheet, setSheet] = useState<SheetState | null>(null);
	const [confirmToggle, setConfirmToggle] = useState(false);
	const confirmTimerRef = useRef<number | null>(null);

	const background: SlideBackground = useMemo(
		() => ({ id: "remote", label: "", ...(state?.background ?? { type: "color", value: "#000000" }) }),
		[state?.background],
	);
	const settings = useMemo(() => settingsFor(background), [background]);

	const liveItem = state?.items.find((i) => i.scheduleId === state.liveItemId);
	const showsLiveSlides = !!state && state.selectedItemId === state.liveItemId;
	const liveIdx = showsLiveSlides && state ? state.slides.findIndex((s) => s.id === state.liveSlideId) : -1;

	function openSheet(itemId: string, title: string) {
		setSheet({ itemId, title });
		if (itemId !== state?.selectedItemId) send({ type: "selectItem", itemId });
	}

	function closeSheet() {
		setSheet(null);
	}

	function goLive(itemId: string, slideId: string) {
		send({ type: "goLive", itemId, slideId });
		closeSheet();
	}

	function handleToggleOutputTap() {
		if (confirmToggle) {
			if (confirmTimerRef.current) window.clearTimeout(confirmTimerRef.current);
			setConfirmToggle(false);
			send({ type: "toggleOutput" });
			return;
		}
		setConfirmToggle(true);
		confirmTimerRef.current = window.setTimeout(() => setConfirmToggle(false), 2200);
	}

	const sheetSlides = sheet && state?.selectedItemId === sheet.itemId ? state.slides : null;

	return (
		<div className="dark min-h-screen bg-app text-foreground">
			<main className="mx-auto flex max-w-2xl flex-col gap-3.5 p-3.5 pb-[max(14px,env(safe-area-inset-bottom))]">
				<div className="flex items-center gap-2 px-1 text-[11px] text-muted-foreground">
					<span
						className={cn(
							"size-1.5 rounded-full",
							state?.outputOpen ? "bg-emerald-500 shadow-[0_0_6px_#34d399]" : "bg-text-4",
						)}
					/>
					<span className="flex-1">
						{!connected ? "Reconectando..." : state?.outputOpen ? "Proyectando" : "Sin salida activa"}
					</span>
					<Button
						size="sm"
						variant={confirmToggle ? "destructive" : state?.outputOpen ? "outline" : "default"}
						className={cn("h-7 px-2.5 text-[11px] font-bold", confirmToggle && "animate-pulse")}
						onClick={handleToggleOutputTap}
					>
						{confirmToggle
							? "Toca otra vez para confirmar"
							: state?.outputOpen
								? "Detener presentación"
								: "Iniciar presentación"}
					</Button>
				</div>

				<div className="relative">
					{state?.screenMode?.kind === "black" ? (
						<div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border-2 border-emerald-500 bg-black">
							<span className="absolute top-1.5 left-1.5 rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase">
								● Negro
							</span>
						</div>
					) : state?.screenMode?.kind === "logo" && state.logo ? (
						<div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border-2 border-emerald-500 bg-black">
							<img src={state.logo} alt="Logo" className="h-full w-full object-contain" />
							<span className="absolute top-1.5 left-1.5 rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase">
								● Logo
							</span>
						</div>
					) : state?.screenMode?.kind === "image" ? (
						(() => {
							const screenMode = state.screenMode;
							const img = state.images.find((i) => i.id === screenMode.id);
							return (
								<div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border-2 border-emerald-500 bg-black">
									{img && <img src={img.dataUrl} alt={img.name} className="h-full w-full object-contain" />}
									<span className="absolute top-1.5 left-1.5 rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase">
										● {img?.name ?? "Imagen"}
									</span>
								</div>
							);
						})()
					) : (
						<PreviewCard
							label={liveItem ? `EN VIVO · ${liveItem.title}`.toUpperCase() : "SIN SEÑAL"}
							text={state?.liveText ?? undefined}
							isLive={!!state?.liveText}
							isEmpty={!state?.liveText}
							settings={settings}
							fontScale={0.1}
						/>
					)}
					<Button
						size="sm"
						variant="destructive"
						className="absolute top-2 right-2 z-20 h-7 px-2.5 text-[11px] font-bold"
						onClick={() => send({ type: "black" })}
					>
						NEGRO
					</Button>
				</div>

				<div className="flex flex-wrap items-center gap-1.5 px-1">
					<Button
						size="sm"
						variant={state?.screenMode?.kind === "black" ? "default" : "outline"}
						className={cn(
							"h-7 px-2.5 text-[11px]",
							state?.screenMode?.kind === "black"
								? "bg-emerald-600 text-white hover:bg-emerald-600/90"
								: "bg-card",
						)}
						onClick={() => send({ type: "black" })}
					>
						Negro
					</Button>
					{state?.logo && (
						<Button
							size="sm"
							variant={state?.screenMode?.kind === "logo" ? "default" : "outline"}
							className={cn(
								"h-7 px-2.5 text-[11px]",
								state?.screenMode?.kind === "logo"
									? "bg-emerald-600 text-white hover:bg-emerald-600/90"
									: "bg-card",
							)}
							onClick={() => send({ type: "showLogo" })}
						>
							Logo
						</Button>
					)}
					{state?.images.map((img) => {
						const active = state.screenMode?.kind === "image" && state.screenMode.id === img.id;
						return (
							<button
								key={img.id}
								type="button"
								title={img.name}
								onClick={() => send({ type: "showImage", id: img.id })}
								className={cn(
									"h-7 w-10 shrink-0 overflow-hidden rounded-md border",
									active ? "border-emerald-500 ring-2 ring-emerald-500/50" : "border-border",
								)}
							>
								<img src={img.dataUrl} alt={img.name} className="h-full w-full object-cover" />
							</button>
						);
					})}
				</div>

				<div className="flex items-center gap-3">
					<Button
						variant="outline"
						size="icon"
						className="size-16 shrink-0 rounded-full bg-card text-2xl"
						onClick={() => send({ type: "prev" })}
					>
						‹
					</Button>
					<span className="flex-1 text-center text-xs font-semibold text-muted-foreground">
						{showsLiveSlides && state && liveIdx >= 0
							? `Diapositiva ${liveIdx + 1} de ${state.slides.length}`
							: ""}
					</span>
					<Button
						variant="outline"
						size="icon"
						className="size-16 shrink-0 rounded-full bg-card text-2xl"
						onClick={() => send({ type: "next" })}
					>
						›
					</Button>
				</div>

				<div className="px-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">Servicio</div>

				{!state || state.items.length === 0 ? (
					<div className="py-9 text-center text-sm text-muted-foreground">
						No hay elementos en el servicio
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{state.items.map((item) => {
							const isLiveItem = item.scheduleId === state.liveItemId;
							return (
								<button
									key={item.scheduleId}
									type="button"
									onClick={() => openSheet(item.scheduleId, item.title)}
									className={cn(
										"flex items-center gap-3 rounded-xl border bg-card p-2.5 text-left",
										isLiveItem ? "border-emerald-500/60 bg-emerald-500/5" : "border-border",
									)}
								>
									<div className="w-[35%] shrink-0">
										<PreviewCard
											label=""
											text={item.previewText}
											isEmpty={!item.previewText}
											settings={settings}
											fontScale={0.09}
										/>
									</div>
									<div className="min-w-0 flex-1">
										<div className="truncate text-sm font-semibold">{item.title}</div>
										<div className="text-[11px] text-muted-foreground">
											{item.type === "bible" ? "Biblia" : "Cancion"} · {item.slideCount} diapositivas
										</div>
									</div>
									{isLiveItem && (
										<span className="shrink-0 rounded-md border border-emerald-700 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-emerald-400">
											LIVE
										</span>
									)}
								</button>
							);
						})}
					</div>
				)}
			</main>

			<div
				className={cn(
					"fixed inset-0 z-30 bg-black/60 transition-opacity",
					sheet ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
				)}
				onClick={closeSheet}
			/>
			<div
				className={cn(
					"fixed inset-x-0 bottom-0 z-40 flex max-h-[85vh] flex-col rounded-t-2xl bg-background shadow-2xl transition-transform duration-300",
					sheet ? "translate-y-0" : "translate-y-full",
				)}
			>
				<div className="mx-auto mt-2.5 h-1 w-9 shrink-0 rounded-full bg-border" />
				<div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
					<span className="flex-1 truncate text-[15px] font-bold">{sheet?.title}</span>
					<Button size="sm" variant="outline" className="bg-card" onClick={closeSheet}>
						Cerrar
					</Button>
				</div>
				<div className="grid grid-cols-2 gap-3 overflow-y-auto p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
					{!sheetSlides ? (
						<div className="col-span-full py-9 text-center text-sm text-muted-foreground">
							Cargando diapositivas...
						</div>
					) : (
						sheetSlides.map((s, i) => (
							<button
								key={s.id}
								type="button"
								onClick={() => sheet && goLive(sheet.itemId, s.id)}
								className="text-left"
							>
								<PreviewCard
									label={String(i + 1)}
									text={s.text}
									isLive={s.id === state?.liveSlideId}
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
