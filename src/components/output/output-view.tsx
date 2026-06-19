import { useEffect, useState } from "react";
import { MeshBackground } from "@/components/preview/mesh-background";
import { DEFAULT_SLIDE_SETTINGS, type SlideSettings } from "@/lib/slide-settings";

interface LiveSlide {
	text: string;
	settings: SlideSettings;
}

export function OutputView() {
	const [slide, setSlide] = useState<LiveSlide | null>(null);

	useEffect(() => {
		window.electronAPI.onShowSlide((s) => setSlide(s));
		window.electronAPI.onGoBlack(() => setSlide(null));
	}, []);

	if (!slide) {
		return <div className="h-screen w-screen bg-black" />;
	}

	const settings = slide.settings ?? DEFAULT_SLIDE_SETTINGS;

	return (
		<div className="relative flex h-screen w-screen items-center justify-center overflow-hidden p-20">
			<MeshBackground background={settings.background} animated={settings.animated} variant="output" />
			<p
				className="relative z-10 whitespace-pre-wrap text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.9)]"
				style={{
					fontSize: settings.fontSize,
					fontWeight: settings.bold ? 700 : 600,
					fontStyle: settings.italic ? "italic" : "normal",
					textAlign: settings.textAlign,
					lineHeight: 1.35,
				}}
			>
				{slide.text}
			</p>
		</div>
	);
}
