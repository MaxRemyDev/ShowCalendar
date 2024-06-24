import { Layout } from "react-grid-layout";
import { ReactNode } from "react";

export interface CustomLayout extends Layout {
	minW?: number;
	minH?: number;
}

export interface DataGrid {
	x: number;
	y: number;
	w?: number;
	h?: number;
	minW?: number;
	minH?: number;
	maxW?: number;
	maxH?: number;
}

export interface Widget {
	title?: string;
	content?: string | number | React.ReactNode;
	icon?: React.ReactNode;
	description?: string;
	className?: string;
	customContent?: React.ReactNode;
	key: string;
	dataGrid?: DataGrid;
}

export interface WidgetCategory {
	category: string;
	widgets: Widget[];
}

export interface WidgetManagerProps {
	widgets: Widget[];
	isDraggable: boolean;
	layout: CustomLayout[];
	setLayout: React.Dispatch<React.SetStateAction<CustomLayout[]>>;
	initialLayout: CustomLayout[];
	selectedWidgetKey: string | null;
	setSelectedWidgetKey: React.Dispatch<React.SetStateAction<string | null>>;
	isEditMode: boolean;
}

export interface TabsManagerProps {
	isEditMode: boolean;
	tabs: { value: string; label: string; widgets: string[] }[];
	setTabs: React.Dispatch<
		React.SetStateAction<{ value: string; label: string; widgets: string[] }[]>
	>;
	selectedTabValue: string | null;
	setSelectedTabValue: React.Dispatch<React.SetStateAction<string | null>>;
	layout: CustomLayout[];
	setLayout: React.Dispatch<React.SetStateAction<CustomLayout[]>>;
	initialLayout: CustomLayout[];
	selectedWidgetKey: string | null;
	setSelectedWidgetKey: React.Dispatch<React.SetStateAction<string | null>>;
	layoutsTabs: Widget[];
	getWidgetsForTab: (tabValue: string) => Widget[];
}

export interface OverviewSectionProps {
	title: string;
	description: string;
	layoutsTabs: Widget[];
	addons?: ReactNode;
	enableEditButtons?: boolean;
	category: string;
}
