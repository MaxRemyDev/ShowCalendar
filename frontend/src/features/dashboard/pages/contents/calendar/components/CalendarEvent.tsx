import React from "react";
import { motion } from "framer-motion";
import { CalendarEvent as CalendarEventType } from "./helpers/types";
import { getColorHex } from "./helpers/utils";

interface CalendarEventProps {
	event: CalendarEventType;
	eventIndex: number;
	onDragStart: (event: CalendarEventType, eventIndex: number) => void;
	onDragEnd: (params: {
		event: CalendarEventType;
		eventIndex: number;
		e: MouseEvent | TouchEvent | PointerEvent;
		rect: DOMRect;
	}) => void;
	draggingEvent: string | null;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({
	event,
	eventIndex,
	onDragStart,
	onDragEnd,
	draggingEvent,
}) => {
	const dragItemRef = React.useRef<HTMLDivElement | null>(null);
	const hexColor = getColorHex(event.event_theme);
	const isDragging = draggingEvent === event.event_title;

	return (
		<motion.div
			ref={isDragging ? dragItemRef : null}
			className="px-2 py-1 rounded-lg mt-1 overflow-hidden border w-full"
			style={{
				borderColor: `${hexColor}66`,
				color: `${hexColor}cc`,
				backgroundColor: `${hexColor}33`,
				zIndex: isDragging ? 1000 : 1,
				position: isDragging ? "absolute" : "relative",
				pointerEvents: isDragging ? "none" : "auto",
			}}
			drag
			dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
			dragElastic={1}
			onDragStart={() => onDragStart(event, eventIndex)}
			onDragEnd={(e) => {
				const calendarGrid = document.getElementById("calendar-grid");
				if (calendarGrid) {
					const rect = calendarGrid.getBoundingClientRect();
					onDragEnd({ event, eventIndex, e, rect });
				}
			}}
			whileDrag={{ scale: 1.2 }}
			whileTap={{ scale: 0.95 }}
		>
			<p className="text-sm truncate leading-tight">{event.event_title}</p>
		</motion.div>
	);
};

export default CalendarEvent;
