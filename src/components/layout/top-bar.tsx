import {
	AlignCenter,
	AlignLeft,
	Bold,
	Italic,
	Monitor,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";

const STYLE_ITEMS = [
	{ value: "bold", label: "Bold", icon: Bold },
	{ value: "italic", label: "Italic", icon: Italic },
] as const;

const ALIGN_ITEMS = [
	{ value: "left", label: "Align left", icon: AlignLeft },
	{ value: "center", label: "Align center", icon: AlignCenter },
] as const;

const BACKGROUNDS = [
	{ id: "black", label: "Black", style: { background: "#000000" } },
	{
		id: "dark-purple",
		label: "Dark Purple",
		style: { background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" },
	},
	{
		id: "night-blue",
		label: "Night Blue",
		style: { background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)" },
	},
	{
		id: "forest-green",
		label: "Forest Green",
		style: { background: "linear-gradient(135deg, #1b4332, #2d6a4f, #40916c)" },
	},
	{
		id: "deep-red",
		label: "Deep Red",
		style: { background: "linear-gradient(135deg, #3d0000, #8b0000, #b22222)" },
	},
	{
		id: "dark-gray",
		label: "Dark Gray",
		style: { background: "linear-gradient(160deg, #0a0a0a, #1a1a1a)" },
	},
] as const;

const MONITORS = [
	{ value: "external", label: "External Monitor" },
	{ value: "built-in", label: "Built-in Display" },
] as const;

function BackgroundPicker() {
	const [selected, setSelected] = useState<string>("night-blue");
	const current =
		BACKGROUNDS.find((c) => c.id === selected) ?? BACKGROUNDS[2];

	return (
		<Popover>
			<PopoverTrigger className="flex items-center gap-1.5 rounded-md px-1.5 py-1.5 hover:bg-hover">
				<span
					className="size-4 shrink-0 rounded-sm border border-border"
					style={current.style}
				/>
				<span className="text-[11px] text-muted-foreground">Background</span>
			</PopoverTrigger>
			<PopoverContent className="w-auto bg-card p-3">
				<div className="grid grid-cols-3 gap-2">
					{BACKGROUNDS.map((bg) => (
						<button
							key={bg.id}
							type="button"
							onClick={() => setSelected(bg.id)}
							style={bg.style}
							className={cn(
								"flex h-13 w-22 items-center justify-center rounded-md text-center text-[10px] font-medium text-white/80 outline-2 outline-offset-2 outline-transparent transition-all [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]",
								selected === bg.id && "outline-primary",
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

interface TopBarProps {
	outputOpen: boolean;
	onToggleOutput: () => void;
}

export function TopBar({ outputOpen, onToggleOutput }: TopBarProps) {
	const [styles, setStyles] = useState<string[]>(["bold"]);
	const [align, setAlign] = useState<string[]>(["center"]);
	const [isAnimated, setIsAnimated] = useState(true);
	const [monitor, setMonitor] = useState("external");
	const [fontSize, setFontSize] = useState(56);

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
						onClick={() => setFontSize((s) => Math.max(20, s - 4))}
					>
						A-
					</Button>
					<span className="w-7 text-center text-xs text-muted-foreground">
						{fontSize}
					</span>
					<Button
						variant="outline"
						size="xs"
						className="bg-card"
						aria-label="Increase text size"
						onClick={() => setFontSize((s) => Math.min(120, s + 4))}
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
					value={styles}
					onValueChange={setStyles}
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
					value={align}
					onValueChange={setAlign}
					className="bg-card"
				>
					{ALIGN_ITEMS.map(({ value, label, icon: Icon }) => (
						<ToggleGroupItem key={value} value={value} aria-label={label}>
							<Icon className="size-3.5" />
						</ToggleGroupItem>
					))}
				</ToggleGroup>

				<Separator orientation="vertical" className="h-7" />

				<BackgroundPicker />

				<div className="flex items-center gap-1.5 pl-1">
					<Switch
						size="sm"
						checked={isAnimated}
						onCheckedChange={setIsAnimated}
					/>
					<span
						className={cn(
							"text-[11px] whitespace-nowrap",
							isAnimated ? "text-primary" : "text-text-3",
						)}
					>
						Animated
					</span>
				</div>

				<Separator orientation="vertical" className="h-7" />

				<Select value={monitor} onValueChange={(v) => v && setMonitor(v)}>
					<SelectTrigger className="bg-card text-xs">
						<SelectValue>
							{(value: string) =>
								MONITORS.find((m) => m.value === value)?.label
							}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{MONITORS.map((m) => (
							<SelectItem key={m.value} value={m.value}>
								{m.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

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
