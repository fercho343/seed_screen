import { useCallback, useEffect, useState } from "react";
import type { SongRecord } from "../electron/electron-env";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { PreviewPanel } from "@/components/layout/preview-panel";
import { ServiceList } from "@/components/layout/service-list";
import { TopBar } from "@/components/layout/top-bar";
import { SettingsModal } from "@/components/settings/settings-modal";
import { AIImportModal } from "@/components/songs/ai-import-modal";
import { SongForm } from "@/components/songs/song-form";
import type { ServiceItem } from "@/lib/service-types";
import { applyTheme } from "@/lib/themes";

function App() {
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [service, setService] = useState<ServiceItem[]>([]);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [outputOpen, setOutputOpen] = useState(false);
	const [liveItem, setLiveItem] = useState<ServiceItem | null>(null);
	const [songs, setSongs] = useState<SongRecord[]>([]);
	const [songFormTarget, setSongFormTarget] = useState<"new" | SongRecord | null>(null);
	const [aiImportOpen, setAiImportOpen] = useState(false);

	const loadSongs = useCallback(() => {
		window.electronAPI.songsGetAll().then(setSongs);
	}, []);

	const toggleOutput = useCallback(async () => {
		const { opened } = await window.electronAPI.outputToggle();
		setOutputOpen(opened);
		if (!opened) setLiveItem(null);
	}, []);

	useEffect(() => {
		window.electronAPI.settingsGetAll().then(({ theme }) => applyTheme(theme));
		window.electronAPI.outputGetStatus().then(({ isOpen }) => setOutputOpen(isOpen));
		loadSongs();

		window.electronAPI.onOpenSettings(() => setSettingsOpen(true));
		window.electronAPI.onOutputClosed(() => {
			setOutputOpen(false);
			setLiveItem(null);
		});
		window.electronAPI.onMenuToggleOutput(() => toggleOutput());
		window.electronAPI.onMenuNewSong(() => setSongFormTarget("new"));
		window.electronAPI.onMenuNewSongAI(() => setAiImportOpen(true));

		return () => {
			window.ipcRenderer.removeAllListeners("open-settings");
			window.ipcRenderer.removeAllListeners("output-window-closed");
			window.ipcRenderer.removeAllListeners("menu-toggle-output");
			window.ipcRenderer.removeAllListeners("menu-new-song");
			window.ipcRenderer.removeAllListeners("menu-new-song-ai");
		};
	}, [toggleOutput, loadSongs]);

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

	const removeFromService = useCallback((scheduleId: string) => {
		setService((prev) => prev.filter((item) => item.scheduleId !== scheduleId));
		setSelectedId((cur) => (cur === scheduleId ? null : cur));
		setLiveItem((cur) => (cur?.scheduleId === scheduleId ? null : cur));
	}, []);

	const sendToLive = useCallback(
		(item: ServiceItem | undefined) => {
			// Projection is only wired up for Bible verses for now — songs don't
			// have per-slide navigation yet, so sending slides[0] would be misleading.
			if (!item || item.type !== "bible" || !outputOpen) return;
			window.electronAPI.outputSendText(item.slides[0].text);
			setLiveItem(item);
		},
		[outputOpen],
	);

	const goBlack = useCallback(() => {
		window.electronAPI.outputGoBlack();
		setLiveItem(null);
	}, []);

	const selectedItem = service.find((item) => item.scheduleId === selectedId);

	return (
		<div
			id="app-root"
			className="dark flex h-screen flex-col overflow-hidden bg-app text-foreground"
		>
			<TopBar outputOpen={outputOpen} onToggleOutput={toggleOutput} />
			<div className="flex flex-1 gap-0.5 overflow-hidden bg-background p-0.5">
				<LeftSidebar
					songs={songs}
					service={service}
					onAddToService={addToService}
					onNewSong={() => setSongFormTarget("new")}
					onEditSong={(song) => setSongFormTarget(song)}
					onOpenAIImport={() => setAiImportOpen(true)}
				/>
				<ServiceList
					items={service}
					selectedId={selectedId}
					onSelect={setSelectedId}
					onActivate={(scheduleId) =>
						sendToLive(service.find((item) => item.scheduleId === scheduleId))
					}
					onRemove={removeFromService}
				/>
				<PreviewPanel
					outputOpen={outputOpen}
					liveText={liveItem?.slides[0]?.text}
					nextText={selectedItem?.slides[0]?.text}
					canProject={selectedItem?.type === "bible"}
					onProject={() => sendToLive(selectedItem)}
					onGoBlack={goBlack}
				/>
			</div>
			<SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
			<SongForm
				song={songFormTarget === "new" ? null : songFormTarget}
				open={songFormTarget !== null}
				onClose={() => setSongFormTarget(null)}
				onSaved={() => {
					setSongFormTarget(null);
					loadSongs();
				}}
			/>
			<AIImportModal
				open={aiImportOpen}
				onClose={() => setAiImportOpen(false)}
				onSaved={() => {
					setAiImportOpen(false);
					loadSongs();
				}}
			/>
		</div>
	);
}

export default App;
