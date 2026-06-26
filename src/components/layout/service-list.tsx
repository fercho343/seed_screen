import {
	BookOpen,
	Clapperboard,
	Clipboard,
	GripVertical,
	Image,
	Languages,
	Music,
	SquarePlay,
	X,
} from "lucide-react";
import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { LANG_NAMES } from "@/lib/languages";
import {
	getSlideDisplayText,
	itemTranslationLanguages,
	type ServiceItem,
	type ServiceSlide,
} from "@/lib/service-types";
import { cn } from "@/lib/utils";

const ORIGINAL = "__original__";
const FOLLOW_SONG = "__default__";

interface SlideChipProps {
	slide: ServiceSlide;
	displayText: string;
	languages: string[];
	originalLang?: string;
	overrideValue: string;
	isSelected: boolean;
	isLive: boolean;
	onClick: () => void;
	onDoubleClick: () => void;
	onLanguageChange: (value: string) => void;
}

function SlideChip({
	slide,
	displayText,
	languages,
	originalLang,
	overrideValue,
	isSelected,
	isLive,
	onClick,
	onDoubleClick,
	onLanguageChange,
}: SlideChipProps) {
	return (
		<div
			role="button"
			tabIndex={0}
			onClick={onClick}
			onDoubleClick={onDoubleClick}
			className={cn(
				"flex min-h-[72px] cursor-pointer flex-col gap-1.5 rounded-lg border-2 p-2.5 transition-colors",
				isLive
					? "border-emerald-600 bg-emerald-950/40"
					: isSelected
						? "border-primary bg-primary/10"
						: "border-border bg-input hover:border-text-3",
			)}
		>
			<div className="flex items-center justify-between gap-1">
				<span
					className={cn(
						"rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase",
						isLive ? "bg-emerald-600 text-white" : "bg-black/30 text-text-3",
					)}
				>
					{isLive ? "● LIVE" : slide.label}
				</span>
				{isSelected && languages.length > 0 && (
					<div onClick={(e) => e.stopPropagation()} onDoubleClick={(e) => e.stopPropagation()}>
						<Select value={overrideValue} onValueChange={(v) => v && onLanguageChange(v)}>
							<SelectTrigger
								size="sm"
								className="h-5 gap-1 border-border bg-black/30 px-1.5 text-[9px]"
							>
								<SelectValue>
									{(v: string) =>
										v === FOLLOW_SONG ? "AUTO" : v === ORIGINAL ? "ORIG" : v.toUpperCase()
									}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={FOLLOW_SONG}>Follow song</SelectItem>
								<SelectItem value={ORIGINAL}>
									{originalLang ? LANG_NAMES[originalLang] ?? originalLang : "Original"}
								</SelectItem>
								{languages.map((code) => (
									<SelectItem key={code} value={code}>
										{LANG_NAMES[code] ?? code}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
			</div>
			<p className="line-clamp-3 text-[11px] leading-snug text-foreground/90">{displayText}</p>
		</div>
	);
}

interface ServiceListProps {
	items: ServiceItem[];
	selectedItemId: string | null;
	onSelectItem: (scheduleId: string) => void;
	onRemoveItem: (scheduleId: string) => void;
	selectedSlideId: string | null;
	liveSlideId: string | null;
	onSlideClick: (item: ServiceItem, slide: ServiceSlide) => void;
	onSlideDoubleClick: (item: ServiceItem, slide: ServiceSlide) => void;
	onItemLanguageChange: (scheduleId: string, lang: string | null) => void;
	onSlideLanguageChange: (scheduleId: string, slideId: string, value: string) => void;
	onReorderItems: (fromIndex: number, toIndex: number) => void;
}

export function ServiceList({
	items,
	selectedItemId,
	onSelectItem,
	onRemoveItem,
	selectedSlideId,
	liveSlideId,
	onSlideClick,
	onSlideDoubleClick,
	onItemLanguageChange,
	onSlideLanguageChange,
	onReorderItems,
}: ServiceListProps) {
	const selectedItem = items.find((item) => item.scheduleId === selectedItemId);
	const [dragIndex, setDragIndex] = useState<number | null>(null);
	const [overIndex, setOverIndex] = useState<number | null>(null);

	if (items.length === 0) {
		return (
			<main className="flex flex-1 flex-col overflow-hidden rounded-lg bg-card">
				<div className="flex items-center justify-between border-b border-border px-4 py-2.5">
					<span className="text-[11px] font-semibold uppercase tracking-widest text-text-3">
						Service List
					</span>
				</div>
				<div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
					<div className="flex size-14 items-center justify-center rounded-xl bg-muted">
						<Clipboard className="size-7 text-text-3" />
					</div>
					<p className="text-[13px] font-semibold text-foreground">Empty list</p>
					<p className="text-[11px] text-text-3">Add songs from the library on the left</p>
				</div>
			</main>
		);
	}

	const languages = selectedItem ? itemTranslationLanguages(selectedItem) : [];

	return (
		<main className="flex flex-1 overflow-hidden rounded-lg bg-card">
			<div className="flex w-52 shrink-0 flex-col border-r border-border">
				<div className="flex items-center justify-between border-b border-border px-3 py-2.5">
					<span className="text-[11px] font-semibold uppercase tracking-widest text-text-3">
						Service
					</span>
					<span className="text-[11px] text-text-3">{items.length}</span>
				</div>
				<div className="flex-1 overflow-y-auto p-1.5">
					{items.map((item, index) => (
						<div
							key={item.scheduleId}
							role="button"
							tabIndex={0}
							draggable
							onClick={() => onSelectItem(item.scheduleId)}
							onDragStart={() => setDragIndex(index)}
							onDragOver={(e) => {
								e.preventDefault();
								if (index !== overIndex) setOverIndex(index);
							}}
							onDragEnd={() => {
								setDragIndex(null);
								setOverIndex(null);
							}}
							onDrop={(e) => {
								e.preventDefault();
								if (dragIndex !== null && dragIndex !== index) onReorderItems(dragIndex, index);
								setDragIndex(null);
								setOverIndex(null);
							}}
							className={cn(
								"group flex items-center gap-2 rounded-md px-2 py-2 cursor-pointer",
								selectedItemId === item.scheduleId ? "bg-hover" : "hover:bg-hover",
								overIndex === index && dragIndex !== null && dragIndex !== index
									? "border-t-2 border-primary"
									: "",
								dragIndex === index ? "opacity-50" : "",
							)}
						>
							<GripVertical className="size-3.5 shrink-0 cursor-grab text-text-3 opacity-0 group-hover:opacity-100" />
							<div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent-2 text-[10px] font-bold text-white">
								{index + 1}
							</div>
							{item.type === "bible" ? (
								<BookOpen className="size-3.5 shrink-0 text-text-3" />
							) : item.type === "image" ? (
								<Image className="size-3.5 shrink-0 text-text-3" />
							) : item.type === "video" ? (
								<Clapperboard className="size-3.5 shrink-0 text-text-3" />
							) : item.type === "youtube" ? (
								<SquarePlay className="size-3.5 shrink-0 text-red-500" />
							) : (
								<Music className="size-3.5 shrink-0 text-text-3" />
							)}
							<div className="min-w-0 flex-1">
								<div className="truncate text-[11px] font-medium text-foreground">
									{item.title}
								</div>
							</div>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onRemoveItem(item.scheduleId);
								}}
								className="shrink-0 text-text-3 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
							>
								<X className="size-3.5" />
							</button>
						</div>
					))}
				</div>
			</div>

			<div className="flex flex-1 flex-col overflow-hidden">
				{selectedItem ? (
					<>
						<div className="flex items-center gap-2.5 border-b border-border px-3.5 py-2.5">
							<div className="size-1.5 shrink-0 rounded-full bg-primary" />
							<span className="text-xs font-bold text-foreground">{selectedItem.title}</span>
							{selectedItem.subtitle && (
								<span className="text-[11px] text-text-3">{selectedItem.subtitle}</span>
							)}

							{languages.length > 0 && (
								<div className="ml-auto flex items-center gap-1.5">
									<Languages className="size-3.5 text-text-3" />
									<Select
										value={selectedItem.displayLanguage ?? ORIGINAL}
										onValueChange={(v) =>
											v && onItemLanguageChange(selectedItem.scheduleId, v === ORIGINAL ? null : v)
										}
									>
										<SelectTrigger size="sm" className="h-7 border-border bg-input text-[11px]">
											<SelectValue>
												{(v: string) =>
													v === ORIGINAL
														? selectedItem.language
															? LANG_NAMES[selectedItem.language] ?? selectedItem.language
															: "Original"
														: LANG_NAMES[v] ?? v
												}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={ORIGINAL}>
												{selectedItem.language
													? LANG_NAMES[selectedItem.language] ?? selectedItem.language
													: "Original"}
											</SelectItem>
											{languages.map((code) => (
												<SelectItem key={code} value={code}>
													{LANG_NAMES[code] ?? code}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							)}

							<span
								className={cn(
									"text-[10px] text-text-3",
									languages.length > 0 ? "" : "ml-auto",
								)}
							>
								Double-click to project · ← → to navigate
							</span>
						</div>
						<div
							className="flex-1 overflow-y-auto p-3"
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
								gap: 8,
								alignContent: "start",
							}}
						>
							{selectedItem.slides.map((slide) => {
								const override = selectedItem.slideLanguageOverrides?.[slide.id];
								const overrideValue =
									selectedItem.slideLanguageOverrides &&
									slide.id in selectedItem.slideLanguageOverrides
										? override === null
											? ORIGINAL
											: (override as string)
										: FOLLOW_SONG;
								return (
									<SlideChip
										key={slide.id}
										slide={slide}
										displayText={getSlideDisplayText(
											slide,
											selectedItem.displayLanguage,
											selectedItem.slideLanguageOverrides,
										)}
										languages={languages}
										originalLang={selectedItem.language}
										overrideValue={overrideValue}
										isSelected={selectedSlideId === slide.id}
										isLive={liveSlideId === slide.id}
										onClick={() => onSlideClick(selectedItem, slide)}
										onDoubleClick={() => onSlideDoubleClick(selectedItem, slide)}
										onLanguageChange={(value) =>
											onSlideLanguageChange(selectedItem.scheduleId, slide.id, value)
										}
									/>
								);
							})}
						</div>
					</>
				) : (
					<div className="flex flex-1 items-center justify-center text-xs text-text-3">
						Select an item from the list
					</div>
				)}
			</div>
		</main>
	);
}
