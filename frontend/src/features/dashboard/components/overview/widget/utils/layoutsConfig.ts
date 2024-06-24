import { CustomLayout } from "../../OverviewTypes";
import { defaultLayout } from "./list-widgets";

export const secondaryLayout: CustomLayout[] = [
	{ i: "widget-1", x: 9, y: 4.65, w: 3, h: 1.55 },
	{ i: "widget-2", x: 9, y: 1.55, w: 3, h: 1.55 },
	{ i: "widget-3", x: 9, y: 3.1, w: 3, h: 1.55 },
	{ i: "widget-4", x: 9, y: 0, w: 3, h: 1.55 },
	{ i: "widget-5", x: 0, y: 4.5, w: 9, h: 4.5 },
	{ i: "widget-6", x: 0, y: 0, w: 9, h: 4.5 },
];

export const smallScreenLayout: CustomLayout[] = [
	{ i: "widget-1", x: 0, y: 0, w: 3, h: 1.55 },
	{ i: "widget-2", x: 3, y: 0, w: 3, h: 1.55 },
	{ i: "widget-3", x: 0, y: 1.55, w: 3, h: 1.55 },
	{ i: "widget-4", x: 3, y: 1.55, w: 3, h: 1.55 },
	{ i: "widget-5", x: 0, y: 3.1, w: 6, h: 4.5 },
	{ i: "widget-6", x: 0, y: 7.6, w: 6, h: 4.5 },
];

export const largeScreenLayout: CustomLayout[] = [
	{ i: "widget-1", x: 0, y: 0, w: 3, h: 1.55 },
	{ i: "widget-2", x: 3, y: 0, w: 3, h: 1.55 },
	{ i: "widget-3", x: 6, y: 0, w: 3, h: 1.55 },
	{ i: "widget-4", x: 9, y: 0, w: 3, h: 1.55 },
	{ i: "widget-5", x: 0, y: 1.55, w: 12, h: 4.5 },
	{ i: "widget-6", x: 0, y: 6.05, w: 12, h: 4.5 },
];

export const layouts = {
	default: defaultLayout,
	secondary: secondaryLayout,
	small: smallScreenLayout,
	large: largeScreenLayout,
};
