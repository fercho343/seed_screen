export interface ServiceSlide {
	id: string;
	label: string;
	text: string;
}

export interface ServiceItem {
	scheduleId: string;
	sourceId: string;
	type: "song" | "bible";
	title: string;
	subtitle?: string;
	slides: ServiceSlide[];
}
