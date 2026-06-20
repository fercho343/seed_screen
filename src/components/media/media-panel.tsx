import { Clapperboard, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { MediaRecord } from "../../../electron/electron-env";
import { Button } from "@/components/ui/button";
import type { ServiceItem } from "@/lib/service-types";
import { toFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";

interface MediaPanelProps {
	service: ServiceItem[];
	onAddToService: (item: Omit<ServiceItem, "scheduleId">) => void;
}

export function MediaPanel({ service, onAddToService }: MediaPanelProps) {
	const [media, setMedia] = useState<MediaRecord[]>([]);
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		window.electronAPI.mediaGetAll().then(setMedia);
	}, []);

	const isInService = (id: number) =>
		service.some(
			(item) => (item.type === "image" || item.type === "video") && item.sourceId === String(id),
		);

	const handleAdd = async () => {
		setBusy(true);
		const list = await window.electronAPI.mediaAdd();
		setMedia(list);
		setBusy(false);
	};

	const handleDelete = async (id: number) => {
		const list = await window.electronAPI.mediaDelete(id);
		setMedia(list);
	};

	const addToService = (item: MediaRecord) => {
		const url = toFileUrl(item.filePath);
		onAddToService({
			sourceId: String(item.id),
			type: item.type,
			title: item.title,
			slides: [{ id: crypto.randomUUID(), label: item.title, text: item.title, mediaUrl: url }],
		});
	};

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<div className="flex items-center gap-1.5 px-2.5 py-2.5">
				<span className="flex-1 text-[10px] font-semibold uppercase tracking-widest text-text-3">
					{media.length} file{media.length === 1 ? "" : "s"}
				</span>
				<Button
					size="icon-sm"
					variant="outline"
					title="Add images or videos"
					disabled={busy}
					onClick={handleAdd}
					className="shrink-0 bg-card"
				>
					<Plus className="size-3.5" />
				</Button>
			</div>

			<div className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-2.5 pb-2.5">
				{media.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-1 px-4 py-8 text-center">
						<ImageIcon className="size-7 text-text-4" />
						<p className="text-xs font-medium text-text-3">No media yet</p>
						<p className="text-[11px] text-text-4">Add images or videos with the + button above</p>
					</div>
				) : (
					media.map((item) => {
						const inService = isInService(item.id);
						return (
							<div
								key={item.id}
								className="flex items-center gap-2.5 rounded-md border border-border bg-input p-1.5"
							>
								<div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-card">
									{item.type === "image" ? (
										<img
											src={toFileUrl(item.filePath)}
											alt={item.title}
											className="h-full w-full object-cover"
										/>
									) : (
										<Clapperboard className="size-4 text-text-3" />
									)}
								</div>
								<div className="min-w-0 flex-1">
									<div className="truncate text-[11px] font-medium text-foreground">{item.title}</div>
									<div className="text-[10px] text-text-3">
										{item.type === "image" ? "Image" : "Video"}
									</div>
								</div>
								<button
									type="button"
									onClick={() => addToService(item)}
									className={cn(
										"shrink-0 rounded-md px-2 py-1 text-[10px] font-bold transition-colors",
										inService
											? "bg-emerald-500/15 text-emerald-400"
											: "bg-primary/15 text-primary hover:bg-primary/25",
									)}
								>
									{inService ? "Added" : "+ Add"}
								</button>
								<button
									type="button"
									onClick={() => handleDelete(item.id)}
									className="shrink-0 text-text-3 hover:text-red-400"
								>
									<Trash2 className="size-3.5" />
								</button>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}
