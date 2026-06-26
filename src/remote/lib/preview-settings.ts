import type { SlideBackground, SlideSettings } from "@/lib/slide-settings";

export function settingsFor(background: SlideBackground): SlideSettings {
	return {
		fontSize: 48,
		bold: true,
		italic: false,
		textAlign: "center",
		animated: false,
		background,
	};
}
