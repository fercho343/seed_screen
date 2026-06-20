import { useEffect, useState } from "react";
import { MeshBackground } from "@/components/preview/mesh-background";
import { DEFAULT_SLIDE_SETTINGS, type SlideSettings } from "@/lib/slide-settings";

interface LiveSlide {
	text: string;
	title?: string;
	settings: SlideSettings;
}

type OutputContent = { kind: "slide"; slide: LiveSlide } | { kind: "image"; dataUrl: string } | null;

export function OutputView() {
	const [content, setContent] = useState<OutputContent>(null);

	useEffect(() => {
		window.electronAPI.onShowSlide((s) => setContent({ kind: "slide", slide: s }));
		window.electronAPI.onGoBlack(() => setContent(null));
		window.electronAPI.onShowImage((dataUrl) => setContent({ kind: "image", dataUrl }));
	}, []);

	if (!content) {
		return <div className="h-screen w-screen bg-black" />;
	}

	if (content.kind === "image") {
		return (
			<div className="flex h-screen w-screen items-center justify-center bg-black">
				<img src={content.dataUrl} alt="" className="h-full w-full object-contain" />
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
