/// <reference types="vite-plugin-electron/electron-env" />

export interface BackgroundItem {
	id: string;
	name: string;
	type: "color" | "gradient";
	value: string;
}

export interface LocalSyncInfo {
	hostname: string;
	ip: string;
	port: number;
}

export interface SyncPeer {
	hostname: string;
	ip: string;
	port: number;
	songCount: number;
}

export interface BibleBook {
	id: string;
	name: string;
	abbr: string;
	chapterCount: number;
	index: number;
}

export interface BibleVerse {
	v: number;
	t: string;
}

export interface BibleSearchResult {
	bookName: string;
	abbr: string;
	chapter: number;
	verse: number;
	text: string;
}

export interface SlideRecord {
	id: string;
	label: string;
	text: string;
}

export interface SongRecord {
	id: number;
	title: string;
	author: string;
	language: string;
	slides: SlideRecord[];
	createdAt: string;
	updatedAt: string;
}

export interface SongInput {
	title: string;
	author: string;
	language: string;
	slides: SlideRecord[];
}

export interface ElectronAPI {
	settingsGetAll: () => Promise<{ theme: string; backgrounds: BackgroundItem[] }>;
	settingsSetTheme: (theme: string) => Promise<boolean>;
	backgroundsAdd: (bg: {
		name: string;
		type: "color" | "gradient";
		value: string;
	}) => Promise<BackgroundItem>;
	backgroundsDelete: (id: string) => Promise<boolean>;
	syncGetLocalInfo: () => Promise<LocalSyncInfo>;
	syncSearchPeers: () => Promise<SyncPeer[]>;
	onOpenSettings: (cb: () => void) => void;
	bibleGetBooks: () => Promise<BibleBook[]>;
	bibleGetChapter: (bookId: string, chapterNum: number) => Promise<BibleVerse[]>;
	bibleSearch: (query: string) => Promise<BibleSearchResult[]>;
	outputToggle: () => Promise<{ opened: boolean }>;
	outputGetStatus: () => Promise<{ isOpen: boolean }>;
	outputSendText: (text: string) => Promise<boolean>;
	outputGoBlack: () => Promise<boolean>;
	onOutputClosed: (cb: () => void) => void;
	onMenuToggleOutput: (cb: () => void) => void;
	onShowText: (cb: (text: string) => void) => void;
	onGoBlack: (cb: () => void) => void;
	songsGetAll: () => Promise<SongRecord[]>;
	songsAdd: (song: SongInput) => Promise<SongRecord>;
	songsUpdate: (id: number, song: SongInput) => Promise<SongRecord | null>;
	songsDelete: (id: number) => Promise<boolean>;
	onMenuNewSong: (cb: () => void) => void;
	onMenuNewSongAI: (cb: () => void) => void;
}

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			/**
			 * The built directory structure
			 *
			 * ```tree
			 * ├─┬─┬ dist
			 * │ │ └── index.html
			 * │ │
			 * │ ├─┬ dist-electron
			 * │ │ ├── main.js
			 * │ │ └── preload.js
			 * │
			 * ```
			 */
			APP_ROOT: string;
			/** /dist/ or /public/ */
			VITE_PUBLIC: string;
		}
	}

	// Used in Renderer process, expose in `preload.ts`
	interface Window {
		ipcRenderer: import("electron").IpcRenderer;
		electronAPI: ElectronAPI;
	}
}
