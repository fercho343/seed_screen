import { contextBridge, ipcRenderer } from "electron";

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
	syncSearchPeers: () => ipcRenderer.invoke("sync:search-peers"),
	onOpenSettings: (cb: () => void) => ipcRenderer.on("open-settings", () => cb()),
	bibleGetBooks: () => ipcRenderer.invoke("bible:get-books"),
	bibleGetChapter: (bookId: string, chapterNum: number) =>
		ipcRenderer.invoke("bible:get-chapter", bookId, chapterNum),
	bibleSearch: (query: string) => ipcRenderer.invoke("bible:search", query),
	outputToggle: () => ipcRenderer.invoke("output:toggle"),
	outputGetStatus: () => ipcRenderer.invoke("output:get-status"),
	outputSendText: (text: string) => ipcRenderer.invoke("output:send-text", text),
	outputGoBlack: () => ipcRenderer.invoke("output:go-black"),
	onOutputClosed: (cb: () => void) => ipcRenderer.on("output-window-closed", () => cb()),
	onMenuToggleOutput: (cb: () => void) => ipcRenderer.on("menu-toggle-output", () => cb()),
	onShowText: (cb: (text: string) => void) =>
		ipcRenderer.on("show-text", (_event, text: string) => cb(text)),
	onGoBlack: (cb: () => void) => ipcRenderer.on("go-black", () => cb()),
});
