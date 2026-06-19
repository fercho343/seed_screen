import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron/simple";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	plugins: [
		react(),
		tailwindcss(),
		electron({
			main: {
				// Shortcut of `build.lib.entry`.
				entry: "electron/main.ts",
				vite: {
					build: {
						rollupOptions: {
							// better-sqlite3 (via the `bindings` package) locates its native
							// .node file using CJS-only globals (__filename/module). Bundling
							// it into the ESM main process output breaks that lookup, so it
							// must stay external and be loaded via Node's native require.
							external: ["better-sqlite3"],
						},
					},
				},
			},
			preload: {
				// Shortcut of `build.rollupOptions.input`.
				// Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
				input: path.join(__dirname, "electron/preload.ts"),
			},
			// Ployfill the Electron and Node.js API for Renderer process.
			// If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
			// See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
			renderer:
				process.env.NODE_ENV === "test"
					? // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
						undefined
					: {},
		}),
	],
});
