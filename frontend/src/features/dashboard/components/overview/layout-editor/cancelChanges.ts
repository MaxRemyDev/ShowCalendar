import { Layout } from "react-grid-layout";
import { showCancelSuccess, showCancelError } from "./utils/toastMessages";

export const cancelChanges = (
	initialLayout: Layout[],
	setLayout: React.Dispatch<React.SetStateAction<Layout[]>>,
	setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>
) => {
	try {
		setLayout(initialLayout);
		showCancelSuccess();
		setIsEditMode(false); // QUIT EDIT MODE
	} catch (error) {
		showCancelError();
	}
};
