import { CustomLayout } from "../OverviewTypes";
import { showSaveSuccess, showSaveError } from "./utils/toastMessages";

export const saveChanges = (
	category: string,
	layout: CustomLayout[],
	tabs: { value: string; label: string; widgets: string[] }[],
	setIsDraggable: React.Dispatch<React.SetStateAction<boolean>>
) => {
	try {
		const overviewData = JSON.parse(localStorage.getItem("OverviewLayout") || "{}");

		overviewData[category] = {
			layout,
			tabs,
		};

		localStorage.setItem("OverviewLayout", JSON.stringify(overviewData));
		showSaveSuccess();
		setIsDraggable(false); // QUIT EDIT MODE
	} catch (error) {
		showSaveError();
	}
};
