import { AlignCenter, AlignLeft, Bold, Italic, Monitor, Smartphone } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import type { BackgroundItem, DisplayInfo, RemoteStatus } from "../../../electron/electron-env";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BACKGROUNDS, type SlideSettings } from "@/lib/slide-settings";
import { cn } from "@/lib/utils";

const STYLE_ITEMS = [
	{ value: "bold", label: "Bold", icon: Bold },
	{ value: "italic", label: "Italic", icon: Italic },
] as const;

const ALIGN_ITEMS = [
	{ value: "left", label: "Align left", icon: AlignLeft },
	{ value: "center", label: "Align center", icon: AlignCenter },
] as const;

interface BackgroundPickerProps {
	selected: SlideSettings["background"];
	onSelect: (bg: SlideSettings["background"]) => void;
	customBackgrounds?: BackgroundItem[];
}

function BackgroundPicker({ selected, onSelect, customBackgrounds = [] }: BackgroundPickerProps) {
	const allBackgrounds = [
		...BACKGROUNDS,
		...customBackgrounds.map((bg) => ({ id: bg.id, label: bg.name, type: bg.type, value: bg.value })),
	];

	return (
		<Popover>
			<PopoverTrigger className="flex items-center gap-1.5 rounded-md px-1.5 py-1.5 hover:bg-hover">
				<span
					className="size-4 shrink-0 rounded-sm border border-border"
					style={
						selected.type === "color"
							? { background: selected.value }
							: { backgroundImage: selected.value }
					}
				/>
				<span className="text-[11px] text-muted-foreground">Background</span>
			</PopoverTrigger>
			<PopoverContent className="w-auto bg-card p-3">
				<div className="grid grid-cols-3 gap-2">
					{allBackgrounds.map((bg) => (
						<button
							key={bg.id}
							type="button"
							onClick={() => onSelect(bg)}
							style={bg.type === "color" ? { background: bg.value } : { backgroundImage: bg.value }}
							className={cn(
								"flex h-13 w-22 items-center justify-center rounded-md text-center text-[10px] font-medium text-white/80 outline-2 outline-offset-2 outline-transparent transition-all [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]",
								selected.id === bg.id && "outline-primary",
							)}
						>
							{bg.label}
						</button>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}

function RemoteQrButton({ url }: { url: string }) {
	const [qr, setQr] = useState<string | null>(null);

	useEffect(() => {
		QRCode.toDataURL(url, { width: 220, margin: 1 }).then(setQr);
	}, [url]);

	return (
		<Popover>
			<PopoverTrigger
				className="flex items-center gap-1.5 rounded-md bg-card px-2 py-1.5 text-[11px] text-emerald-400 hover:bg-hover"
				title="Mostrar codigo QR del control remoto"
			>
				<Smartphone className="size-3.5" />
				Remote control enabled
			</PopoverTrigger>
			<PopoverContent className="w-auto bg-card p-4">
				<div className="flex flex-col items-center gap-2.5">
					{qr ? (
						<img src={qr} alt="QR del control remoto" className="size-44 rounded-md" />
					) : (
						<div className="flex size-44 items-center justify-center text-xs text-text-3">
							Generando QR...
						</div>
					)}
					<p className="text-[11px] text-text-3">Escanea para abrir el control remoto</p>
					<p className="font-mono text-[11px] text-muted-foreground">{url.replace("http://", "")}</p>
				</div>
			</PopoverContent>
		</Popover>
	);
}

interface TopBarProps {
	outputOpen: boolean;
	onToggleOutput: () => void;
	displays: DisplayInfo[];
	selectedDisplay: number | null;
	onSelectDisplay: (id: number) => void;
	slideSettings: SlideSettings;
	onSlideSettingsChange: (updater: (s: SlideSettings) => SlideSettings) => void;
	remoteStatus?: RemoteStatus;
	customBackgrounds?: BackgroundItem[];
}

export function TopBar({
	outputOpen,
	onToggleOutput,
	displays,
	selectedDisplay,
	onSelectDisplay,
	slideSettings,
	onSlideSettingsChange,
	remoteStatus,
	customBackgrounds,
}: TopBarProps) {
	const activeStyles = [
		...(slideSettings.bold ? ["bold"] : []),
		...(slideSettings.italic ? ["italic"] : []),
	];

	return (
		<header className="flex h-[52px] shrink-0 items-center gap-2 bg-header px-4 text-header-foreground">
			<div className="flex items-center gap-2">
				<div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent-2 text-sm font-extrabold text-white">
					S
				</div>
				<span className="text-[15px] font-bold tracking-wide">SeedScreen</span>
			</div>

			<div className="flex-1" />

			<div className="flex items-center gap-1.5">
				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="xs"
						className="bg-card"
						aria-label="Decrease text size"
						onClick={() =>
							onSlideSettingsChange((s) => ({ ...s, fontSize: Math.max(20, s.fontSize - 4) }))
						}
					>
						A-
					</Button>
					<span className="w-7 text-center text-xs text-muted-foreground">
						{slideSettings.fontSize}
					</span>
					<Button
						variant="outline"
						size="xs"
						className="bg-card"
						aria-label="Increase text size"
						onClick={() =>
							onSlideSettingsChange((s) => ({ ...s, fontSize: Math.min(120, s.fontSize + 4) }))
						}
					>
						A+
					</Button>
				</div>

				<Separator orientation="vertical" className="h-7" />

				<ToggleGroup
					variant="outline"
					size="sm"
					spacing={0}
					multiple
					value={activeStyles}
					onValueChange={(v) =>
						onSlideSettingsChange((s) => ({
							...s,
							bold: v.includes("bold"),
							italic: v.includes("italic"),
						}))
					}
					className="bg-card"
				>
					{STYLE_ITEMS.map(({ value, label, icon: Icon }) => (
						<ToggleGroupItem key={value} value={value} aria-label={label}>
							<Icon className="size-3.5" />
						</ToggleGroupItem>
					))}
				</ToggleGroup>

				<ToggleGroup
					variant="outline"
					size="sm"
					spacing={0}
					value={[slideSettings.textAlign]}
					onValueChange={(v) =>
						v[0] && onSlideSettingsChange((s) => ({ ...s, textAlign: v[0] as "left" | "center" }))
					}
					className="bg-card"
				>
					{ALIGN_ITEMS.map(({ value, label, icon: Icon }) => (
						<ToggleGroupItem key={value} value={value} aria-label={label}>
							<Icon className="size-3.5" />
						</ToggleGroupItem>
					))}
				</ToggleGroup>

				<Separator orientation="vertical" className="h-7" />

				<BackgroundPicker
					selected={slideSettings.background}
					onSelect={(bg) => onSlideSettingsChange((s) => ({ ...s, background: bg }))}
					customBackgrounds={customBackgrounds}
				/>

				<div className="flex items-center gap-1.5 pl-1">
					<Switch
						size="sm"
						checked={slideSettings.animated}
						onCheckedChange={(v) => onSlideSettingsChange((s) => ({ ...s, animated: v }))}
					/>
					<span
						className={cn(
							"text-[11px] whitespace-nowrap",
							slideSettings.animated ? "text-primary" : "text-text-3",
						)}
					>
						Animated
					</span>
				</div>

				{displays.length > 1 && (
					<>
						<Separator orientation="vertical" className="h-7" />
						<Select
							value={selectedDisplay ? String(selectedDisplay) : undefined}
							onValueChange={(v) => v && onSelectDisplay(Number(v))}
						>
							<SelectTrigger className="bg-card text-xs">
								<SelectValue>
									{(value: string) => displays.find((d) => String(d.id) === value)?.label}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{displays.map((d) => (
									<SelectItem key={d.id} value={String(d.id)}>
										{d.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</>
				)}

				{remoteStatus?.active && remoteStatus.url && (
					<>
						<Separator orientation="vertical" className="h-7" />
						<RemoteQrButton url={remoteStatus.url} />
					</>
				)}

				<Separator orientation="vertical" className="h-7" />

				<Button
					size="sm"
					onClick={onToggleOutput}
					className={cn(
						"gap-1.5 font-bold tracking-wide",
						outputOpen
							? "bg-emerald-600 text-white hover:bg-emerald-600/90"
							: "bg-primary text-primary-foreground hover:bg-primary/90",
					)}
				>
					<Monitor className="size-3.5" />
					{outputOpen ? "LIVE" : "PROJECT"}
					{outputOpen && (
						<span className="size-2 animate-[pulse-live_1.5s_infinite] rounded-full bg-emerald-300" />
					)}
				</Button>
			</div>
		</header>
	);
}
