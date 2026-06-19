import { MeshBackground } from "@/components/preview/mesh-background";
import type { SlideSettings } from "@/lib/slide-settings";
import { cn } from "@/lib/utils";

interface PreviewCardProps {
	label: string;
	text?: string;
	title?: string;
	isLive?: boolean;
	isEmpty?: boolean;
	settings: SlideSettings;
}

export function PreviewCard({
	label,
	text,
	title,
	isLive = false,
	isEmpty = true,
	settings,
}: PreviewCardProps) {
	const { background, animated, fontSize, bold, italic, textAlign } = settings;
	// Scaled down so the preview reflects the real on-screen proportions instead
	// of rendering at the actual presentation font size inside a tiny card.
	const previewFontSize = Math.max(8, fontSize * 0.18);

	return (
		<div
			className={cn(
				"relative aspect-video w-full overflow-hidden rounded-lg border-2",
				isLive ? "border-emerald-500" : "border-border",
			)}
		>
			<MeshBackground background={background} animated={animated} variant="preview" />

			{isEmpty ? (
				<div className="absolute inset-0 flex items-center justify-center text-[11px] text-text-4">
					—
				</div>
			) : (
				<div className="absolute inset-0 flex items-center justify-center p-[8%]" style={{ textAlign }}>
					<div className="relative z-10">
						{title && (
							<p className="mb-1.5 text-[8px] font-bold tracking-widest text-white/70 uppercase [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
								{title}
							</p>
						)}
						<p
							className="whitespace-pre-wrap text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]"
							style={{
								fontSize: previewFontSize,
								fontWeight: bold ? 700 : 600,
								fontStyle: italic ? "italic" : "normal",
								lineHeight: 1.35,
							}}
						>
							{text}
						</p>
					</div>
				</div>
			)}

			<div
				className={cn(
					"absolute top-1.5 left-1.5 z-10 rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase",
					isLive ? "bg-emerald-600 text-white" : "bg-black/70 text-muted-foreground",
				)}
			>
				{isLive ? `● ${label}` : label}
			</div>
		</div>
	);
}
