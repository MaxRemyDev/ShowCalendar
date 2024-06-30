import { useRef, useState, useCallback } from "react";
import { CalendarEvent, DragEndParams } from "./types";
import { calculateNewDate, calculateNewConsecutiveDate } from "./utils";
import { startOfWeek } from "date-fns";

const useDragAndDrop = (
	showConsecutiveDays: boolean,
	startDate: Date,
	updateEventPosition: (event: CalendarEvent, date: Date) => void,
	setSelectedDay: (date: Date | null) => void
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

			const relativeX = clientX - rect.left;
			const relativeY = clientY - rect.top;

			let newDate;
			if (showConsecutiveDays) {
				const adjustedStartDate = startOfWeek(startDate, { weekStartsOn: 1 });
				newDate = calculateNewConsecutiveDate(
					relativeX,
					relativeY,
					rect.width,
					rect.height,
					adjustedStartDate
				);
			} else {
				newDate = calculateNewDate(
					relativeX,
					relativeY,
					rect.width,
					rect.height,
					startDate
				);
			}

			updateEventPosition(event, newDate);
			setDraggingEvent(null);
			setSelectedDay(newDate);
		},
		[showConsecutiveDays, startDate, updateEventPosition, setSelectedDay]
	);

	return {
		draggingEvent,
		onDragStart,
		onDragEnd,
		dragItemRef,
	};
};

export default useDragAndDrop;
