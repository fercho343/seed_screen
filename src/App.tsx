import { useCallback, useEffect, useState } from "react";
import type { DisplayInfo, SongRecord } from "../electron/electron-env";
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

function App() {
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [service, setService] = useState<ServiceItem[]>([]);
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const [selectedSlide, setSelectedSlide] = useState<ServiceSlide | null>(null);
	const [liveSlideId, setLiveSlideId] = useState<string | null>(null);
	const [liveText, setLiveText] = useState<string | null>(null);
	const [outputOpen, setOutputOpen] = useState(false);
	const [displays, setDisplays] = useState<DisplayInfo[]>([]);
	const [selectedDisplay, setSelectedDisplay] = useState<number | null>(null);
	const [songs, setSongs] = useState<SongRecord[]>([]);
	const [songFormTarget, setSongFormTarget] = useState<SongFormTarget>(null);
	const [translateSong, setTranslateSong] = useState<SongRecord | null>(null);
	const [slideSettings, setSlideSettings] = useState<SlideSettings>(DEFAULT_SLIDE_SETTINGS);

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
	}, []);

	const toggleOutput = useCallback(async () => {
		const { opened } = await window.electronAPI.outputToggle(selectedDisplay ?? undefined);
		setOutputOpen(opened);
		if (!opened) clearLive();
	}, [selectedDisplay, clearLive]);

	useEffect(() => {
		window.electronAPI.settingsGetAll().then(({ theme }) => applyTheme(theme));
		window.electronAPI.outputGetStatus().then(({ isOpen }) => setOutputOpen(isOpen));
		loadSongs();
		loadDisplays();

		window.electronAPI.onOpenSettings(() => setSettingsOpen(true));
		window.electronAPI.onOutputClosed(() => {
			setOutputOpen(false);
			clearLive();
		});
		window.electronAPI.onDisplaysChanged(() => loadDisplays());
		window.electronAPI.onMenuNewSong(() => setSongFormTarget("new"));
		window.electronAPI.onMenuNewSongAI(() => setSongFormTarget("new-ai"));

		return () => {
			window.ipcRenderer.removeAllListeners("open-settings");
			window.ipcRenderer.removeAllListeners("output-window-closed");
			window.ipcRenderer.removeAllListeners("displays-changed");
			window.ipcRenderer.removeAllListeners("menu-new-song");
			window.ipcRenderer.removeAllListeners("menu-new-song-ai");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadSongs, loadDisplays]);

	// "Project" menu item / Cmd+P needs the latest toggleOutput closure (it
	// depends on selectedDisplay), so it's wired separately from the effect above.
	useEffect(() => {
		window.electronAPI.onMenuToggleOutput(() => toggleOutput());
		return () => {
			window.ipcRenderer.removeAllListeners("menu-toggle-output");
		};
	}, [toggleOutput]);

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

	const sendToLive = useCallback(
		async (item: ServiceItem, slide: ServiceSlide) => {
			if (!outputOpen) return;
			const text = getSlideDisplayText(slide, item.displayLanguage, item.slideLanguageOverrides);
			await window.electronAPI.outputSendSlide({ text, settings: slideSettings });
			setLiveSlideId(slide.id);
			setLiveText(text);
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

	const goBlack = useCallback(() => {
		window.electronAPI.outputGoBlack();
		clearLive();
	}, [clearLive]);

	const selectedItem = service.find((item) => item.scheduleId === selectedItemId);

	// Arrow keys advance through the selected item's slides and send them live,
	// matching a typical presenter workflow (click to preview, arrows/double-click to go live).
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (songFormTarget !== null || settingsOpen) return;
			const tag = (e.target as HTMLElement)?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;
			if (!selectedItem) return;
			const slides = selectedItem.slides;
			const idx = slides.findIndex((s) => s.id === selectedSlide?.id);

			if (e.key === "ArrowRight" || e.key === "ArrowDown") {
				const next = slides[idx + 1] ?? slides[0];
				if (next) {
					setSelectedSlide(next);
					sendToLive(selectedItem, next);
				}
			}
			if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
				const prev = slides[idx - 1] ?? slides[slides.length - 1];
				if (prev) {
					setSelectedSlide(prev);
					sendToLive(selectedItem, prev);
				}
			}
			if (e.key === "b" || e.key === "B") goBlack();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [selectedItem, selectedSlide, sendToLive, goBlack, songFormTarget, settingsOpen]);

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
				/>
				<PreviewPanel
					outputOpen={outputOpen}
					liveText={liveText ?? undefined}
					nextText={
						selectedItem && selectedSlide
							? getSlideDisplayText(
									selectedSlide,
									selectedItem.displayLanguage,
									selectedItem.slideLanguageOverrides,
								)
							: undefined
					}
					canProject={!!selectedSlide}
					settings={slideSettings}
					onProject={() => selectedItem && selectedSlide && sendToLive(selectedItem, selectedSlide)}
					onGoBlack={goBlack}
				/>
			</div>
			<SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
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
