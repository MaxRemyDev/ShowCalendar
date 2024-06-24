import { useState, useEffect } from "react";
import { loadChanges } from "../../layout-editor/loadChanges";
import { useWidgetManager } from "../../widget/WidgetManagerContext";
import { initialTabs, addNewTab } from "./tabsConfig";
import { CustomLayout, Widget } from "../../OverviewTypes";

const MAX_TABS = 7;

export function useTabs(layoutsTabs: Widget[], category: string) {
	const [tabs, setTabs] =
		useState<{ value: string; label: string; widgets: string[] }[]>(initialTabs);
	const [selectedTabValue, setSelectedTabValue] = useState<string | null>("General");

	const { layout, setLayout, calculateWidgetDimensions } = useWidgetManager();

	const initialLayout: CustomLayout[] = layoutsTabs.map((widget) => {
		const dimensions = calculateWidgetDimensions(widget);

		return {
			i: widget.key,
			x: widget.dataGrid?.x ?? 0,
			y: widget.dataGrid?.y ?? 0,
			w: widget.dataGrid?.w ?? dimensions.w,
			h: widget.dataGrid?.h ?? dimensions.h,
			minW: widget.dataGrid?.minW ?? dimensions.minW,
			minH: widget.dataGrid?.minH ?? dimensions.minH,
		};
	});

	const [currentInitialLayout, setCurrentInitialLayout] = useState<CustomLayout[]>(initialLayout);

	useEffect(() => {
		const { layout: savedLayout, tabs: savedTabs } = loadChanges(category);
		if (savedLayout.length) {
			setLayout(savedLayout);
			setCurrentInitialLayout(savedLayout);
		}
		if (savedTabs.length) {
			setTabs(savedTabs);
		}
	}, [setLayout, category]);

	const addNewTabHandler = (name: string) => {
		if (tabs.length < MAX_TABS) {
			setTabs((prevTabs) => addNewTab(prevTabs, name));
		}
	};

	const deleteTabHandler = (tabValue: string) => {
		setTabs((prevTabs) => {
			const updatedTabs = prevTabs.filter((tab) => tab.value !== tabValue);
			if (selectedTabValue === tabValue) {
				if (updatedTabs.length > 0) {
					setSelectedTabValue(updatedTabs[0].value);
				} else {
					setSelectedTabValue("General");
				}
			}
			return updatedTabs;
		});
	};

	const editTabNameHandler = (tabValue: string, newName: string) => {
		setTabs((prevTabs) =>
			prevTabs.map((tab) => (tab.value === tabValue ? { ...tab, label: newName } : tab))
		);
	};

	useEffect(() => {
		if (!tabs.some((tab) => tab.value === selectedTabValue)) {
			setSelectedTabValue(tabs.length > 0 ? tabs[0].value : "General");
		}
	}, [tabs, selectedTabValue]);

	const getWidgetsForTab = (tabValue: string): Widget[] => {
		const tab = tabs.find((t) => t.value === tabValue);
		return tab
			? tab.widgets
					.map((key) => layoutsTabs.find((widget) => widget.key === key))
					.filter((widget): widget is Widget => widget !== undefined)
			: [];
	};

	const maxTabsReached = tabs.length >= MAX_TABS;

	return {
		tabs,
		setTabs,
		selectedTabValue,
		setSelectedTabValue,
		addNewTabHandler,
		deleteTabHandler,
		editTabNameHandler,
		layout,
		setLayout,
		initialLayout: currentInitialLayout,
		setInitialLayout: setCurrentInitialLayout,
		getWidgetsForTab,
		maxTabsReached,
	};
}
