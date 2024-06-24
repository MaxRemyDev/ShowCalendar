import { showDeleteWidgetError, showDeleteWidgetSuccess } from "./utils/toastMessages";
import React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { CustomLayout } from "../OverviewTypes";

interface DeleteWidgetProps {
	widgetKey: string | null;
	layout: CustomLayout[];
	setLayout: React.Dispatch<React.SetStateAction<CustomLayout[]>>;
}

const deleteWidgetLogic = (
	widgetKey: string,
	layout: CustomLayout[],
	setLayout: React.Dispatch<React.SetStateAction<CustomLayout[]>>
) => {
	try {
		const updatedLayout = layout.filter((item) => item.i !== widgetKey);
		setLayout(updatedLayout);

		showDeleteWidgetSuccess();
	} catch (error) {
		showDeleteWidgetError();
	}
};

export const DeleteWidget: React.FC<DeleteWidgetProps> = ({ widgetKey, layout, setLayout }) => {
	const handleDeleteWidget = () => {
		if (widgetKey) {
			deleteWidgetLogic(widgetKey, layout, setLayout);
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline" size="icon" className="h-11" disabled={!widgetKey}>
					<Trash />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this widget? This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDeleteWidget}>Confirm</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
