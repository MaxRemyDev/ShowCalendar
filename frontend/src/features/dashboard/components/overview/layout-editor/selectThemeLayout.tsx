import React, { useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { showSelectLayoutError, showSelectLayoutSuccess } from "./utils/toastMessages";
import { layouts } from "../widget/utils/layoutsConfig";
import { useWidgetManager } from "../widget/WidgetManagerContext";

export const SelectThemeLayout = () => {
	const { setLayout } = useWidgetManager();

	useEffect(() => {
		// Set the default layout on initial render
		setLayout(layouts.default);
	}, [setLayout]);

	const handleSelect = (value: keyof typeof layouts) => {
		try {
			const selectedLayout = layouts[value] || layouts.default;
			setLayout(selectedLayout);
			showSelectLayoutSuccess();
		} catch (error) {
			showSelectLayoutError();
		}
	};

	return (
		<Select onValueChange={handleSelect} defaultValue="default">
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select a theme" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Layout Themes</SelectLabel>
					<SelectItem value="default">Default Theme</SelectItem>
					<SelectItem value="secondary">Theme 2</SelectItem>
					<SelectItem value="small">Small Screen</SelectItem>
					<SelectItem value="large">Large Screen</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};
