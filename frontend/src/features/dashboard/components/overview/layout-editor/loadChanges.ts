import { CustomLayout } from "../OverviewTypes";

export const loadChanges = (
	category: string
): {
	layout: CustomLayout[];
	tabs: { value: string; label: string; widgets: string[] }[];
} => {
	const overviewData = JSON.parse(localStorage.getItem("OverviewLayout") || "{}");

	return {
		layout: overviewData[category]?.layout || [],
		tabs: overviewData[category]?.tabs || [],
	};
};
