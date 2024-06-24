"use client";

import ContentsTitle from "@/features/dashboard/components/ContentsTitle";
import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import ToggleEditMode from "./ToggleEditMode";
import { useTabs, TabsManager } from "./tabs/TabsManager";
import { OverviewSectionProps, CustomLayout } from "./OverviewTypes";
import { cancelChanges, saveChanges } from "./layout-editor/utils/actionButtonImports";
import { isEqual } from "lodash";

export default function OverviewSection({
	title,
	description,
	layoutsTabs,
	addons,
	enableEditButtons = true,
	category,
}: OverviewSectionProps) {
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedWidgetKey, setSelectedWidgetKey] = useState<string | null>(null);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	const {
		tabs,
		setTabs,
		selectedTabValue,
		setSelectedTabValue,
		addNewTabHandler,
		deleteTabHandler,
		editTabNameHandler,
		layout,
		setLayout,
		initialLayout,
		setInitialLayout,
		getWidgetsForTab,
		maxTabsReached,
	} = useTabs(layoutsTabs, category);

	const handleSaveChanges = () => {
		saveChanges(category, layout, tabs, setIsEditMode);
		setInitialLayout(layout);
	};

	const handleCancelChanges = () => {
		cancelChanges(initialLayout, setLayout, setIsEditMode);
		setHasUnsavedChanges(false);
	};

	useEffect(() => {
		const changesDetected = !areLayoutsEqual(layout, initialLayout);
		setHasUnsavedChanges(changesDetected);
	}, [layout, initialLayout]);

	const areLayoutsEqual = (layout1: CustomLayout[], layout2: CustomLayout[]): boolean => {
		if (layout1.length !== layout2.length) {
			return false;
		}

		for (let i = 0; i < layout1.length; i++) {
			if (!isEqual(layout1[i], layout2[i])) {
				return false;
			}
		}

		return true;
	};

	return (
		<ToastProvider>
			<div className="flex-col md:flex">
				<ContentsTitle
					title={title}
					description={description}
					addons={
						<TooltipProvider delayDuration={1}>
							<div className="flex items-center space-x-3">
								{enableEditButtons && (
									<ToggleEditMode
										isEditMode={isEditMode}
										setIsEditMode={setIsEditMode}
										handleSaveChanges={handleSaveChanges}
										handleCancelChanges={handleCancelChanges}
										hasUnsavedChanges={hasUnsavedChanges}
										initialLayout={initialLayout}
										layout={layout}
										setLayout={setLayout}
										selectedWidgetKey={selectedWidgetKey}
										setSelectedWidgetKey={setSelectedWidgetKey}
										addNewTab={addNewTabHandler}
										maxTabsReached={maxTabsReached}
										tabs={tabs}
										setTabs={setTabs}
										selectedTabValue={selectedTabValue}
										setSelectedTabValue={setSelectedTabValue}
										editTabName={editTabNameHandler}
									/>
								)}
								{addons}
							</div>
						</TooltipProvider>
					}
				/>
				<TabsManager
					isEditMode={isEditMode}
					tabs={tabs}
					setTabs={setTabs}
					selectedTabValue={selectedTabValue}
					setSelectedTabValue={setSelectedTabValue}
					layout={layout}
					setLayout={setLayout}
					initialLayout={initialLayout}
					selectedWidgetKey={selectedWidgetKey}
					setSelectedWidgetKey={setSelectedWidgetKey}
					layoutsTabs={layoutsTabs}
					getWidgetsForTab={getWidgetsForTab}
				/>
				<ToastViewport />
			</div>
		</ToastProvider>
	);
}
