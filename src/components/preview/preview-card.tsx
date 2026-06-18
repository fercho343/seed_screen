import { cn } from "@/lib/utils";

interface PreviewCardProps {
	label: string;
	text?: string;
	isLive?: boolean;
	isEmpty?: boolean;
	animated?: boolean;
}

export function PreviewCard({
	label,
	text,
	isLive = false,
	isEmpty = true,
	animated = true,
}: PreviewCardProps) {
	return (
		<div
			className={cn(
				"relative aspect-video w-full overflow-hidden rounded-lg border-2 bg-[linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)]",
				isLive ? "border-emerald-500" : "border-border",
			)}
		>
			{animated && (
				<>
					<div className="absolute -top-[20%] -left-[15%] size-[70%] animate-[blob-1_9s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,#4f46e5,#7c3aed)] opacity-60 blur-xl mix-blend-screen" />
					<div className="absolute -right-[15%] -bottom-[18%] size-[60%] animate-[blob-2_11s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,#7c3aed,#c026d3)] opacity-55 blur-xl mix-blend-screen" />
					<div className="absolute top-[20%] left-[20%] size-[50%] animate-[blob-3_13s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,#0d9488,#0369a1)] opacity-45 blur-lg mix-blend-screen" />
				</>
			)}

			<div className="absolute inset-0 bg-black/30" />

			{isEmpty ? (
				<div className="absolute inset-0 flex items-center justify-center text-[11px] text-text-4">
					—
				</div>
			) : (
				<div className="absolute inset-0 flex items-center justify-center p-[8%] text-center">
					<p className="relative z-10 text-[13px] leading-snug font-semibold whitespace-pre-wrap text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
						{text}
					</p>
				</div>
			)}

			<div
				className={cn(
					"absolute top-1.5 left-1.5 rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase",
					isLive ? "bg-emerald-600 text-white" : "bg-black/70 text-muted-foreground",
				)}
			>
				{isLive ? `● ${label}` : label}
			</div>
		</div>
	);
}
