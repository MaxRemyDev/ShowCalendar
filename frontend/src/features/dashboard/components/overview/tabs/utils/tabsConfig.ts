let tabCounter = 8;

export const initialTabs = [
	{ value: "General", label: "General", widgets: [] },
	{ value: "tabs2", label: "tabs 2", widgets: ["widget-2"] },
];

export function addNewTab(tabs: any[], name: string) {
	const newTab = { value: `tabs${tabCounter}`, label: name, widgets: [] };
	tabCounter += 1;
	return [...tabs, newTab];
}
