import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
	useCallback,
	useMemo,
} from "react";
import { loadChanges } from "../layout-editor/loadChanges";
import { layouts } from "./utils/layoutsConfig";
import { CustomLayout, Widget } from "../OverviewTypes";

interface WidgetManagerContextProps {
	layout: CustomLayout[];
	setLayout: React.Dispatch<React.SetStateAction<CustomLayout[]>>;
	calculateWidgetDimensions: (widget: Widget) => {
		w: number;
		h: number;
		minW: number;
		minH: number;
		maxW: number;
		maxH: number;
	};
}

const WidgetManagerContext = createContext<WidgetManagerContextProps | undefined>(undefined);

export const WidgetManagerProvider = ({ children }: { children: ReactNode }) => {
	const initialLayout = loadChanges("defaultCategory").layout;
	const [layout, setLayout] = useState<CustomLayout[]>(
		initialLayout.length ? initialLayout : layouts.default
	);

	useEffect(() => {
		if (!initialLayout.length) {
			setLayout(layouts.default);
		}
	}, [initialLayout]);

	const calculateWidgetDimensions = useCallback((widget: Widget) => {
		const baseWidth = 2;
		const baseHeight = 2;

		let width = baseWidth;
		let height = baseHeight;

		if (widget.customContent) {
			width = baseWidth * 3;
			height = baseHeight * 3;
		} else {
			width = baseWidth + (widget.title ? 1 : 0);
			height = baseHeight + (widget.description ? 1 : 0);
		}

		const dimensions = {
			w: width,
			h: height,
			minW: Math.max(2, Math.ceil(width * 0.25)),
			minH: Math.max(2, Math.ceil(height * 0.25)),
			maxW: Math.ceil(width * 2),
			maxH: Math.ceil(height * 2),
		};

		return dimensions;
	}, []);

	const contextValue = useMemo(
		() => ({ layout, setLayout, calculateWidgetDimensions }),
		[layout, calculateWidgetDimensions]
	);

	return (
		<WidgetManagerContext.Provider value={contextValue}>
			{children}
		</WidgetManagerContext.Provider>
	);
};

export const useWidgetManager = () => {
	const context = useContext(WidgetManagerContext);
	if (context === undefined) {
		throw new Error("useWidgetManager must be used within a WidgetManagerProvider");
	}
	return context;
};
