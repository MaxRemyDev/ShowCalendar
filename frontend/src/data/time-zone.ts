const timeZoneData = {
	NorthAmerica: {
		label: "North America",
		options: [
			{ value: "est", label: "Eastern Standard Time (EST)" },
			{ value: "cst", label: "Central Standard Time (CST)" },
		],
	},
	Europe: {
		label: "Europe",
		options: [
			{ value: "gmt", label: "Greenwich Mean Time (GMT)" },
			{ value: "cest", label: "Central European Summer Time (CEST)" },
		],
	},
	Africa: {
		label: "Africa",
		options: [
			{ value: "wast", label: "West Africa Summer Time (WAST)" },
			{ value: "eet", label: "Eastern European Time (EET)" },
		],
	},
};

export default timeZoneData;
