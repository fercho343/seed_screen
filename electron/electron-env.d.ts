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
	/** Per-language translations of `text`, keyed by ISO 639-1 code. */
	translations?: Record<string, string>;
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

export interface DisplayInfo {
	id: number;
	label: string;
	isPrimary: boolean;
}

export interface SlideSettingsPayload {
	fontSize: number;
	bold: boolean;
	italic: boolean;
	textAlign: "left" | "center";
	animated: boolean;
	background: { id: string; label: string; type: "color" | "gradient"; value: string };
}

export interface LiveSlidePayload {
	text: string;
	title?: string;
	settings: SlideSettingsPayload;
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
	syncGetPeers: () => Promise<SyncPeer[]>;
	syncSearchPeers: () => Promise<SyncPeer[]>;
	syncFetchSongs: (ip: string, port: number) => Promise<SongRecord[]>;
	syncImportSongs: (songs: SongRecord[]) => Promise<{ added: number; total: number }>;
	onSyncPeerFound: (cb: (peer: SyncPeer) => void) => void;
	onOpenSettings: (cb: () => void) => void;
	bibleGetBooks: () => Promise<BibleBook[]>;
	bibleGetChapter: (bookId: string, chapterNum: number) => Promise<BibleVerse[]>;
	bibleSearch: (query: string) => Promise<BibleSearchResult[]>;
	outputToggle: (displayId?: number) => Promise<{ opened: boolean }>;
	outputGetStatus: () => Promise<{ isOpen: boolean }>;
	outputSendSlide: (slide: LiveSlidePayload) => Promise<boolean>;
	outputGoBlack: () => Promise<boolean>;
	getDisplays: () => Promise<DisplayInfo[]>;
	onDisplaysChanged: (cb: () => void) => void;
	onOutputClosed: (cb: () => void) => void;
	onMenuToggleOutput: (cb: () => void) => void;
	onShowSlide: (cb: (slide: LiveSlidePayload) => void) => void;
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
