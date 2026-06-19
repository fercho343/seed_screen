"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  removeAllListeners(...args) {
    return electron.ipcRenderer.removeAllListeners(...args);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("electronAPI", {
  settingsGetAll: () => electron.ipcRenderer.invoke("settings:get-all"),
  settingsSetTheme: (theme) => electron.ipcRenderer.invoke("settings:set-theme", theme),
  backgroundsAdd: (bg) => electron.ipcRenderer.invoke("backgrounds:add", bg),
  backgroundsDelete: (id) => electron.ipcRenderer.invoke("backgrounds:delete", id),
  syncGetLocalInfo: () => electron.ipcRenderer.invoke("sync:get-local-info"),
  syncSearchPeers: () => electron.ipcRenderer.invoke("sync:search-peers"),
  onOpenSettings: (cb) => electron.ipcRenderer.on("open-settings", () => cb()),
  bibleGetBooks: () => electron.ipcRenderer.invoke("bible:get-books"),
  bibleGetChapter: (bookId, chapterNum) => electron.ipcRenderer.invoke("bible:get-chapter", bookId, chapterNum),
  bibleSearch: (query) => electron.ipcRenderer.invoke("bible:search", query),
  outputToggle: () => electron.ipcRenderer.invoke("output:toggle"),
  outputGetStatus: () => electron.ipcRenderer.invoke("output:get-status"),
  outputSendText: (text) => electron.ipcRenderer.invoke("output:send-text", text),
  outputGoBlack: () => electron.ipcRenderer.invoke("output:go-black"),
  onOutputClosed: (cb) => electron.ipcRenderer.on("output-window-closed", () => cb()),
  onMenuToggleOutput: (cb) => electron.ipcRenderer.on("menu-toggle-output", () => cb()),
  onShowText: (cb) => electron.ipcRenderer.on("show-text", (_event, text) => cb(text)),
  onGoBlack: (cb) => electron.ipcRenderer.on("go-black", () => cb())
});
