import { useCallback, useEffect, useState } from "react";
import type {
	BackgroundItem,
	DisplayInfo,
	ImageAsset,
	RemoteCommand,
	RemoteState,
	RemoteStatus,
	SongRecord,
} from "../electron/electron-env";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { PreviewPanel } from "@/components/layout/preview-panel";
import { ServiceList } from "@/components/layout/service-list";
import { TopBar } from "@/components/layout/top-bar";
import { SettingsModal } from "@/components/settings/settings-modal";
import { SongForm } from "@/components/songs/song-form";
import { TranslateModal } from "@/components/songs/translate-modal";
import {
	getSlideDisplayText,
	type ServiceItem,
	type ServiceSlide,
} from "@/lib/service-types";
import { DEFAULT_SLIDE_SETTINGS, type SlideSettings } from "@/lib/slide-settings";
import { applyTheme } from "@/lib/themes";

type SongFormTarget = "new" | "new-ai" | SongRecord | null;

type ScreenMode = { kind: "black" } | { kind: "logo" } | { kind: "image"; id: string } | null;

function App() {
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [service, setService] = useState<ServiceItem[]>([]);
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const [selectedSlide, setSelectedSlide] = useState<ServiceSlide | null>(null);
	const [liveSlideId, setLiveSlideId] = useState<string | null>(null);
	const [liveText, setLiveText] = useState<string | null>(null);
	const [liveTitle, setLiveTitle] = useState<string | undefined>(undefined);
	const [liveMedia, setLiveMedia] = useState<{
		url: string;
		type: "image" | "video" | "youtube";
	} | null>(null);
	const [outputOpen, setOutputOpen] = useState(false);
	const [displays, setDisplays] = useState<DisplayInfo[]>([]);
	const [selectedDisplay, setSelectedDisplay] = useState<number | null>(null);
	const [songs, setSongs] = useState<SongRecord[]>([]);
	const [songFormTarget, setSongFormTarget] = useState<SongFormTarget>(null);
	const [translateSong, setTranslateSong] = useState<SongRecord | null>(null);
	const [slideSettings, setSlideSettings] = useState<SlideSettings>(DEFAULT_SLIDE_SETTINGS);
	const [remoteStatus, setRemoteStatus] = useState<RemoteStatus>({ active: false, url: null });
	const [logo, setLogo] = useState<string | null>(null);
	const [images, setImages] = useState<ImageAsset[]>([]);
	const [screenMode, setScreenMode] = useState<ScreenMode>(null);
	const [customBackgrounds, setCustomBackgrounds] = useState<BackgroundItem[]>([]);

	const loadLogoAndImages = useCallback(() => {
		window.electronAPI.settingsGetAll().then(({ logo, images, backgrounds }) => {
			setLogo(logo);
			setImages(images);
			setCustomBackgrounds(backgrounds);
		});
	}, []);

	const loadSongs = useCallback(() => {
		window.electronAPI.songsGetAll().then(setSongs);
	}, []);

	const handleDeleteSong = useCallback(
		async (song: SongRecord) => {
			if (!window.confirm(`Delete "${song.title}"?`)) return;
			await window.electronAPI.songsDelete(song.id);
			loadSongs();
		},
		[loadSongs],
	);

	const loadDisplays = useCallback(async () => {
		const list = await window.electronAPI.getDisplays();
		setDisplays(list);
		const external = list.find((d) => !d.isPrimary);
		setSelectedDisplay((cur) => (cur && list.some((d) => d.id === cur) ? cur : external?.id ?? list[0]?.id ?? null));
	}, []);

	const clearLive = useCallback(() => {
		setLiveSlideId(null);
		setLiveText(null);
		setLiveTitle(undefined);
		setLiveMedia(null);
	}, []);

	const toggleOutput = useCallback(async () => {
		const { opened } = await window.electronAPI.outputToggle(selectedDisplay ?? undefined);
		setOutputOpen(opened);
		if (!opened) {
			clearLive();
			setScreenMode(null);
		}
	}, [selectedDisplay, clearLive]);

	const goBlack = useCallback(() => {
		window.electronAPI.outputGoBlack();
		clearLive();
		setScreenMode({ kind: "black" });
	}, [clearLive]);

	const showLogo = useCallback(() => {
		if (!logo) return;
		window.electronAPI.outputShowImage(logo);
		clearLive();
		setScreenMode({ kind: "logo" });
	}, [logo, clearLive]);

	const showImage = useCallback(
		(image: ImageAsset) => {
			window.electronAPI.outputShowImage(image.dataUrl);
			clearLive();
			setScreenMode({ kind: "image", id: image.id });
		},
		[clearLive],
	);

	useEffect(() => {
		window.electronAPI.settingsGetAll().then(({ theme }) => applyTheme(theme));
		window.electronAPI.outputGetStatus().then(({ isOpen }) => setOutputOpen(isOpen));
		window.electronAPI.remoteGetStatus().then(setRemoteStatus);
		loadSongs();
		loadDisplays();
		loadLogoAndImages();

		window.electronAPI.onOpenSettings(() => setSettingsOpen(true));
		window.electronAPI.onOutputClosed(() => {
			setOutputOpen(false);
			clearLive();
			setScreenMode(null);
		});
		window.electronAPI.onDisplaysChanged(() => loadDisplays());
		window.electronAPI.onMenuNewSong(() => setSongFormTarget("new"));
		window.electronAPI.onMenuNewSongAI(() => setSongFormTarget("new-ai"));
		window.electronAPI.onRemoteStatusChanged(setRemoteStatus);

		return () => {
			window.ipcRenderer.removeAllListeners("open-settings");
			window.ipcRenderer.removeAllListeners("output-window-closed");
			window.ipcRenderer.removeAllListeners("displays-changed");
			window.ipcRenderer.removeAllListeners("menu-new-song");
			window.ipcRenderer.removeAllListeners("menu-new-song-ai");
			window.ipcRenderer.removeAllListeners("remote:status-changed");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadSongs, loadDisplays, loadLogoAndImages]);

	// "Project" menu item / Cmd+P needs the latest toggleOutput closure (it
	// depends on selectedDisplay), so it's wired separately from the effect above.
	useEffect(() => {
		window.electronAPI.onMenuToggleOutput(() => toggleOutput());
		return () => {
			window.ipcRenderer.removeAllListeners("menu-toggle-output");
		};
	}, [toggleOutput]);

	// Same deal for the black-screen/logo menu accelerators — they need the
	// latest goBlack/showLogo closures (which depend on clearLive/logo).
	useEffect(() => {
		window.electronAPI.onMenuGoBlack(() => goBlack());
		window.electronAPI.onMenuShowLogo(() => showLogo());
		return () => {
			window.ipcRenderer.removeAllListeners("menu-go-black");
			window.ipcRenderer.removeAllListeners("menu-show-logo");
		};
	}, [goBlack, showLogo]);

	const addToService = useCallback((item: Omit<ServiceItem, "scheduleId">) => {
		setService((prev) => {
			if (
				item.type === "song" &&
				prev.some((existing) => existing.type === "song" && existing.sourceId === item.sourceId)
			) {
				return prev;
			}
			return [...prev, { ...item, scheduleId: crypto.randomUUID() }];
		});
	}, []);

	const removeFromService = useCallback(
		(scheduleId: string) => {
			setService((prev) => {
				const removed = prev.find((item) => item.scheduleId === scheduleId);
				if (removed && liveSlideId && removed.slides.some((s) => s.id === liveSlideId)) {
					clearLive();
				}
				return prev.filter((item) => item.scheduleId !== scheduleId);
			});
			setSelectedItemId((cur) => (cur === scheduleId ? null : cur));
		},
		[liveSlideId, clearLive],
	);

	const reorderServiceItems = useCallback((fromIndex: number, toIndex: number) => {
		setService((prev) => {
			const next = [...prev];
			const [moved] = next.splice(fromIndex, 1);
			next.splice(toIndex, 0, moved);
			return next;
		});
	}, []);

	const sendToLive = useCallback(
		async (item: ServiceItem, slide: ServiceSlide) => {
			if (!outputOpen) return;
			setScreenMode(null);
			setLiveSlideId(slide.id);
			if (item.type === "youtube" && slide.youtubeId) {
				await window.electronAPI.outputShowYoutube(slide.youtubeId);
				setLiveMedia({ url: slide.youtubeId, type: "youtube" });
				setLiveText(null);
				setLiveTitle(undefined);
				return;
			}
			if (slide.mediaUrl && (item.type === "image" || item.type === "video")) {
				if (item.type === "image") await window.electronAPI.outputShowImage(slide.mediaUrl);
				else await window.electronAPI.outputShowVideo(slide.mediaUrl);
				setLiveMedia({ url: slide.mediaUrl, type: item.type });
				setLiveText(null);
				setLiveTitle(undefined);
				return;
			}
			const text = getSlideDisplayText(slide, item.displayLanguage, item.slideLanguageOverrides);
			await window.electronAPI.outputSendSlide({ text, title: slide.reference, settings: slideSettings });
			setLiveMedia(null);
			setLiveText(text);
			setLiveTitle(slide.reference);
		},
		[outputOpen, slideSettings],
	);

	const selectSlide = useCallback((item: ServiceItem, slide: ServiceSlide) => {
		setSelectedItemId(item.scheduleId);
		setSelectedSlide(slide);
	}, []);

	const activateSlide = useCallback(
		(item: ServiceItem, slide: ServiceSlide) => {
			setSelectedItemId(item.scheduleId);
			setSelectedSlide(slide);
			sendToLive(item, slide);
		},
		[sendToLive],
	);

	const setItemLanguage = useCallback((scheduleId: string, lang: string | null) => {
		setService((prev) =>
			prev.map((it) =>
				it.scheduleId === scheduleId
					? { ...it, displayLanguage: lang, slideLanguageOverrides: {} }
					: it,
			),
		);
	}, []);

	const setSlideLanguage = useCallback(
		(scheduleId: string, slideId: string, value: string) => {
			setService((prev) =>
				prev.map((it) => {
					if (it.scheduleId !== scheduleId) return it;
					const overrides = { ...(it.slideLanguageOverrides ?? {}) };
					if (value === "__default__") delete overrides[slideId];
					else overrides[slideId] = value === "__original__" ? null : value;
					return { ...it, slideLanguageOverrides: overrides };
				}),
			);
		},
		[],
	);

	const selectedItem = service.find((item) => item.scheduleId === selectedItemId);

	const goNext = useCallback(() => {
		if (!selectedItem) return;
		const slides = selectedItem.slides;
		const idx = slides.findIndex((s) => s.id === selectedSlide?.id);
		const next = slides[idx + 1];
		if (next) {
			setSelectedSlide(next);
			sendToLive(selectedItem, next);
			return;
		}
		// Last slide of this item: advance to the next service item's first slide.
		const itemIdx = service.findIndex((it) => it.scheduleId === selectedItem.scheduleId);
		const nextItem = service[itemIdx + 1];
		const nextSlide = nextItem?.slides[0];
		if (nextItem && nextSlide) {
			setSelectedItemId(nextItem.scheduleId);
			setSelectedSlide(nextSlide);
			sendToLive(nextItem, nextSlide);
		}
	}, [selectedItem, selectedSlide, service, sendToLive]);

	const goPrev = useCallback(() => {
		if (!selectedItem) return;
		const slides = selectedItem.slides;
		const idx = slides.findIndex((s) => s.id === selectedSlide?.id);
		const prev = slides[idx - 1];
		if (prev) {
			setSelectedSlide(prev);
			sendToLive(selectedItem, prev);
			return;
		}
		// First slide of this item: go back to the previous service item's last slide.
		const itemIdx = service.findIndex((it) => it.scheduleId === selectedItem.scheduleId);
		const prevItem = service[itemIdx - 1];
		const prevSlide = prevItem?.slides[prevItem.slides.length - 1];
		if (prevItem && prevSlide) {
			setSelectedItemId(prevItem.scheduleId);
			setSelectedSlide(prevSlide);
			sendToLive(prevItem, prevSlide);
		}
	}, [selectedItem, selectedSlide, service, sendToLive]);

	const goLiveById = useCallback(
		(itemId: string, slideId: string) => {
			const item = service.find((i) => i.scheduleId === itemId);
			const slide = item?.slides.find((s) => s.id === slideId);
			if (item && slide) {
				setSelectedItemId(item.scheduleId);
				setSelectedSlide(slide);
				sendToLive(item, slide);
			}
		},
		[service, sendToLive],
	);

	const selectItemById = useCallback(
		(itemId: string) => {
			const item = service.find((i) => i.scheduleId === itemId);
			setSelectedItemId(itemId);
			setSelectedSlide(item?.slides[0] ?? null);
		},
		[service],
	);

	// Arrow keys advance through the selected item's slides and send them live,
	// matching a typical presenter workflow (click to preview, arrows/double-click to go live).
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (songFormTarget !== null || settingsOpen) return;
			const tag = (e.target as HTMLElement)?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;
			if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
			if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
			if (e.key === "b" || e.key === "B") goBlack();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [goNext, goPrev, goBlack, songFormTarget, settingsOpen]);

	// Remote control commands (from the LAN web remote) drive the same actions
	// as the keyboard shortcuts and direct slide clicks.
	useEffect(() => {
		window.electronAPI.onRemoteCommand((cmd: RemoteCommand) => {
			if (cmd.type === "next") goNext();
			else if (cmd.type === "prev") goPrev();
			else if (cmd.type === "black") goBlack();
			else if (cmd.type === "goLive") goLiveById(cmd.itemId, cmd.slideId);
			else if (cmd.type === "selectItem") selectItemById(cmd.itemId);
			else if (cmd.type === "toggleOutput") toggleOutput();
			else if (cmd.type === "showLogo") showLogo();
			else if (cmd.type === "showImage") {
				const image = images.find((img) => img.id === cmd.id);
				if (image) showImage(image);
			}
		});
		return () => {
			window.ipcRenderer.removeAllListeners("remote:command");
		};
	}, [goNext, goPrev, goBlack, goLiveById, selectItemById, toggleOutput, showLogo, showImage, images]);

	// Keep the remote control web app's snapshot in sync with the live app state.
	useEffect(() => {
		const liveItemId = liveSlideId
			? service.find((i) => i.slides.some((s) => s.id === liveSlideId))?.scheduleId ?? null
			: null;
		const state: RemoteState = {
			outputOpen,
			background: { type: slideSettings.background.type, value: slideSettings.background.value },
			items: service.map((item) => {
				const itemText = (s: ServiceSlide) =>
					getSlideDisplayText(s, item.displayLanguage, item.slideLanguageOverrides);
				let previewText = item.slides[0] ? itemText(item.slides[0]) : "";
				if (item.scheduleId === liveItemId) {
					const idx = item.slides.findIndex((s) => s.id === liveSlideId);
					const next = item.slides[idx + 1];
					previewText = next ? itemText(next) : (liveText ?? previewText);
				}
				return {
					scheduleId: item.scheduleId,
					title: item.title,
					type: item.type,
					slideCount: item.slides.length,
					previewText,
				};
			}),
			selectedItemId,
			slides: (selectedItem?.slides ?? []).map((s) => ({
				id: s.id,
				label: s.label,
				text: getSlideDisplayText(s, selectedItem?.displayLanguage, selectedItem?.slideLanguageOverrides),
			})),
			selectedSlideId: selectedSlide?.id ?? null,
			liveItemId,
			liveSlideId,
			liveText,
			screenMode,
			logo,
			images,
		};
		window.electronAPI.remotePushState(state);
	}, [
		service,
		selectedItemId,
		selectedItem,
		selectedSlide,
		liveSlideId,
		liveText,
		outputOpen,
		slideSettings.background,
		screenMode,
		logo,
		images,
	]);

	return (
		<div
			id="app-root"
			className="dark flex h-screen flex-col overflow-hidden bg-app text-foreground"
		>
			<TopBar
				outputOpen={outputOpen}
				onToggleOutput={toggleOutput}
				displays={displays}
				selectedDisplay={selectedDisplay}
				onSelectDisplay={setSelectedDisplay}
				slideSettings={slideSettings}
				onSlideSettingsChange={setSlideSettings}
				remoteStatus={remoteStatus}
				customBackgrounds={customBackgrounds}
			/>
			<div className="flex flex-1 gap-0.5 overflow-hidden bg-background p-0.5">
				<LeftSidebar
					songs={songs}
					service={service}
					onAddToService={addToService}
					onNewSong={() => setSongFormTarget("new")}
					onEditSong={(song) => setSongFormTarget(song)}
					onTranslateSong={(song) => setTranslateSong(song)}
					onDeleteSong={handleDeleteSong}
					onOpenAIImport={() => setSongFormTarget("new-ai")}
				/>
				<ServiceList
					items={service}
					selectedItemId={selectedItemId}
					onSelectItem={setSelectedItemId}
					onRemoveItem={removeFromService}
					selectedSlideId={selectedSlide?.id ?? null}
					liveSlideId={liveSlideId}
					onSlideClick={selectSlide}
					onSlideDoubleClick={activateSlide}
					onItemLanguageChange={setItemLanguage}
					onSlideLanguageChange={setSlideLanguage}
					onReorderItems={reorderServiceItems}
				/>
				<PreviewPanel
					outputOpen={outputOpen}
					liveText={liveText ?? undefined}
					liveTitle={liveTitle}
					liveMedia={liveMedia}
					nextText={
						selectedItem && selectedSlide && !selectedSlide.mediaUrl && !selectedSlide.youtubeId
							? getSlideDisplayText(
									selectedSlide,
									selectedItem.displayLanguage,
									selectedItem.slideLanguageOverrides,
								)
							: undefined
					}
					nextTitle={selectedSlide?.reference}
					nextMedia={
						selectedSlide?.mediaUrl && (selectedItem?.type === "image" || selectedItem?.type === "video")
							? { url: selectedSlide.mediaUrl, type: selectedItem.type }
							: selectedSlide?.youtubeId && selectedItem?.type === "youtube"
								? { url: selectedSlide.youtubeId, type: "youtube" as const }
								: null
					}
					canProject={!!selectedSlide}
					settings={slideSettings}
					onProject={() => selectedItem && selectedSlide && sendToLive(selectedItem, selectedSlide)}
					onGoBlack={goBlack}
					logo={logo}
					images={images}
					onShowLogo={showLogo}
					onShowImage={showImage}
					screenMode={screenMode}
				/>
			</div>
			<SettingsModal
				open={settingsOpen}
				onClose={() => {
					setSettingsOpen(false);
					loadLogoAndImages();
				}}
				onSongsImported={loadSongs}
			/>
			<SongForm
				song={songFormTarget === "new" || songFormTarget === "new-ai" ? null : songFormTarget}
				initialMode={songFormTarget === "new-ai" ? "ai" : "manual"}
				slideSettings={slideSettings}
				open={songFormTarget !== null}
				onClose={() => setSongFormTarget(null)}
				onSaved={() => {
					setSongFormTarget(null);
					loadSongs();
				}}
			/>
			<TranslateModal
				song={translateSong}
				open={translateSong !== null}
				onClose={() => setTranslateSong(null)}
				onSaved={() => {
					setTranslateSong(null);
					loadSongs();
				}}
			/>
		</div>
	);
}

export default App;
