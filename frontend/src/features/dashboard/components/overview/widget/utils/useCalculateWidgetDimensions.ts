import { useCallback } from "react";
import { Widget } from "../../OverviewTypes";

const baseWidth = 2;
const baseHeight = 2;
const minWidth = 2;
const minHeight = 2;

const useCalculateWidgetDimensions = () => {
	const calculateDimensions = useCallback((widget: Widget) => {
		const width = widget.dataGrid?.w ?? baseWidth;
		const height = widget.dataGrid?.h ?? baseHeight;

		const dimensions = {
			w: Math.max(width, minWidth),
			h: Math.max(height, minHeight),
			minW: widget.dataGrid?.minW ?? minWidth,
			minH: widget.dataGrid?.minH ?? minHeight,
			maxW: widget.dataGrid?.maxW ?? Infinity,
			maxH: widget.dataGrid?.maxH ?? Infinity,
		};

		return dimensions;
	}, []);

	return { calculateDimensions };
};

export default useCalculateWidgetDimensions;
