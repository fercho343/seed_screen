import { Library, ListMusic, Radio, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export type RemoteTab = "control" | "library" | "service" | "settings";

const TABS = [
	{ id: "control" as RemoteTab, icon: Radio, label: "Control" },
	{ id: "library" as RemoteTab, icon: Library, label: "Library" },
	{ id: "service" as RemoteTab, icon: ListMusic, label: "Service" },
	{ id: "settings" as RemoteTab, icon: Settings, label: "Settings" },
];

interface BottomNavProps {
	active: RemoteTab;
	onChange: (tab: RemoteTab) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
	return (
		<nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-border bg-card/90 pt-1.5 pb-[max(6px,env(safe-area-inset-bottom))] backdrop-blur-xl">
			{TABS.map(({ id, icon: Icon, label }) => (
				<button
					key={id}
					type="button"
					onClick={() => onChange(id)}
					className={cn(
						"flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90",
						active === id ? "text-primary" : "text-muted-foreground",
					)}
				>
					<div
						className={cn(
							"flex items-center justify-center rounded-full px-5 py-1.5 transition-all",
							active === id ? "bg-primary/10" : "bg-transparent",
						)}
					>
						<Icon className="size-5" />
					</div>
					<span className="text-[10px] font-semibold tracking-wide">{label}</span>
				</button>
			))}
		</nav>
	);
}
