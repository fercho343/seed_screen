/// <reference types="vite-plugin-electron/electron-env" />

export interface BackgroundItem {
	id: string;
	name: string;
	type: "color" | "gradient";
	value: string;
}

export interface ImageAsset {
	id: string;
	name: string;
	/** Stored as a base64 data URL so it round-trips through electron-store with no separate file management. */
	dataUrl: string;
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

export type BibleLang = "es" | "en";

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

export interface MediaRecord {
	id: number;
	type: "image" | "video";
	title: string;
	filePath: string;
	/** `media:///<filename>` URL the renderer can load directly in <img>/<video> src. */
	url: string;
	createdAt: string;
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

export interface RemoteStatus {
	active: boolean;
	url: string | null;
}

export interface RemoteBackground {
	type: "color" | "gradient";
	value: string;
}

export interface RemoteServiceItem {
	scheduleId: string;
	title: string;
	type: string;
	slideCount: number;
	previewText: string;
}

export interface RemoteSlide {
	id: string;
	label: string;
	text: string;
}

export interface RemoteImage {
	id: string;
	name: string;
	dataUrl: string;
}

export type RemoteScreenMode =
	| { kind: "black" }
	| { kind: "logo" }
	| { kind: "image"; id: string }
	| null;

export interface RemoteState {
	outputOpen: boolean;
	background: RemoteBackground;
	items: RemoteServiceItem[];
	selectedItemId: string | null;
	slides: RemoteSlide[];
	selectedSlideId: string | null;
	liveItemId: string | null;
	liveSlideId: string | null;
	liveText: string | null;
	screenMode: RemoteScreenMode;
	logo: string | null;
	images: RemoteImage[];
}

export type RemoteCommand =
	| { type: "next" }
	| { type: "prev" }
	| { type: "black" }
	| { type: "selectItem"; itemId: string }
	| { type: "goLive"; itemId: string; slideId: string }
	| { type: "toggleOutput" }
	| { type: "showLogo" }
	| { type: "showImage"; id: string };

export interface ElectronAPI {
	settingsGetAll: () => Promise<{
		theme: string;
		backgrounds: BackgroundItem[];
		logo: string | null;
		images: ImageAsset[];
	}>;
	settingsSetTheme: (theme: string) => Promise<boolean>;
	settingsPickLogo: () => Promise<string | null>;
	settingsClearLogo: () => Promise<boolean>;
	backgroundsAdd: (bg: {
		name: string;
		type: "color" | "gradient";
		value: string;
	}) => Promise<BackgroundItem>;
	backgroundsDelete: (id: string) => Promise<boolean>;
	imagesAdd: () => Promise<ImageAsset[]>;
	imagesDelete: (id: string) => Promise<ImageAsset[]>;
	syncGetLocalInfo: () => Promise<LocalSyncInfo>;
	syncGetPeers: () => Promise<SyncPeer[]>;
	syncSearchPeers: () => Promise<SyncPeer[]>;
	syncFetchSongs: (ip: string, port: number) => Promise<SongRecord[]>;
	syncImportSongs: (songs: SongRecord[]) => Promise<{ added: number; total: number }>;
	onSyncPeerFound: (cb: (peer: SyncPeer) => void) => void;
	remoteGetStatus: () => Promise<RemoteStatus>;
	remotePushState: (state: RemoteState) => Promise<boolean>;
	onRemoteCommand: (cb: (cmd: RemoteCommand) => void) => void;
	onRemoteStatusChanged: (cb: (status: RemoteStatus) => void) => void;
	onOpenSettings: (cb: () => void) => void;
	bibleGetBooks: (lang: BibleLang) => Promise<BibleBook[]>;
	bibleGetChapter: (bookId: string, chapterNum: number, lang: BibleLang) => Promise<BibleVerse[]>;
	bibleSearch: (query: string, lang: BibleLang) => Promise<BibleSearchResult[]>;
	outputToggle: (displayId?: number) => Promise<{ opened: boolean }>;
	outputGetStatus: () => Promise<{ isOpen: boolean }>;
	outputSendSlide: (slide: LiveSlidePayload) => Promise<boolean>;
	outputGoBlack: () => Promise<boolean>;
	outputShowImage: (dataUrl: string) => Promise<boolean>;
	outputShowVideo: (fileUrl: string) => Promise<boolean>;
	outputShowYoutube: (videoId: string) => Promise<boolean>;
	getDisplays: () => Promise<DisplayInfo[]>;
	onDisplaysChanged: (cb: () => void) => void;
	onOutputClosed: (cb: () => void) => void;
	onMenuToggleOutput: (cb: () => void) => void;
	onMenuGoBlack: (cb: () => void) => void;
	onMenuShowLogo: (cb: () => void) => void;
	onShowSlide: (cb: (slide: LiveSlidePayload) => void) => void;
	onGoBlack: (cb: () => void) => void;
	onShowImage: (cb: (dataUrl: string) => void) => void;
	onShowVideo: (cb: (fileUrl: string) => void) => void;
	onShowYoutube: (cb: (videoId: string) => void) => void;
	songsGetAll: () => Promise<SongRecord[]>;
	songsAdd: (song: SongInput) => Promise<SongRecord>;
	songsUpdate: (id: number, song: SongInput) => Promise<SongRecord | null>;
	songsDelete: (id: number) => Promise<boolean>;
	onMenuNewSong: (cb: () => void) => void;
	onMenuNewSongAI: (cb: () => void) => void;
	mediaGetAll: () => Promise<MediaRecord[]>;
	mediaAdd: () => Promise<MediaRecord[]>;
	mediaDelete: (id: number) => Promise<MediaRecord[]>;
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
