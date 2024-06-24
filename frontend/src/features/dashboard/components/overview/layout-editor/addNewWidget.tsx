import React, { useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { showAddWidgetError, showAddWidgetSuccess } from "./utils/toastMessages";
import Widget from "../widget/Widget";
import { listWidgets } from "../widget/utils/list-widgets";
import { CustomLayout } from "../OverviewTypes";

interface AddNewWidgetProps {
	layout: CustomLayout[];
	setLayout: React.Dispatch<React.SetStateAction<CustomLayout[]>>;
}

const AddNewWidget: React.FC<AddNewWidgetProps> = ({ layout, setLayout }) => {
	const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

	const handleAddWidget = () => {
		try {
			if (selectedWidget) {
				const widgets = listWidgets.flatMap((category) => category.widgets);
				const newWidget = widgets.find((widget) => widget.key === selectedWidget);
				if (newWidget) {
					const newKey = `${newWidget.key}-${layout.length}`;
					const newPosition = findNewPosition(layout);
					const newLayoutItem: CustomLayout = {
						i: newKey,
						x: newPosition.x,
						y: newPosition.y,
						w: newWidget.dataGrid?.w ?? 2,
						h: newWidget.dataGrid?.h ?? 2,
					};
					setLayout([...layout, newLayoutItem]);
				}
				showAddWidgetSuccess();
			}
		} catch (error) {
			showAddWidgetError();
		}
	};

	const findNewPosition = (layout: CustomLayout[]) => {
		let x = 0,
			y = 0;
		let maxRow = 0;
		layout.forEach((item) => {
			if (item.y >= maxRow) maxRow = item.y + item.h;
		});
		return { x: 0, y: maxRow };
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon" className="h-11">
					<Plus />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>Add New Widget</DialogTitle>
					<DialogDescription>Select a widget to add to your dashboard</DialogDescription>
				</DialogHeader>
				<ScrollArea className="h-96">
					<div className="space-y-4">
						{listWidgets
							.flatMap((category) => category.widgets)
							.map((widget) => (
								<div
									key={widget.key}
									className={`p-2 border border-dotted rounded-md ${
										selectedWidget === widget.key
											? "border-primary"
											: "border-background-300"
									}`}
									onClick={() => setSelectedWidget(widget.key)}
								>
									<div className="h-full">
										<Widget
											{...widget}
											isEditing={false}
											className="pointer-events-none"
										/>
									</div>
								</div>
							))}
					</div>
				</ScrollArea>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button onClick={handleAddWidget}>Add Widget</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddNewWidget;
