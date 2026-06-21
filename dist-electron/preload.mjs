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
  settingsPickLogo: () => electron.ipcRenderer.invoke("settings:pick-logo"),
  settingsClearLogo: () => electron.ipcRenderer.invoke("settings:clear-logo"),
  backgroundsAdd: (bg) => electron.ipcRenderer.invoke("backgrounds:add", bg),
  backgroundsDelete: (id) => electron.ipcRenderer.invoke("backgrounds:delete", id),
  imagesAdd: () => electron.ipcRenderer.invoke("images:add"),
  imagesDelete: (id) => electron.ipcRenderer.invoke("images:delete", id),
  syncGetLocalInfo: () => electron.ipcRenderer.invoke("sync:get-local-info"),
  syncGetPeers: () => electron.ipcRenderer.invoke("sync:get-peers"),
  syncSearchPeers: () => electron.ipcRenderer.invoke("sync:search-peers"),
  syncFetchSongs: (ip, port) => electron.ipcRenderer.invoke("sync:fetch-songs", ip, port),
  syncImportSongs: (songs) => electron.ipcRenderer.invoke("sync:import-songs", songs),
  onSyncPeerFound: (cb) => electron.ipcRenderer.on("sync-peer-found", (_event, peer) => cb(peer)),
  remoteGetStatus: () => electron.ipcRenderer.invoke("remote:get-status"),
  remotePushState: (state) => electron.ipcRenderer.invoke("remote:push-state", state),
  onRemoteCommand: (cb) => electron.ipcRenderer.on("remote:command", (_event, cmd) => cb(cmd)),
  onRemoteStatusChanged: (cb) => electron.ipcRenderer.on("remote:status-changed", (_event, status) => cb(status)),
  onOpenSettings: (cb) => electron.ipcRenderer.on("open-settings", () => cb()),
  bibleGetBooks: () => electron.ipcRenderer.invoke("bible:get-books"),
  bibleGetChapter: (bookId, chapterNum) => electron.ipcRenderer.invoke("bible:get-chapter", bookId, chapterNum),
  bibleSearch: (query) => electron.ipcRenderer.invoke("bible:search", query),
  outputToggle: (displayId) => electron.ipcRenderer.invoke("output:toggle", displayId),
  outputGetStatus: () => electron.ipcRenderer.invoke("output:get-status"),
  getDisplays: () => electron.ipcRenderer.invoke("displays:get-all"),
  onDisplaysChanged: (cb) => electron.ipcRenderer.on("displays-changed", () => cb()),
  outputSendSlide: (slide) => electron.ipcRenderer.invoke("output:send-slide", slide),
  outputGoBlack: () => electron.ipcRenderer.invoke("output:go-black"),
  outputShowImage: (dataUrl) => electron.ipcRenderer.invoke("output:show-image", dataUrl),
  outputShowVideo: (fileUrl) => electron.ipcRenderer.invoke("output:show-video", fileUrl),
  outputShowYoutube: (videoId) => electron.ipcRenderer.invoke("output:show-youtube", videoId),
  onOutputClosed: (cb) => electron.ipcRenderer.on("output-window-closed", () => cb()),
  onMenuToggleOutput: (cb) => electron.ipcRenderer.on("menu-toggle-output", () => cb()),
  onMenuGoBlack: (cb) => electron.ipcRenderer.on("menu-go-black", () => cb()),
  onMenuShowLogo: (cb) => electron.ipcRenderer.on("menu-show-logo", () => cb()),
  onShowSlide: (cb) => electron.ipcRenderer.on("show-slide", (_event, slide) => cb(slide)),
  onGoBlack: (cb) => electron.ipcRenderer.on("go-black", () => cb()),
  onShowImage: (cb) => electron.ipcRenderer.on("show-image", (_event, dataUrl) => cb(dataUrl)),
  onShowVideo: (cb) => electron.ipcRenderer.on("show-video", (_event, fileUrl) => cb(fileUrl)),
  onShowYoutube: (cb) => electron.ipcRenderer.on("show-youtube", (_event, videoId) => cb(videoId)),
  songsGetAll: () => electron.ipcRenderer.invoke("songs:get-all"),
  songsAdd: (song) => electron.ipcRenderer.invoke("songs:add", song),
  songsUpdate: (id, song) => electron.ipcRenderer.invoke("songs:update", id, song),
  songsDelete: (id) => electron.ipcRenderer.invoke("songs:delete", id),
  onMenuNewSong: (cb) => electron.ipcRenderer.on("menu-new-song", () => cb()),
  onMenuNewSongAI: (cb) => electron.ipcRenderer.on("menu-new-song-ai", () => cb()),
  mediaGetAll: () => electron.ipcRenderer.invoke("media:get-all"),
  mediaAdd: () => electron.ipcRenderer.invoke("media:add"),
  mediaDelete: (id) => electron.ipcRenderer.invoke("media:delete", id)
});
