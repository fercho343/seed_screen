export interface SlideBackground {
	id: string;
	label: string;
	type: "color" | "gradient";
	value: string;
}

export interface SlideSettings {
	fontSize: number;
	bold: boolean;
	italic: boolean;
	textAlign: "left" | "center";
	animated: boolean;
	background: SlideBackground;
}

export const BACKGROUNDS: SlideBackground[] = [
	{ id: "black", label: "Black", type: "color", value: "#000000" },
	{
		id: "dark-purple",
		label: "Dark Purple",
		type: "gradient",
		value: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
	},
	{
		id: "night-blue",
		label: "Night Blue",
		type: "gradient",
		value: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
	},
	{
		id: "forest-green",
		label: "Forest Green",
		type: "gradient",
		value: "linear-gradient(135deg, #1b4332, #2d6a4f, #40916c)",
	},
	{
		id: "deep-red",
		label: "Deep Red",
		type: "gradient",
		value: "linear-gradient(135deg, #3d0000, #8b0000, #b22222)",
	},
	{
		id: "dark-gray",
		label: "Dark Gray",
		type: "gradient",
		value: "linear-gradient(160deg, #0a0a0a, #1a1a1a)",
	},
];

export const DEFAULT_SLIDE_SETTINGS: SlideSettings = {
	fontSize: 56,
	bold: true,
	italic: false,
	textAlign: "center",
	animated: true,
	background: BACKGROUNDS[2],
};
