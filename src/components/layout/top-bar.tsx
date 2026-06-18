import { AlignCenter, AlignLeft, Bold, Italic, Monitor } from "lucide-react";
import { useState } from "react";
import Logo from "@/assets/logo.png";
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

const BACKGROUND_COLORS = [
	{ id: "black", label: "Negro", className: "bg-black" },
	{ id: "dark-purple", label: "Púrpura oscuro", className: "bg-purple-950" },
	{ id: "night-blue", label: "Azul noche", className: "bg-card" },
	{ id: "forest-green", label: "Verde bosque", className: "bg-emerald-800" },
	{ id: "deep-red", label: "Rojo profundo", className: "bg-red-900" },
	{ id: "dark-gray", label: "Gris oscuro", className: "bg-zinc-800" },
] as const;

const MONITORS = [
	{ value: "external", label: "Monitor externo" },
	{ value: "built-in", label: "Pantalla integrada" },
] as const;

function BackgroundPicker() {
	const [selected, setSelected] = useState<string>("night-blue");
	const current =
		BACKGROUND_COLORS.find((c) => c.id === selected) ?? BACKGROUND_COLORS[2];

	return (
		<Popover>
			<PopoverTrigger className="flex items-center gap-1.5 rounded px-1.5 py-2 hover:bg-muted">
				<span
					className={cn(
						"size-5 rounded-sm border border-border",
						current.className,
					)}
				/>
				<span className="text-[11px]">Background</span>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-2">
				<div className="grid grid-cols-3 gap-2">
					{BACKGROUND_COLORS.map((color) => (
						<button
							key={color.id}
							type="button"
							onClick={() => setSelected(color.id)}
							className={cn(
								"flex h-16 w-24 items-center justify-center rounded-lg text-center text-xs font-medium text-white outline-2 outline-offset-2 outline-transparent transition-all",
								color.className,
								selected === color.id && "outline-ring",
							)}
						>
							{color.label}
						</button>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}

export function TopBar() {
	const [styles, setStyles] = useState<string[]>([]);
	const [align, setAlign] = useState<string[]>(["center"]);
	const [isAnimated, setIsAnimated] = useState(true);
	const [monitor, setMonitor] = useState("external");

	return (
		<header className="flex h-12 shrink-0 items-center justify-between gap-3 bg-header px-4 text-header-foreground">
			<div className="flex items-center gap-x-3">
				<div className="flex items-center gap-2">
					<img
						src={Logo}
						alt="SeedScreen Logo"
						className="size-8 rounded object-cover"
					/>
					<span className="text-sm font-semibold">SeedScreen</span>
				</div>

				<Separator orientation="vertical" className="h-10" />

				<div className="flex items-center gap-0.5">
					<Button variant="ghost" size="xs" aria-label="Decrease text size">
						A-
					</Button>
					<span className="w-8 text-center text-sm font-medium">56</span>
					<Button variant="ghost" size="xs" aria-label="Increase text size">
						A+
					</Button>
				</div>

				<Separator orientation="vertical" className="h-10" />

				<div className="flex items-center gap-1.5">
					<ToggleGroup
						variant="outline"
						size="sm"
						spacing={0}
						multiple
						value={styles}
						onValueChange={setStyles}
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
					>
						{ALIGN_ITEMS.map(({ value, label, icon: Icon }) => (
							<ToggleGroupItem key={value} value={value} aria-label={label}>
								<Icon className="size-3.5" />
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</div>

				<Separator orientation="vertical" className="h-10" />

				<BackgroundPicker />

				<div className="flex items-center gap-1.5">
					<span className="text-[11px]">Animated</span>
					<Switch checked={isAnimated} onCheckedChange={setIsAnimated} />
				</div>
			</div>

			<div className="flex flex-row items-center gap-x-2">
				<Select value={monitor} onValueChange={(v) => v && setMonitor(v)}>
					<SelectTrigger>
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

				<Button size="sm" className="gap-1.5">
					<Monitor className="size-3.5" />
					PROJECT
				</Button>
			</div>
		</header>
	);
}
