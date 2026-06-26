import { EyeOff, Image as ImageIcon, Server, Wifi, WifiOff } from "lucide-react";
import type { RemoteState } from "../../../electron/electron-env";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { send } from "../lib/remote-api";

interface SettingsPageProps {
	connected: boolean;
	state: RemoteState | null;
	confirmToggle: boolean;
	onToggleOutput: () => void;
}

export function SettingsPage({ connected, state, confirmToggle, onToggleOutput }: SettingsPageProps) {
	return (
		<div className="flex flex-col gap-4 px-4 pt-4 pb-2">
			<div className="px-0.5">
				<span className="text-[10px] font-bold tracking-widest text-primary uppercase">Status</span>
				<h2 className="mt-0.5 text-[18px] font-bold text-foreground">Settings</h2>
			</div>

			{/* Connection status */}
			<div className="overflow-hidden rounded-xl border border-border bg-card p-4">
				<div className="flex items-start justify-between">
					<div>
						<p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
							Server status
						</p>
						<h3 className={cn("mt-1 text-[17px] font-bold", connected ? "text-primary" : "text-destructive")}>
							{connected ? "Connected" : "Disconnected"}
						</h3>
					</div>
					<Server className={cn("mt-0.5 size-6", connected ? "text-primary" : "text-muted-foreground")} />
				</div>
				<div className="mt-4 flex items-center gap-2.5">
					<div
						className={cn(
							"size-2 rounded-full",
							connected ? "bg-emerald-500 shadow-[0_0_8px_#34d399]" : "bg-muted-foreground",
						)}
					/>
					<span className="text-[12px] text-muted-foreground">
						{connected ? "Receiving live state" : "Reconnecting..."}
					</span>
				</div>
			</div>

			{/* Output control */}
			<div className="rounded-xl border border-border bg-card p-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-[13px] font-semibold text-foreground">Screen output</p>
						<p className="mt-0.5 text-[11px] text-muted-foreground">
							{state?.outputOpen ? "Currently projecting" : "No active output"}
						</p>
					</div>
					<div
						className={cn(
							"size-2.5 rounded-full",
							state?.outputOpen ? "bg-emerald-500 shadow-[0_0_8px_#34d399]" : "bg-muted-foreground",
						)}
					/>
				</div>
				<Button
					className={cn("mt-4 w-full font-bold", confirmToggle && "animate-pulse")}
					variant={confirmToggle ? "destructive" : state?.outputOpen ? "outline" : "default"}
					onClick={onToggleOutput}
				>
					{confirmToggle ? "Tap again to confirm" : state?.outputOpen ? "Stop presentation" : "Start presentation"}
				</Button>
			</div>

			{/* Current screen mode */}
			{state?.screenMode && (
				<div className="rounded-xl border border-border bg-card p-4">
					<p className="mb-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
						Screen mode
					</p>
					<div className="flex items-center gap-2">
						{state.screenMode.kind === "black" && (
							<>
								<EyeOff className="size-4 text-muted-foreground" />
								<span className="text-[13px] font-semibold">Black screen</span>
							</>
						)}
						{state.screenMode.kind === "logo" && (
							<>
								<ImageIcon className="size-4 text-primary" />
								<span className="text-[13px] font-semibold">Showing logo</span>
							</>
						)}
						{state.screenMode.kind === "image" && (
							<>
								<ImageIcon className="size-4 text-primary" />
								<span className="text-[13px] font-semibold">
									{state.images.find((i) => i.id === (state.screenMode as { id: string }).id)?.name ??
										"Image"}
								</span>
							</>
						)}
						<button
							type="button"
							onClick={() => send({ type: "black" })}
							className="ml-auto text-[11px] text-muted-foreground underline"
						>
							Clear
						</button>
					</div>
				</div>
			)}

			{/* Network info */}
			<div className="rounded-xl border border-border bg-card p-4">
				<div className="flex items-center gap-2.5">
					{connected ? (
						<Wifi className="size-4 text-primary" />
					) : (
						<WifiOff className="size-4 text-destructive" />
					)}
					<div>
						<p className="text-[13px] font-semibold">Network connection</p>
						<p className="mt-0.5 text-[11px] text-muted-foreground">
							Accessible from any device on the same Wi-Fi network
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
