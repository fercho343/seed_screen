import { contextBridge, ipcRenderer } from "electron";
import type { SongInput } from "./db";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
	on(...args: Parameters<typeof ipcRenderer.on>) {
		const [channel, listener] = args;
		return ipcRenderer.on(channel, (event, ...args) =>
			listener(event, ...args),
		);
	},
	off(...args: Parameters<typeof ipcRenderer.off>) {
		const [channel, ...omit] = args;
		return ipcRenderer.off(channel, ...omit);
	},
	send(...args: Parameters<typeof ipcRenderer.send>) {
		const [channel, ...omit] = args;
		return ipcRenderer.send(channel, ...omit);
	},
	invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
		const [channel, ...omit] = args;
		return ipcRenderer.invoke(channel, ...omit);
	},
	removeAllListeners(...args: Parameters<typeof ipcRenderer.removeAllListeners>) {
		return ipcRenderer.removeAllListeners(...args);
	},

	// You can expose other APTs you need here.
	// ...
});

contextBridge.exposeInMainWorld("electronAPI", {
	settingsGetAll: () => ipcRenderer.invoke("settings:get-all"),
	settingsSetTheme: (theme: string) => ipcRenderer.invoke("settings:set-theme", theme),
	settingsPickLogo: () => ipcRenderer.invoke("settings:pick-logo"),
	settingsClearLogo: () => ipcRenderer.invoke("settings:clear-logo"),
	backgroundsAdd: (bg: { name: string; type: "color" | "gradient"; value: string }) =>
		ipcRenderer.invoke("backgrounds:add", bg),
	backgroundsDelete: (id: string) => ipcRenderer.invoke("backgrounds:delete", id),
	imagesAdd: () => ipcRenderer.invoke("images:add"),
	imagesDelete: (id: string) => ipcRenderer.invoke("images:delete", id),
	syncGetLocalInfo: () => ipcRenderer.invoke("sync:get-local-info"),
	syncGetPeers: () => ipcRenderer.invoke("sync:get-peers"),
	syncSearchPeers: () => ipcRenderer.invoke("sync:search-peers"),
	syncFetchSongs: (ip: string, port: number) => ipcRenderer.invoke("sync:fetch-songs", ip, port),
	syncImportSongs: (songs: unknown[]) => ipcRenderer.invoke("sync:import-songs", songs),
	onSyncPeerFound: (cb: (peer: unknown) => void) =>
		ipcRenderer.on("sync-peer-found", (_event, peer) => cb(peer)),
	remoteGetStatus: () => ipcRenderer.invoke("remote:get-status"),
	remotePushState: (state: unknown) => ipcRenderer.invoke("remote:push-state", state),
	onRemoteCommand: (cb: (cmd: unknown) => void) =>
		ipcRenderer.on("remote:command", (_event, cmd) => cb(cmd)),
	onRemoteStatusChanged: (cb: (status: { active: boolean; url: string | null }) => void) =>
		ipcRenderer.on("remote:status-changed", (_event, status) => cb(status)),
	onOpenSettings: (cb: () => void) => ipcRenderer.on("open-settings", () => cb()),
	bibleGetBooks: (lang: "es" | "en") => ipcRenderer.invoke("bible:get-books", lang),
	bibleGetChapter: (bookId: string, chapterNum: number, lang: "es" | "en") =>
		ipcRenderer.invoke("bible:get-chapter", bookId, chapterNum, lang),
	bibleSearch: (query: string, lang: "es" | "en") =>
		ipcRenderer.invoke("bible:search", query, lang),
	outputToggle: (displayId?: number) => ipcRenderer.invoke("output:toggle", displayId),
	outputGetStatus: () => ipcRenderer.invoke("output:get-status"),
	getDisplays: () => ipcRenderer.invoke("displays:get-all"),
	onDisplaysChanged: (cb: () => void) => ipcRenderer.on("displays-changed", () => cb()),
	outputSendSlide: (slide: { text: string; title?: string; settings: unknown }) =>
		ipcRenderer.invoke("output:send-slide", slide),
	outputGoBlack: () => ipcRenderer.invoke("output:go-black"),
	outputShowImage: (dataUrl: string) => ipcRenderer.invoke("output:show-image", dataUrl),
	outputShowVideo: (fileUrl: string) => ipcRenderer.invoke("output:show-video", fileUrl),
	outputShowYoutube: (videoId: string) => ipcRenderer.invoke("output:show-youtube", videoId),
	onOutputClosed: (cb: () => void) => ipcRenderer.on("output-window-closed", () => cb()),
	onMenuToggleOutput: (cb: () => void) => ipcRenderer.on("menu-toggle-output", () => cb()),
	onMenuGoBlack: (cb: () => void) => ipcRenderer.on("menu-go-black", () => cb()),
	onMenuShowLogo: (cb: () => void) => ipcRenderer.on("menu-show-logo", () => cb()),
	onShowSlide: (cb: (slide: { text: string; title?: string; settings: unknown }) => void) =>
		ipcRenderer.on("show-slide", (_event, slide) => cb(slide)),
	onGoBlack: (cb: () => void) => ipcRenderer.on("go-black", () => cb()),
	onShowImage: (cb: (dataUrl: string) => void) =>
		ipcRenderer.on("show-image", (_event, dataUrl) => cb(dataUrl)),
	onShowVideo: (cb: (fileUrl: string) => void) =>
		ipcRenderer.on("show-video", (_event, fileUrl) => cb(fileUrl)),
	onShowYoutube: (cb: (videoId: string) => void) =>
		ipcRenderer.on("show-youtube", (_event, videoId) => cb(videoId)),
	songsGetAll: () => ipcRenderer.invoke("songs:get-all"),
	songsAdd: (song: SongInput) => ipcRenderer.invoke("songs:add", song),
	songsUpdate: (id: number, song: SongInput) => ipcRenderer.invoke("songs:update", id, song),
	songsDelete: (id: number) => ipcRenderer.invoke("songs:delete", id),
	onMenuNewSong: (cb: () => void) => ipcRenderer.on("menu-new-song", () => cb()),
	onMenuNewSongAI: (cb: () => void) => ipcRenderer.on("menu-new-song-ai", () => cb()),
	mediaGetAll: () => ipcRenderer.invoke("media:get-all"),
	mediaAdd: () => ipcRenderer.invoke("media:add"),
	mediaDelete: (id: number) => ipcRenderer.invoke("media:delete", id),
});
