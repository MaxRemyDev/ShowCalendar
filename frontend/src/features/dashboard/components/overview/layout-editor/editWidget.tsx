import React, { useState, useEffect } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit3 } from "lucide-react";
import { showEditWidgetError, showEditWidgetSuccess } from "./utils/toastMessages";
import Widget from "../widget/Widget";
import { listWidgets } from "../widget/utils/list-widgets";
import { CustomLayout } from "../OverviewTypes";

interface EditWidgetProps {
	selectedWidgetKey: string | null;
	setSelectedWidgetKey: React.Dispatch<React.SetStateAction<string | null>>;
	layout: CustomLayout[];
	setLayout: React.Dispatch<React.SetStateAction<CustomLayout[]>>;
}

const EditWidget: React.FC<EditWidgetProps> = ({
	selectedWidgetKey,
	setSelectedWidgetKey,
	layout,
	setLayout,
}) => {
	const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

	const handleEditWidget = () => {
		try {
			if (selectedWidgetKey && selectedWidget) {
				const widgets = listWidgets.flatMap((category) => category.widgets);
				const newWidget = widgets.find((widget) => widget.key === selectedWidget);
				if (newWidget) {
					const updatedLayout = layout.map((item) =>
						item.i === selectedWidgetKey
							? {
									...item,
									i: newWidget.key,
									w: newWidget.dataGrid?.w ?? 2,
									h: newWidget.dataGrid?.h ?? 2,
							  }
							: item
					);
					setLayout(updatedLayout);
					setSelectedWidgetKey(null);
				}
			}
			showEditWidgetSuccess();
		} catch (error) {
			showEditWidgetError();
		}
	};

	useEffect(() => {
		if (!selectedWidgetKey) {
			setSelectedWidget(null);
		}
	}, [selectedWidgetKey]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="h-11"
					disabled={!selectedWidgetKey}
				>
					<Edit3 />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>Edit Widget</DialogTitle>
					<DialogDescription>
						Select a widget to replace the selected one
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="h-96">
					<div className="space-y-4">
						{listWidgets
							.flatMap((category) => category.widgets)
							.map((widget) => (
								<div
									key={widget.key}
									className={`p-2 border ${
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
						<Button onClick={handleEditWidget}>Edit Widget</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EditWidget;
