import { showDeleteTabError, showDeleteTabSuccess } from "./utils/toastMessages";
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

interface DeleteTabProps {
	tabValue: string | null;
	tabs: { value: string; label: string; widgets: string[] }[];
	setTabs: React.Dispatch<
		React.SetStateAction<{ value: string; label: string; widgets: string[] }[]>
	>;
	setSelectedTabValue: React.Dispatch<React.SetStateAction<string | null>>;
}

const deleteTabLogic = (
	tabValue: string,
	tabs: { value: string; label: string; widgets: string[] }[],
	setTabs: React.Dispatch<
		React.SetStateAction<{ value: string; label: string; widgets: string[] }[]>
	>,
	setSelectedTabValue: React.Dispatch<React.SetStateAction<string | null>>
) => {
	if (tabs.length > 1) {
		const updatedTabs = tabs.filter((tab) => tab.value !== tabValue);
		setTabs(updatedTabs);
		if (updatedTabs.length > 0) {
			setSelectedTabValue(updatedTabs[0].value);
		} else {
			setSelectedTabValue("General");
		}
	} else {
		throw new Error("Cannot delete the last remaining tab.");
	}
};

export const DeleteTab: React.FC<DeleteTabProps> = ({
	tabValue,
	tabs,
	setTabs,
	setSelectedTabValue,
}) => {
	const handleDeleteTab = () => {
		try {
			if (tabValue) {
				deleteTabLogic(tabValue, tabs, setTabs, setSelectedTabValue);
				showDeleteTabSuccess();
			}
		} catch (error) {
			showDeleteTabError();
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="h-11"
					disabled={!tabValue || tabs.length === 1}
				>
					<Trash />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this tab? This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDeleteTab}>Confirm</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
