import { Badge } from "@/components/ui/badge";

interface PreviewCardProps {
	badge: string;
}

export function PreviewCard({ badge }: PreviewCardProps) {
	return (
		<div className="relative aspect-video w-full overflow-hidden rounded-lg bg-linear-to-br from-[#0d2d2a] via-[#1a1a3a] to-[#2a0d3a]">
			<Badge className="absolute left-2 top-2 border-0 bg-black/50 text-[10px] text-white backdrop-blur-sm rounded">
				{badge}
			</Badge>
		</div>
	);
}
