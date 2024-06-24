import { toast } from "@/components/ui/use-toast";

// CANCEL MESSAGE
export const showCancelSuccess = () => {
	toast({
		title: "Success",
		description: "Changes have been Canceled successfully.",
	});
};
export const showCancelError = () => {
	toast({
		title: "Error",
		description: "An error occurred while canceling changes.",
		variant: "destructive",
	});
};

// SAVE MESSAGE
export const showSaveSuccess = () => {
	toast({
		title: "Success",
		description: "Changes have been saved successfully.",
	});
};
export const showSaveError = () => {
	toast({
		title: "Error",
		description: "An error occurred while saving changes.",
		variant: "destructive",
	});
};

// RESET MESSAGE
export const showResetSuccess = () => {
	toast({
		title: "Success",
		description: "Layout has been reset to default.",
	});
};
export const showResetError = () => {
	toast({
		title: "Error",
		description: "An error occurred while resetting layout.",
		variant: "destructive",
	});
};

// ADD NEW WIDGET MESSAGE
export const showAddNewWidgetSuccess = () => {
	toast({
		title: "Success",
		description: "New widget added successfully!",
		variant: "default",
	});
};
export const showAddNewWidgetError = () => {
	toast({
		title: "Error",
		description: "Failed to add new widget.",
		variant: "destructive",
	});
};

// DELETE WIDGET MESSAGE
export const showDeleteWidgetSuccess = () => {
	toast({
		title: "Success",
		description: "Widget deleted successfully!",
		variant: "default",
	});
};
export const showDeleteWidgetError = () => {
	toast({
		title: "Error",
		description: "Failed to delete widget.",
		variant: "destructive",
	});
};

// ADD NEW WIDGET MESSAGE
export const showAddWidgetSuccess = () => {
	toast({
		title: "Success",
		description: "Widget added successfully!",
		variant: "default",
	});
};
export const showAddWidgetError = () => {
	toast({
		title: "Error",
		description: "Failed to add widget.",
		variant: "destructive",
	});
};

// EDIT WIDGET MESSAGE
export const showEditWidgetSuccess = () => {
	toast({
		title: "Success",
		description: "Widget edited successfully!",
		variant: "default",
	});
};
export const showEditWidgetError = () => {
	toast({
		title: "Error",
		description: "Failed to edit widget.",
		variant: "destructive",
	});
};

// SELECT LAYOUT MESSAGE
export const showSelectLayoutSuccess = () => {
	toast({
		title: "Success",
		description: "Layout has been selected successfully!",
		variant: "default",
	});
};
export const showSelectLayoutError = () => {
	toast({
		title: "Error",
		description: "Failed to select layout.",
		variant: "destructive",
	});
};

// ADD NEW TAB MESSAGE
export const showAddNewTabSuccess = () => {
	toast({
		title: "Success",
		description: "New Tab added successfully!",
		variant: "default",
	});
};
export const showAddNewTabError = () => {
	toast({
		title: "Error",
		description: "Failed to add new Tab.",
		variant: "destructive",
	});
};

// EDIT TAB MESSAGE
export const showEditTabSuccess = () => {
	toast({
		title: "Success",
		description: "Tab edited successfully!",
		variant: "default",
	});
};
export const showEditTabError = () => {
	toast({
		title: "Error",
		description: "Failed to edit Tab.",
		variant: "destructive",
	});
};

// DELETE TAB MESSAGE
export const showDeleteTabSuccess = () => {
	toast({
		title: "Success",
		description: "Tab deleted successfully!",
		variant: "default",
	});
};
export const showDeleteTabError = () => {
	toast({
		title: "Error",
		description: "Failed to delete Tab.",
		variant: "destructive",
	});
};
