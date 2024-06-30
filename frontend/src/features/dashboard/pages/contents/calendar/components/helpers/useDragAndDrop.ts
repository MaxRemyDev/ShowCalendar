import { useRef, useState, useCallback } from "react";
import { CalendarEvent, DragEndParams } from "./types";
import { calculateNewDate, calculateNewConsecutiveDate } from "./utils";

const useDragAndDrop = (
	showConsecutiveDays: boolean,
	startDate: Date,
	updateEventPosition: (event: CalendarEvent, date: Date) => void
) => {
	const [draggingEvent, setDraggingEvent] = useState<string | null>(null);
	const dragItemRef = useRef<HTMLDivElement | null>(null);

	const onDragStart = useCallback((event: CalendarEvent, eventIndex: number) => {
		setDraggingEvent(event.event_title);
	}, []);

	const onDragEnd = useCallback(
		({ event, eventIndex, e, rect }: DragEndParams) => {
			let clientX, clientY;
			if (e instanceof MouseEvent || e instanceof PointerEvent) {
				clientX = e.clientX;
				clientY = e.clientY;
			} else if (e instanceof TouchEvent && e.touches.length > 0) {
				clientX = e.touches[0].clientX;
				clientY = e.touches[0].clientY;
			} else {
				return;
			}

			let newDate;
			if (showConsecutiveDays) {
				newDate = calculateNewConsecutiveDate(
					clientX - rect.left,
					clientY - rect.top,
					rect.width,
					rect.height,
					startDate
				);
			} else {
				newDate = calculateNewDate(
					clientX - rect.left,
					clientY - rect.top,
					rect.width,
					rect.height,
					startDate
				);
			}

			updateEventPosition(event, newDate);
			setDraggingEvent(null);
		},
		[showConsecutiveDays, startDate, updateEventPosition]
	);

	return {
		draggingEvent,
		onDragStart,
		onDragEnd,
		dragItemRef,
	};
};

export default useDragAndDrop;
