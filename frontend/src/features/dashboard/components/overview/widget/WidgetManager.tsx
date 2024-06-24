import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import Widget from "./Widget";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { toast } from "@/components/ui/use-toast";
import useCalculateWidgetDimensions from "./utils/useCalculateWidgetDimensions";
import { CustomLayout, WidgetManagerProps } from "../OverviewTypes";

const ResponsiveGridLayout = WidthProvider(Responsive);

type ResizeHandle = "w" | "e";

const WidgetManager: React.FC<WidgetManagerProps> = ({
	widgets,
	isDraggable,
	layout,
	setLayout,
	initialLayout,
	selectedWidgetKey,
	setSelectedWidgetKey,
	isEditMode,
}) => {
	const { calculateDimensions } = useCalculateWidgetDimensions();
	const [mounted, setMounted] = useState(false);
	const [compactType] = useState<"vertical" | "horizontal" | null>("vertical");
	const [resizeHandles] = useState<ResizeHandle[]>(["w", "e"]);

	useEffect(() => {
		setMounted(true);
	}, [layout]);

	const onLayoutChange = (newLayout: Layout[]) => {
		setLayout(newLayout as CustomLayout[]);
	};

	const applyResizeConstraints = (newItem: Layout, oldItem: Layout) => {
		const initialDimensions = initialLayout.find((item) => item.i === newItem.i);
		if (initialDimensions) {
			const minWidth = Math.ceil(initialDimensions.w * 0.5); // 50% of initial width
			const maxWidth = initialDimensions.w * 2;

			newItem.w = Math.max(newItem.w, minWidth);
			newItem.w = Math.min(newItem.w, maxWidth);

			const minHeight = Math.ceil(initialDimensions.h * 0.5); // 50% of initial height
			const maxHeight = initialDimensions.h * 2;

			newItem.h = Math.max(newItem.h, minHeight);
			newItem.h = Math.min(newItem.h, maxHeight);
		}
	};

	const onResize = (
		layout: Layout[],
		oldItem: Layout,
		newItem: Layout,
		placeholder: Layout,
		e: MouseEvent,
		element: HTMLElement
	) => {
		applyResizeConstraints(newItem, oldItem);
	};

	const onResizeStop = (
		layout: Layout[],
		oldItem: Layout,
		newItem: Layout,
		placeholder: Layout,
		e: MouseEvent,
		element: HTMLElement
	) => {
		applyResizeConstraints(newItem, oldItem);
		const widthChange = calculateResizePercentage(oldItem, newItem);
		toast({
			title: "Widget Resized",
			description: `Width changed by ${widthChange}%`,
		});
	};

	const calculateResizePercentage = (oldItem: Layout, newItem: Layout) => {
		const widthChange = ((newItem.w - oldItem.w) / oldItem.w) * 100;
		return Math.round(widthChange);
	};

	const onDragStop = (
		layout: Layout[],
		oldItem: Layout,
		newItem: Layout,
		placeholder: Layout,
		e: MouseEvent,
		element: HTMLElement
	) => {
		toast({
			title: "Widget Moved",
			description: `Widget moved to position (${newItem.x}, ${newItem.y})`,
		});
	};

	const handleSelectWidget = (key: string) => {
		setSelectedWidgetKey((prevKey: string | null) => (prevKey === key ? null : key));
	};

	const generateDOM = () => {
		return widgets.map((widget) => {
			const { key, ...rest } = widget;
			const dimensions = calculateDimensions(widget);
			const dataGrid = { ...widget.dataGrid, ...dimensions };
			return (
				<div key={widget.key} data-grid={dataGrid}>
					<Widget
						key={widget.key}
						{...rest}
						isEditing={isDraggable}
						isSelected={isDraggable && widget.key === selectedWidgetKey}
						onSelect={() => handleSelectWidget(widget.key)}
					/>
				</div>
			);
		});
	};

	return (
		<div className="widget-container">
			<ResponsiveGridLayout
				className="layout"
				layouts={{ layout }}
				breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
				cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
				rowHeight={60}
				margin={[10, 10]}
				isDraggable={isDraggable}
				isResizable={isDraggable}
				containerPadding={[10, 10]}
				compactType={compactType}
				onLayoutChange={onLayoutChange}
				onResize={onResize}
				onResizeStop={onResizeStop}
				onDragStop={onDragStop}
				useCSSTransforms={mounted}
				preventCollision={!compactType}
				resizeHandles={resizeHandles}
			>
				{generateDOM()}
			</ResponsiveGridLayout>
		</div>
	);
};

export default WidgetManager;
