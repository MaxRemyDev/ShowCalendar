import React, { useState } from "react";
import { CustomLayout } from "./OverviewTypes";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save, Ban, PencilOff, Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogAction,
	AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
	AddNewTabs,
	AddNewWidget,
	DeleteTab,
	DeleteWidget,
	EditTabName,
	EditWidget,
	ResetLayout,
	SelectThemeLayout,
} from "./layout-editor/utils/actionButtonImports";

interface ToggleEditModeProps {
	isEditMode: boolean;
	setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
	handleSaveChanges: () => void;
	handleCancelChanges: () => void;
	hasUnsavedChanges: boolean;
	initialLayout: CustomLayout[];
	layout: CustomLayout[];
	setLayout: React.Dispatch<React.SetStateAction<CustomLayout[]>>;
	selectedWidgetKey: string | null;
	setSelectedWidgetKey: React.Dispatch<React.SetStateAction<string | null>>;
	addNewTab: (name: string) => void;
	maxTabsReached: boolean;
	tabs: { value: string; label: string; widgets: string[] }[];
	setTabs: React.Dispatch<
		React.SetStateAction<{ value: string; label: string; widgets: string[] }[]>
	>;
	selectedTabValue: string | null;
	setSelectedTabValue: React.Dispatch<React.SetStateAction<string | null>>;
	editTabName: (tabValue: string, newName: string) => void;
}

const ToggleEditMode: React.FC<ToggleEditModeProps> = ({
	isEditMode,
	setIsEditMode,
	handleSaveChanges,
	handleCancelChanges,
	hasUnsavedChanges,
	initialLayout,
	layout,
	setLayout,
	selectedWidgetKey,
	setSelectedWidgetKey,
	addNewTab,
	maxTabsReached,
	tabs,
	setTabs,
	selectedTabValue,
	setSelectedTabValue,
	editTabName,
}) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const toggleDraggable = () => {
		if (isEditMode && hasUnsavedChanges) {
			setIsDialogOpen(true);
		} else {
			setIsEditMode((prev) => !prev);
		}
	};

	const handleConfirmExit = () => {
		handleCancelChanges();
		setIsDialogOpen(false);
		setIsEditMode(false);
	};

	const handleConfirmSave = () => {
		handleSaveChanges();
		setIsDialogOpen(false);
		setIsEditMode(false);
	};

	const handleAddNewTab = (name: string) => {
		addNewTab(name);
	};

	return (
		<>
			{isEditMode && (
				<div className="flex items-center space-x-3 border-2 border-dashed border-background-400 rounded-md p-2">
					<SelectThemeLayout />
					<Separator orientation="vertical" className="h-11 w-[2px]" />
					<Tooltip>
						<TooltipTrigger>
							<AddNewWidget layout={layout} setLayout={setLayout} />
						</TooltipTrigger>
						<TooltipContent>
							<p>Add new widget</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger>
							<EditWidget
								selectedWidgetKey={selectedWidgetKey}
								setSelectedWidgetKey={setSelectedWidgetKey}
								layout={layout}
								setLayout={setLayout}
							/>
						</TooltipTrigger>
						<TooltipContent>
							<p>Edit widget {!selectedWidgetKey ? "by first selecting one" : ""}</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger>
							<DeleteWidget
								widgetKey={selectedWidgetKey}
								layout={layout}
								setLayout={setLayout}
							/>
						</TooltipTrigger>
						<TooltipContent>
							<p>
								Delete widget {!selectedWidgetKey ? "by first selecting one" : ""}
							</p>
						</TooltipContent>
					</Tooltip>
					<Separator orientation="vertical" className="h-11 w-[2px]" />

					<Tooltip>
						<TooltipTrigger>
							<AddNewTabs onAdd={handleAddNewTab} disabled={maxTabsReached} />
						</TooltipTrigger>
						<TooltipContent>
							<p>Add new tabs</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger>
							<EditTabName
								tabValue={selectedTabValue}
								currentName={
									tabs.find((tab) => tab.value === selectedTabValue)?.label || ""
								}
								onEdit={editTabName}
							/>
						</TooltipTrigger>
						<TooltipContent>
							<p>Edit tab name</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger>
							<DeleteTab
								tabValue={selectedTabValue}
								tabs={tabs}
								setTabs={setTabs}
								setSelectedTabValue={setSelectedTabValue}
							/>
						</TooltipTrigger>
						<TooltipContent>
							<p>Delete tabs</p>
						</TooltipContent>
					</Tooltip>
					<Separator orientation="vertical" className="h-11 w-[2px]" />

					<Tooltip>
						<TooltipTrigger>
							<ResetLayout defaultLayout={initialLayout} setLayout={setLayout} />
						</TooltipTrigger>
						<TooltipContent>
							<p>Reset Layout</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="h-11"
								onClick={handleSaveChanges}
							>
								<Save />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Save changes</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="h-11"
								onClick={handleCancelChanges}
							>
								<Ban />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Cancel changes</p>
						</TooltipContent>
					</Tooltip>
				</div>
			)}

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon"
						className="h-11"
						onClick={toggleDraggable}
					>
						{isEditMode ? <PencilOff /> : <Pencil />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>{isEditMode ? "Exit" : "Enter"} Edit Mode</p>
				</TooltipContent>
			</Tooltip>

			<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirm Exit</AlertDialogTitle>
						<AlertDialogDescription>
							You have unsaved changes. Do you want to save your changes before
							exiting the edit mode?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleConfirmExit}>
							Don&apos;t Save
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirmSave}>
							Save Changes
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default ToggleEditMode;
