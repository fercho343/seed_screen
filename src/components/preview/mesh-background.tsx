import type { SlideBackground } from "@/lib/slide-settings";
import { meshBlobs } from "@/lib/mesh";
import { cn } from "@/lib/utils";

const BLOB_LAYOUT = [
	"-top-[20%] -left-[15%] size-[75%] animate-[blob-1_9s_ease-in-out_infinite] opacity-70",
	"-right-[15%] -bottom-[18%] size-[65%] animate-[blob-2_11s_ease-in-out_infinite] opacity-65",
	"top-[15%] left-[25%] size-[55%] animate-[blob-3_13s_ease-in-out_infinite] opacity-55",
];

interface MeshBackgroundProps {
	background: SlideBackground;
	animated: boolean;
	/** Larger blur reads better at full-screen output sizes than in the tiny preview card. */
	variant?: "preview" | "output";
}

export function MeshBackground({ background, animated, variant = "preview" }: MeshBackgroundProps) {
	const blur = variant === "output" ? "blur-[120px]" : "blur-2xl";
	const showBlobs = animated && background.type === "gradient";
	const blobs = meshBlobs(background);

	return (
		<div
			className="absolute inset-0 overflow-hidden"
			style={
				background.type === "color"
					? { background: background.value }
					: { backgroundImage: background.value }
			}
		>
			{showBlobs &&
				blobs.map((blob, i) => (
					<div
						key={i}
						className={cn("absolute rounded-full mix-blend-screen", blur, BLOB_LAYOUT[i])}
						style={{ background: `radial-gradient(circle, ${blob.from}, ${blob.to})` }}
					/>
				))}
			<div className="absolute inset-0 bg-black/30" />
		</div>
	);
}
