export interface ThemeDef {
	id: string;
	name: string;
	preview: [string, string, string];
	vars: Record<string, string>;
}

interface LegacyPalette {
	bgApp: string;
	bgToolbar: string;
	bgPanel: string;
	bgHeader: string;
	bgBase: string;
	bgInput: string;
	border: string;
	accent: string;
	accent2: string;
	accentDim: string;
	text1: string;
	text2: string;
	text3: string;
	text4: string;
	hover: string;
}

function toCssVars(p: LegacyPalette): Record<string, string> {
	return {
		"--app": p.bgApp,
		"--background": p.bgBase,
		"--foreground": p.text1,
		"--card": p.bgPanel,
		"--card-foreground": p.text1,
		"--popover": p.bgPanel,
		"--popover-foreground": p.text1,
		"--primary": p.accent,
		"--primary-foreground": "#ffffff",
		"--secondary": p.border,
		"--secondary-foreground": p.text1,
		"--muted": p.bgHeader,
		"--muted-foreground": p.text2,
		"--accent": p.hover,
		"--accent-foreground": p.text1,
		"--border": p.border,
		"--input": p.bgInput,
		"--ring": p.accent,
		"--header": p.bgToolbar,
		"--header-foreground": p.text1,
		"--hover": p.hover,
		"--text-3": p.text3,
		"--text-4": p.text4,
		"--accent-2": p.accent2,
		"--accent-dim": p.accentDim,
		"--sidebar": p.bgPanel,
		"--sidebar-foreground": p.text1,
		"--sidebar-primary": p.accent,
		"--sidebar-primary-foreground": "#ffffff",
		"--sidebar-accent": p.hover,
		"--sidebar-accent-foreground": p.text1,
		"--sidebar-border": p.border,
		"--sidebar-ring": p.accent,
	};
}

export const THEMES: Record<string, ThemeDef> = {
	marino: {
		id: "marino",
		name: "Navy",
		preview: ["#0c1426", "#101d33", "#3b82f6"],
		vars: toCssVars({
			bgApp: "#0c1426",
			bgToolbar: "#081020",
			bgPanel: "#101d33",
			bgHeader: "#0a1828",
			bgBase: "#070f1c",
			bgInput: "#060e1a",
			border: "#1a2e4a",
			accent: "#3b82f6",
			accent2: "#1d4ed8",
			accentDim: "#3b82f622",
			text1: "#e2e8f0",
			text2: "#94a3b8",
			text3: "#5a7aa0",
			text4: "#2d4a6b",
			hover: "#0e1f3a",
		}),
	},
	oscuro: {
		id: "oscuro",
		name: "Dark",
		preview: ["#1a1d23", "#1e2128", "#4f46e5"],
		vars: toCssVars({
			bgApp: "#1a1d23",
			bgToolbar: "#13151a",
			bgPanel: "#1e2128",
			bgHeader: "#191c22",
			bgBase: "#111315",
			bgInput: "#13151a",
			border: "#2a2d35",
			accent: "#4f46e5",
			accent2: "#7c3aed",
			accentDim: "#4f46e522",
			text1: "#e2e8f0",
			text2: "#94a3b8",
			text3: "#64748b",
			text4: "#374151",
			hover: "#1c1f27",
		}),
	},
	medianoche: {
		id: "medianoche",
		name: "Midnight",
		preview: ["#09090b", "#18181b", "#a855f7"],
		vars: toCssVars({
			bgApp: "#09090b",
			bgToolbar: "#09090b",
			bgPanel: "#18181b",
			bgHeader: "#121214",
			bgBase: "#000000",
			bgInput: "#0a0a0c",
			border: "#27272a",
			accent: "#a855f7",
			accent2: "#9333ea",
			accentDim: "#a855f722",
			text1: "#fafafa",
			text2: "#a1a1aa",
			text3: "#52525b",
			text4: "#27272a",
			hover: "#1c1c1f",
		}),
	},
	esmeralda: {
		id: "esmeralda",
		name: "Emerald",
		preview: ["#0a1a14", "#0f2318", "#10b981"],
		vars: toCssVars({
			bgApp: "#0a1a14",
			bgToolbar: "#061510",
			bgPanel: "#0f2318",
			bgHeader: "#0c1e16",
			bgBase: "#050e0b",
			bgInput: "#061510",
			border: "#14532d",
			accent: "#10b981",
			accent2: "#059669",
			accentDim: "#10b98122",
			text1: "#e2e8f0",
			text2: "#94a3b8",
			text3: "#4a7065",
			text4: "#1f4035",
			hover: "#0d1f18",
		}),
	},
};

export const DEFAULT_THEME_ID = "marino";

export function applyTheme(themeId: string) {
	const theme = THEMES[themeId] ?? THEMES[DEFAULT_THEME_ID];
	// The ".dark" class (see global.css) re-declares these custom properties,
	// so they must be overridden on that same element — setting them on
	// <html> would be shadowed by the closer ".dark" declaration.
	const root = document.getElementById("app-root") ?? document.documentElement;
	for (const [key, value] of Object.entries(theme.vars)) {
		root.style.setProperty(key, value);
	}
}
