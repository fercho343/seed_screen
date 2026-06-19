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
	backgroundsAdd: (bg: { name: string; type: "color" | "gradient"; value: string }) =>
		ipcRenderer.invoke("backgrounds:add", bg),
	backgroundsDelete: (id: string) => ipcRenderer.invoke("backgrounds:delete", id),
	syncGetLocalInfo: () => ipcRenderer.invoke("sync:get-local-info"),
	syncGetPeers: () => ipcRenderer.invoke("sync:get-peers"),
	syncSearchPeers: () => ipcRenderer.invoke("sync:search-peers"),
	syncFetchSongs: (ip: string, port: number) => ipcRenderer.invoke("sync:fetch-songs", ip, port),
	syncImportSongs: (songs: unknown[]) => ipcRenderer.invoke("sync:import-songs", songs),
	onSyncPeerFound: (cb: (peer: unknown) => void) =>
		ipcRenderer.on("sync-peer-found", (_event, peer) => cb(peer)),
	onOpenSettings: (cb: () => void) => ipcRenderer.on("open-settings", () => cb()),
	bibleGetBooks: () => ipcRenderer.invoke("bible:get-books"),
	bibleGetChapter: (bookId: string, chapterNum: number) =>
		ipcRenderer.invoke("bible:get-chapter", bookId, chapterNum),
	bibleSearch: (query: string) => ipcRenderer.invoke("bible:search", query),
	outputToggle: (displayId?: number) => ipcRenderer.invoke("output:toggle", displayId),
	outputGetStatus: () => ipcRenderer.invoke("output:get-status"),
	getDisplays: () => ipcRenderer.invoke("displays:get-all"),
	onDisplaysChanged: (cb: () => void) => ipcRenderer.on("displays-changed", () => cb()),
	outputSendSlide: (slide: { text: string; title?: string; settings: unknown }) =>
		ipcRenderer.invoke("output:send-slide", slide),
	outputGoBlack: () => ipcRenderer.invoke("output:go-black"),
	onOutputClosed: (cb: () => void) => ipcRenderer.on("output-window-closed", () => cb()),
	onMenuToggleOutput: (cb: () => void) => ipcRenderer.on("menu-toggle-output", () => cb()),
	onShowSlide: (cb: (slide: { text: string; title?: string; settings: unknown }) => void) =>
		ipcRenderer.on("show-slide", (_event, slide) => cb(slide)),
	onGoBlack: (cb: () => void) => ipcRenderer.on("go-black", () => cb()),
	songsGetAll: () => ipcRenderer.invoke("songs:get-all"),
	songsAdd: (song: SongInput) => ipcRenderer.invoke("songs:add", song),
	songsUpdate: (id: number, song: SongInput) => ipcRenderer.invoke("songs:update", id, song),
	songsDelete: (id: number) => ipcRenderer.invoke("songs:delete", id),
	onMenuNewSong: (cb: () => void) => ipcRenderer.on("menu-new-song", () => cb()),
	onMenuNewSongAI: (cb: () => void) => ipcRenderer.on("menu-new-song-ai", () => cb()),
});
