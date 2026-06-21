import { useEffect, useState } from "react";
import { MeshBackground } from "@/components/preview/mesh-background";
import { DEFAULT_SLIDE_SETTINGS, type SlideSettings } from "@/lib/slide-settings";

interface LiveSlide {
	text: string;
	title?: string;
	settings: SlideSettings;
}

type OutputContent =
	| { kind: "slide"; slide: LiveSlide }
	| { kind: "image"; dataUrl: string }
	| { kind: "video"; fileUrl: string }
	| { kind: "youtube"; videoId: string }
	| null;

export function OutputView() {
	const [content, setContent] = useState<OutputContent>(null);

	useEffect(() => {
		window.electronAPI.onShowSlide((s) => setContent({ kind: "slide", slide: s }));
		window.electronAPI.onGoBlack(() => setContent(null));
		window.electronAPI.onShowImage((dataUrl) => setContent({ kind: "image", dataUrl }));
		window.electronAPI.onShowVideo((fileUrl) => setContent({ kind: "video", fileUrl }));
		window.electronAPI.onShowYoutube((videoId) => setContent({ kind: "youtube", videoId }));
	}, []);

	if (!content) {
		return <div className="h-screen w-screen bg-black" />;
	}

	if (content.kind === "youtube") {
		const src = `https://www.youtube-nocookie.com/embed/${content.videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&playsinline=1`;
		return (
			<div className="flex h-screen w-screen items-center justify-center bg-black">
				<iframe
					key={content.videoId}
					src={src}
					title="YouTube"
					allow="autoplay; encrypted-media; fullscreen"
					allowFullScreen
					className="h-full w-full border-0"
				/>
			</div>
		);
	}

	if (content.kind === "image") {
		return (
			<div className="flex h-screen w-screen items-center justify-center bg-black">
				<img src={content.dataUrl} alt="" className="h-full w-full object-contain" />
			</div>
		);
	}

	if (content.kind === "video") {
		return (
			<div className="flex h-screen w-screen items-center justify-center bg-black">
				{/* biome-ignore lint/a11y/useMediaCaption: presentation videos rarely ship captions */}
				<video
					key={content.fileUrl}
					src={content.fileUrl}
					autoPlay
					loop
					className="h-full w-full object-contain"
				/>
			</div>
		);
	}

	const { slide } = content;
	const settings = slide.settings ?? DEFAULT_SLIDE_SETTINGS;

	return (
		<div className="relative flex h-screen w-screen items-center justify-center overflow-hidden p-20">
			<MeshBackground background={settings.background} animated={settings.animated} variant="output" />
			<div className="relative z-10" style={{ textAlign: settings.textAlign }}>
				{slide.title && (
					<p className="mb-6 text-3xl font-bold tracking-widest text-white/70 uppercase [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
						{slide.title}
					</p>
				)}
				<p
					className="whitespace-pre-wrap text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.9)]"
					style={{
						fontSize: settings.fontSize,
						fontWeight: settings.bold ? 700 : 600,
						fontStyle: settings.italic ? "italic" : "normal",
						lineHeight: 1.35,
					}}
				>
					{slide.text}
				</p>
			</div>
		</div>
	);
}
