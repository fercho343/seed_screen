export interface ServiceSlide {
	id: string;
	label: string;
	text: string;
	/** Small heading shown above the text on the output (e.g. a Bible reference). */
	reference?: string;
	/** Per-language translations of `text`, keyed by ISO 639-1 code. */
	translations?: Record<string, string>;
}

export interface ServiceItem {
	scheduleId: string;
	sourceId: string;
	type: "song" | "bible";
	title: string;
	subtitle?: string;
	slides: ServiceSlide[];
	/** Original language of the source content. */
	language?: string;
	/** Language to display for the whole item (null/undefined = original). */
	displayLanguage?: string | null;
	/**
	 * Per-slide language overrides keyed by slide id.
	 * `null` forces the original; a code forces that translation;
	 * a missing key means "follow the item's displayLanguage".
	 */
	slideLanguageOverrides?: Record<string, string | null>;
}

/** Resolve the text to show for a slide given the active language settings. */
export function getSlideDisplayText(
	slide: ServiceSlide,
	displayLanguage?: string | null,
	overrides?: Record<string, string | null>,
): string {
	const hasOverride = overrides != null && slide.id in overrides;
	const lang = hasOverride ? overrides[slide.id] : displayLanguage;
	if (!lang) return slide.text;
	return slide.translations?.[lang]?.trim() || slide.text;
}

/** Language codes (besides the original) that have at least one translation. */
export function itemTranslationLanguages(item: ServiceItem): string[] {
	const langs = new Set<string>();
	for (const slide of item.slides) {
		for (const [code, text] of Object.entries(slide.translations ?? {})) {
			if (text?.trim()) langs.add(code);
		}
	}
	return [...langs];
}
