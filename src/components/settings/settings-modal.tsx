import {
	Image,
	ImagePlus,
	Images,
	Laptop,
	Loader2,
	Palette,
	RadioTower,
	Search,
	Trash2,
	Wifi,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type {
	BackgroundItem,
	ImageAsset,
	LocalSyncInfo,
	SyncPeer,
} from "../../../electron/electron-env";
import { applyTheme, DEFAULT_THEME_ID, THEMES } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SECTIONS = [
	{ id: "theme", label: "Theme", icon: Palette },
	{ id: "backgrounds", label: "Backgrounds", icon: Image },
	{ id: "logo", label: "Logo", icon: ImagePlus },
	{ id: "background-images", label: "Background", icon: Images },
	{ id: "sync", label: "Sync", icon: Wifi },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

interface SettingsModalProps {
	open: boolean;
	onClose: () => void;
	onSongsImported?: () => void;
}

export function SettingsModal({ open, onClose, onSongsImported }: SettingsModalProps) {
	const [section, setSection] = useState<SectionId>("theme");
	const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);
	const [originalThemeId, setOriginalThemeId] = useState(DEFAULT_THEME_ID);
	const [backgrounds, setBackgrounds] = useState<BackgroundItem[]>([]);
	const [logo, setLogo] = useState<string | null>(null);
	const [images, setImages] = useState<ImageAsset[]>([]);

	useEffect(() => {
		if (!open) return;
		window.electronAPI.settingsGetAll().then(({ theme, backgrounds, logo, images }) => {
			setThemeId(theme);
			setOriginalThemeId(theme);
			setBackgrounds(backgrounds);
			setLogo(logo);
			setImages(images);
		});
	}, [open]);

	if (!open) return null;

	const handleThemeSelect = (id: string) => {
		setThemeId(id);
		applyTheme(id);
	};

	const handleCancel = () => {
		applyTheme(originalThemeId);
		onClose();
	};

	const handleSave = async () => {
		await window.electronAPI.settingsSetTheme(themeId);
		onClose();
	};

	const refreshBackgrounds = async () => {
		const { backgrounds } = await window.electronAPI.settingsGetAll();
		setBackgrounds(backgrounds);
	};

	const refreshImages = async () => {
		const { images } = await window.electronAPI.settingsGetAll();
		setImages(images);
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
			onClick={(e) => e.target === e.currentTarget && handleCancel()}
		>
			<div className="flex h-[520px] w-[720px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
				<div className="flex items-center justify-between border-b border-border px-5 py-3.5">
					<span className="text-sm font-semibold text-foreground">Settings</span>
					<button
						type="button"
						onClick={handleCancel}
						className="flex size-6 items-center justify-center rounded-md text-text-3 hover:bg-hover hover:text-foreground"
					>
						<X className="size-4" />
					</button>
				</div>

				<div className="flex flex-1 overflow-hidden">
					<nav className="flex w-44 shrink-0 flex-col gap-0.5 border-r border-border bg-muted/40 p-2">
						{SECTIONS.map(({ id, label, icon: Icon }) => (
							<button
								key={id}
								type="button"
								onClick={() => setSection(id)}
								className={cn(
									"flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs font-medium transition-colors",
									section === id
										? "bg-primary/15 text-primary"
										: "text-text-3 hover:bg-hover hover:text-foreground",
								)}
							>
								<Icon className="size-3.5" />
								{label}
							</button>
						))}
					</nav>

					<div className="flex-1 overflow-y-auto p-6">
						{section === "theme" && (
							<ThemeSection themeId={themeId} onSelect={handleThemeSelect} />
						)}
						{section === "backgrounds" && (
							<BackgroundsSection
								backgrounds={backgrounds}
								onChanged={refreshBackgrounds}
							/>
						)}
						{section === "logo" && (
							<LogoSection
								logo={logo}
								onChanged={async () => {
									const { logo } = await window.electronAPI.settingsGetAll();
									setLogo(logo);
								}}
							/>
						)}
						{section === "background-images" && (
							<BackgroundImagesSection images={images} onChanged={refreshImages} />
						)}
						{section === "sync" && <SyncSection onSongsImported={onSongsImported} />}
					</div>
				</div>

				<div className="flex justify-end gap-2 border-t border-border bg-muted/20 px-5 py-3">
					<Button variant="outline" size="sm" className="bg-card" onClick={handleCancel}>
						Cancel
					</Button>
					<Button size="sm" onClick={handleSave}>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
}

function ThemeSection({
	themeId,
	onSelect,
}: {
	themeId: string;
	onSelect: (id: string) => void;
}) {
	return (
		<div>
			<h3 className="text-sm font-semibold text-foreground">Color theme</h3>
			<p className="mt-1 mb-5 text-xs text-text-3">
				Choose a color scheme for the whole app.
			</p>
			<div className="grid grid-cols-2 gap-3">
				{Object.values(THEMES).map((theme) => {
					const active = themeId === theme.id;
					return (
						<button
							key={theme.id}
							type="button"
							onClick={() => onSelect(theme.id)}
							className={cn(
								"flex items-center gap-3 rounded-lg border-2 p-3.5 text-left transition-colors",
								active ? "border-primary bg-primary/10" : "border-border bg-input hover:border-text-3",
							)}
						>
							<div className="flex shrink-0 flex-col gap-1">
								{theme.preview.map((color, i) => (
									<div
										key={i}
										className="h-2.5 w-9 rounded-full"
										style={{ background: color }}
									/>
								))}
							</div>
							<div>
								<div
									className={cn(
										"text-[13px] font-semibold",
										active ? "text-primary" : "text-foreground",
									)}
								>
									{theme.name}
								</div>
								{active && (
									<div className="mt-0.5 text-[10px] font-medium text-primary">
										● Active
									</div>
								)}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}

const BG_PRESET_1 = "#1a1a2e";
const BG_PRESET_2 = "#0f3460";

function BackgroundsSection({
	backgrounds,
	onChanged,
}: {
	backgrounds: BackgroundItem[];
	onChanged: () => void;
}) {
	const [mode, setMode] = useState<"color" | "gradient">("gradient");
	const [name, setName] = useState("");
	const [color1, setColor1] = useState(BG_PRESET_1);
	const [color2, setColor2] = useState(BG_PRESET_2);

	const previewStyle =
		mode === "color"
			? { background: color1 }
			: { background: `linear-gradient(135deg, ${color1}, ${color2})` };

	const handleAdd = async () => {
		const value =
			mode === "color" ? color1 : `linear-gradient(135deg, ${color1}, ${color2})`;
		const label = name.trim() || (mode === "color" ? color1 : `${color1} → ${color2}`);
		await window.electronAPI.backgroundsAdd({ name: label, type: mode, value });
		setName("");
		onChanged();
	};

	const handleDelete = async (id: string) => {
		await window.electronAPI.backgroundsDelete(id);
		onChanged();
	};

	return (
		<div>
			<h3 className="text-sm font-semibold text-foreground">Presentation backgrounds</h3>
			<p className="mt-1 mb-5 text-xs leading-relaxed text-text-3">
				Backgrounds appear behind your lyrics and Bible verses on the audience screen.
				Add a solid color or a gradient here, then pick it from the toolbar while you
				present.
			</p>

			<div className="rounded-lg border border-border bg-input p-4">
				<div className="mb-3.5 flex gap-1.5">
					{(["color", "gradient"] as const).map((m) => (
						<button
							key={m}
							type="button"
							onClick={() => setMode(m)}
							className={cn(
								"rounded-md px-3 py-1 text-xs font-medium transition-colors",
								mode === m
									? "bg-primary text-primary-foreground"
									: "bg-card text-text-3 hover:text-foreground",
							)}
						>
							{m === "color" ? "Solid color" : "Gradient"}
						</button>
					))}
				</div>

				<div className="mb-3 flex items-center gap-3">
					<div className="flex items-center gap-2">
						<span className="text-[11px] text-text-3">
							{mode === "gradient" ? "Color 1" : "Color"}
						</span>
						<input
							type="color"
							value={color1}
							onChange={(e) => setColor1(e.target.value)}
							className="size-8 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
						/>
					</div>
					{mode === "gradient" && (
						<>
							<span className="text-text-3">→</span>
							<div className="flex items-center gap-2">
								<span className="text-[11px] text-text-3">Color 2</span>
								<input
									type="color"
									value={color2}
									onChange={(e) => setColor2(e.target.value)}
									className="size-8 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
								/>
							</div>
						</>
					)}
					<div
						className="h-8 flex-1 rounded-md border border-border"
						style={previewStyle}
					/>
				</div>

				<div className="flex gap-2">
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Name (optional)"
						className="h-8 border-border bg-card text-xs"
					/>
					<Button size="sm" onClick={handleAdd} className="shrink-0">
						Add
					</Button>
				</div>
			</div>

			{backgrounds.length === 0 ? (
				<p className="py-6 text-center text-xs text-text-3">No custom backgrounds yet</p>
			) : (
				<div className="mt-4 grid grid-cols-3 gap-2.5">
					{backgrounds.map((bg) => (
						<div
							key={bg.id}
							className="overflow-hidden rounded-md border border-border"
						>
							<div
								className="h-12"
								style={
									bg.type === "color"
										? { background: bg.value }
										: { backgroundImage: bg.value }
								}
							/>
							<div className="flex items-center justify-between bg-input px-2 py-1.5">
								<span className="truncate text-[10px] text-text-3">{bg.name}</span>
								<button
									type="button"
									onClick={() => handleDelete(bg.id)}
									className="shrink-0 text-text-3 hover:text-red-400"
								>
									<Trash2 className="size-3" />
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function LogoSection({
	logo,
	onChanged,
}: {
	logo: string | null;
	onChanged: () => void;
}) {
	const [busy, setBusy] = useState(false);

	const handlePick = async () => {
		setBusy(true);
		await window.electronAPI.settingsPickLogo();
		setBusy(false);
		onChanged();
	};

	const handleClear = async () => {
		await window.electronAPI.settingsClearLogo();
		onChanged();
	};

	return (
		<div>
			<h3 className="text-sm font-semibold text-foreground">Logo</h3>
			<p className="mt-1 mb-5 text-xs leading-relaxed text-text-3">
				Pick an image to use as the "Logo" screen in Presentation — it shows full-screen on the
				audience output, just like the black screen.
			</p>

			<div className="flex items-center gap-4 rounded-lg border border-border bg-input p-4">
				<div className="flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-card">
					{logo ? (
						<img src={logo} alt="Logo" className="h-full w-full object-contain" />
					) : (
						<span className="text-[10px] text-text-4">No logo</span>
					)}
				</div>
				<div className="flex flex-col gap-2">
					<Button size="sm" disabled={busy} onClick={handlePick}>
						{busy ? "Choosing..." : logo ? "Change logo" : "Choose logo"}
					</Button>
					{logo && (
						<Button variant="outline" size="sm" className="bg-card" onClick={handleClear}>
							Remove logo
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

function BackgroundImagesSection({
	images,
	onChanged,
}: {
	images: ImageAsset[];
	onChanged: () => void;
}) {
	const [busy, setBusy] = useState(false);

	const handleAdd = async () => {
		setBusy(true);
		await window.electronAPI.imagesAdd();
		setBusy(false);
		onChanged();
	};

	const handleDelete = async (id: string) => {
		await window.electronAPI.imagesDelete(id);
		onChanged();
	};

	return (
		<div>
			<h3 className="text-sm font-semibold text-foreground">Background images</h3>
			<p className="mt-1 mb-5 text-xs leading-relaxed text-text-3">
				Add custom images that work just like the black screen and logo — pick one to show it
				full-screen on the audience output, e.g. for sponsor slides or event artwork.
			</p>

			<Button size="sm" disabled={busy} onClick={handleAdd}>
				{busy ? "Choosing..." : "+ Add image"}
			</Button>

			{images.length === 0 ? (
				<p className="py-6 text-center text-xs text-text-3">No background images yet</p>
			) : (
				<div className="mt-4 grid grid-cols-3 gap-2.5">
					{images.map((img) => (
						<div key={img.id} className="overflow-hidden rounded-md border border-border">
							<img src={img.dataUrl} alt={img.name} className="h-20 w-full object-cover" />
							<div className="flex items-center justify-between bg-input px-2 py-1.5">
								<span className="truncate text-[10px] text-text-3">{img.name}</span>
								<button
									type="button"
									onClick={() => handleDelete(img.id)}
									className="shrink-0 text-text-3 hover:text-red-400"
								>
									<Trash2 className="size-3" />
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

interface ImportState {
	loading?: boolean;
	added?: number;
	error?: string;
}

function SyncSection({ onSongsImported }: { onSongsImported?: () => void }) {
	const [localInfo, setLocalInfo] = useState<LocalSyncInfo | null>(null);
	const [peers, setPeers] = useState<SyncPeer[]>([]);
	const [searching, setSearching] = useState(false);
	const [searched, setSearched] = useState(false);
	const [manualIp, setManualIp] = useState("");
	const [status, setStatus] = useState<Record<string, ImportState>>({});

	useEffect(() => {
		window.electronAPI.syncGetLocalInfo().then(setLocalInfo);
		window.electronAPI.syncGetPeers().then(setPeers);
		window.electronAPI.onSyncPeerFound((peer) => {
			setPeers((prev) => [...prev.filter((p) => p.ip !== peer.ip), peer]);
		});
		return () => {
			window.ipcRenderer.removeAllListeners("sync-peer-found");
		};
	}, []);

	const handleSearch = async () => {
		setSearching(true);
		const found = await window.electronAPI.syncSearchPeers();
		setPeers(found);
		setSearching(false);
		setSearched(true);
	};

	const importFrom = async (ip: string, port: number) => {
		setStatus((s) => ({ ...s, [ip]: { loading: true } }));
		try {
			const songs = await window.electronAPI.syncFetchSongs(ip, port);
			const result = await window.electronAPI.syncImportSongs(songs);
			setStatus((s) => ({ ...s, [ip]: { added: result.added } }));
			if (result.added > 0) onSongsImported?.();
		} catch (e) {
			setStatus((s) => ({ ...s, [ip]: { error: e instanceof Error ? e.message : "Failed" } }));
		}
	};

	return (
		<div>
			<h3 className="text-sm font-semibold text-foreground">Local network sync</h3>
			<p className="mt-1 mb-5 text-xs leading-relaxed text-text-3">
				Import songs from another computer running SeedScreen on the same Wi-Fi or
				Ethernet network.
			</p>

			{localInfo && (
				<div className="mb-4 flex items-center gap-3 rounded-lg border border-border bg-input p-3">
					<div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-white">
						<Laptop className="size-4" />
					</div>
					<div className="min-w-0 flex-1">
						<div className="truncate text-[13px] font-semibold text-foreground">
							{localInfo.hostname}
						</div>
						<div className="font-mono text-[11px] text-text-3">
							{localInfo.ip}:{localInfo.port}
						</div>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#4ade80]" />
						<span className="text-[10px] font-semibold text-emerald-400">ACTIVE</span>
					</div>
				</div>
			)}

			<Button
				variant="outline"
				disabled={searching}
				onClick={handleSearch}
				className="mb-4 w-full gap-2 bg-card text-xs"
			>
				{searching ? (
					<Loader2 className="size-3.5 animate-spin" />
				) : (
					<Search className="size-3.5" />
				)}
				{searching ? "Searching for devices…" : "Search for devices"}
			</Button>

			{peers.length === 0 ? (
				<div className="mb-5 rounded-lg border border-dashed border-border bg-input p-5 text-center">
					<RadioTower className="mx-auto mb-2 size-6 text-text-4" />
					<p className="text-xs text-text-3">
						{searched ? "No devices found" : "Search to discover devices on this network"}
					</p>
					{searched && (
						<p className="mt-1 text-[11px] text-text-4">
							Make sure SeedScreen is open on the other computer
						</p>
					)}
				</div>
			) : (
				<div className="mb-5 flex flex-col gap-2">
					{peers.map((peer) => {
						const st = status[peer.ip] ?? {};
						return (
							<div
								key={peer.ip}
								className="flex items-center gap-3 rounded-lg border border-border bg-input p-3"
							>
								<div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
									<Laptop className="size-4" />
								</div>
								<div className="min-w-0 flex-1">
									<div className="truncate text-[13px] font-semibold text-foreground">
										{peer.hostname}
									</div>
									<div className="font-mono text-[11px] text-text-3">
										{peer.ip}:{peer.port} · {peer.songCount} songs
									</div>
									{st.added !== undefined && (
										<div className="text-[11px] text-emerald-400">
											{st.added > 0 ? `${st.added} songs imported` : "Already up to date"}
										</div>
									)}
									{st.error && <div className="text-[11px] text-red-400">{st.error}</div>}
								</div>
								<Button
									size="sm"
									variant="secondary"
									disabled={st.loading}
									onClick={() => importFrom(peer.ip, peer.port)}
									className="text-xs"
								>
									{st.loading ? "…" : st.added !== undefined ? "Done" : "Import"}
								</Button>
							</div>
						);
					})}
				</div>
			)}

			<div className="border-t border-border pt-4">
				<div className="mb-2 text-[11px] text-text-3">Connect by manual IP</div>
				<div className="flex gap-2">
					<Input
						value={manualIp}
						onChange={(e) => setManualIp(e.target.value)}
						placeholder="192.168.1.x"
						className="h-8 border-border bg-card font-mono text-xs"
					/>
					<Button
						size="sm"
						disabled={!manualIp.trim() || status[manualIp.trim()]?.loading}
						onClick={() => importFrom(manualIp.trim(), 3847)}
						className="shrink-0 text-xs"
					>
						{status[manualIp.trim()]?.loading ? "…" : "Connect"}
					</Button>
				</div>
				{manualIp.trim() && status[manualIp.trim()]?.added !== undefined && (
					<div className="mt-1.5 text-[11px] text-emerald-400">
						{status[manualIp.trim()].added! > 0
							? `${status[manualIp.trim()].added} songs imported`
							: "Already up to date"}
					</div>
				)}
				{manualIp.trim() && status[manualIp.trim()]?.error && (
					<div className="mt-1.5 text-[11px] text-red-400">{status[manualIp.trim()].error}</div>
				)}
			</div>
		</div>
	);
}
