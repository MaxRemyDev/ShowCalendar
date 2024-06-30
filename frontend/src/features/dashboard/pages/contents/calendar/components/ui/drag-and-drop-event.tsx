import React from "react";
import { isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarDayProps } from "../helpers/types";
import CalendarEvent from "../CalendarEvent";
import useDragAndDrop from "../helpers/useDragAndDrop";

const DragAndDropEvent: React.FC<
	CalendarDayProps & { showConsecutiveDays: boolean; startDate: Date }
> = ({
	date,
	month,
	year,
	events,
	updateEventPosition,
	onDayHover,
	onDayClick,
	handleDragEnd,
	selectedDay,
	hoveredDay,
	setIsDragging,
	handleDragStart,
	isDragging,
	setSelectedDay,
	showConsecutiveDays,
	startDate,
	showEventModal,
}) => {
	const { draggingEvent, onDragStart, onDragEnd, dragItemRef } = useDragAndDrop(
		showConsecutiveDays,
		startDate,
		updateEventPosition,
		setSelectedDay
	);

	const isSelected = selectedDay && isSameDay(new Date(year, month, date), selectedDay);
	const isHovered = hoveredDay && isSameDay(new Date(year, month, date), hoveredDay);

	return (
		<div
			style={{ height: "70px" }}
			className={cn("overflow-y-auto mt-1")}
			onMouseOver={() => onDayHover(new Date(year, month, date))}
			onDragOver={() => onDayHover(new Date(year, month, date))}
			onFocus={() => onDayHover(new Date(year, month, date))}
			onClick={() => onDayClick(new Date(year, month, date))}
			tabIndex={0}
			role="button"
			aria-pressed={isSelected ? "true" : "false"}
		>
			{events
				.filter(
					(event) =>
						new Date(event.event_date).toDateString() ===
						new Date(year, month, date).toDateString()
				)
				.map((event, eventIndex) => (
					<CalendarEvent
						key={`${event.id}-${eventIndex}`}
						event={event}
						eventIndex={eventIndex}
						onDragStart={onDragStart}
						onDragEnd={onDragEnd}
						draggingEvent={draggingEvent}
					/>
				))}
		</div>
	);
};

export default DragAndDropEvent;
