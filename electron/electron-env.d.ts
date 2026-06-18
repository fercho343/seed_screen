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
