import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import WidgetManager from "../widget/WidgetManager";
import { CustomLayout, TabsManagerProps } from "../OverviewTypes";

export const TabsManager: React.FC<TabsManagerProps> = ({
	isEditMode,
	tabs,
	setTabs,
	selectedTabValue,
	setSelectedTabValue,
	layout,
	setLayout,
	initialLayout,
	selectedWidgetKey,
	setSelectedWidgetKey,
	layoutsTabs,
	getWidgetsForTab,
}) => {
	const tabWidth = 200;
	const tabsContainerWidth = tabs.length * tabWidth;
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	const handleLayoutChangeWrapper: React.Dispatch<React.SetStateAction<CustomLayout[]>> = (
		newLayout
	) => {
		if (typeof newLayout === "function") {
			setLayout((prevLayout) => handleLayoutChange(newLayout(prevLayout)));
		} else {
			setLayout(handleLayoutChange(newLayout));
		}
	};

	const handleLayoutChange = (newLayout: CustomLayout[]) => {
		setHasUnsavedChanges(true);
		return newLayout;
	};

	return (
		<Tabs
			value={selectedTabValue || undefined}
			onValueChange={(value) => setSelectedTabValue(value)}
		>
			{tabs.length > 1 && (
				<TabsList
					className="flex items-center"
					style={{ width: `${tabsContainerWidth}px` }}
				>
					{tabs.map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							style={{ width: `${tabWidth}px` }}
							className={
								isEditMode && selectedTabValue === tab.value
									? "border-dashed rounded-md border-2 border-red-500"
									: ""
							}
							onClick={() => setSelectedTabValue(tab.value)}
						>
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>
			)}
			{tabs.map((tab) => (
				<TabsContent key={tab.value} value={tab.value}>
					<WidgetManager
						isDraggable={isEditMode}
						layout={layout}
						setLayout={handleLayoutChangeWrapper}
						initialLayout={initialLayout}
						selectedWidgetKey={selectedWidgetKey}
						setSelectedWidgetKey={setSelectedWidgetKey}
						isEditMode={isEditMode}
						widgets={
							tab.value === "General" ? layoutsTabs : getWidgetsForTab(tab.value)
						}
					/>
				</TabsContent>
			))}
		</Tabs>
	);
};

export { useTabs } from "./utils/useTabs";
