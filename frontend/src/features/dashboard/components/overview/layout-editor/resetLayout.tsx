import React from "react";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { CustomLayout } from "../OverviewTypes";
import { showResetSuccess, showResetError } from "./utils/toastMessages";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ResetLayoutProps {
	defaultLayout: CustomLayout[];
	setLayout: React.Dispatch<React.SetStateAction<CustomLayout[]>>;
}

export const resetLayoutLogic = (
	defaultLayout: CustomLayout[],
	setLayout: React.Dispatch<React.SetStateAction<CustomLayout[]>>
) => {
	try {
		setLayout(defaultLayout);
		localStorage.removeItem("OverviewLayout");
		showResetSuccess();
	} catch (error) {
		showResetError();
	}
};

const ResetLayout: React.FC<ResetLayoutProps> = ({ defaultLayout, setLayout }) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline" size="icon" className="h-11">
					<RefreshCw />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Reset Layout Confirmation</AlertDialogTitle>
					<AlertDialogDescription>
						<p>
							This action will reset all the modifications made to the layout. The
							layout will be set back to the default settings.
						</p>
						<br />
						<p className="font-semibold">Are you sure you want to proceed?</p>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={() => resetLayoutLogic(defaultLayout, setLayout)}>
						Confirm
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default ResetLayout;
