import { Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopBarProps {
	title: string;
	connected: boolean;
	outputOpen: boolean;
	confirmToggle: boolean;
	onToggleOutput: () => void;
}

export function TopBar({ title, connected, outputOpen, confirmToggle, onToggleOutput }: TopBarProps) {
	return (
		<header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-2 border-b border-border bg-card/80 px-4 backdrop-blur-md">
			<div className="flex min-w-0 items-center gap-2">
				<span className="truncate text-[13px] font-bold tracking-wide text-foreground">
					{title}
				</span>
				<Badge
					variant={connected ? (outputOpen ? "default" : "outline") : "destructive"}
					className="shrink-0 text-[9px] font-bold tracking-wider uppercase"
				>
					{connected ? (outputOpen ? "Live" : "Connected") : "Reconnecting"}
				</Badge>
			</div>
			<div className="flex shrink-0 items-center gap-2">
				{connected ? (
					<Wifi className="size-4 text-primary" />
				) : (
					<WifiOff className="size-4 text-destructive" />
				)}
				<Button
					size="sm"
					variant={confirmToggle ? "destructive" : outputOpen ? "outline" : "default"}
					className={cn("h-7 px-2.5 text-[11px] font-bold", confirmToggle && "animate-pulse")}
					onClick={onToggleOutput}
				>
					{confirmToggle ? "Confirm" : outputOpen ? "Stop" : "Start"}
				</Button>
			</div>
		</header>
	);
}
