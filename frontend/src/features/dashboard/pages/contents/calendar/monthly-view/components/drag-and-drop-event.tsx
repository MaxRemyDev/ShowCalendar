import React, { useState, useRef } from "react";
import { CalendarDayProps, Event } from "../helpers/types";
import { calculateNewDate, isToday, getColorHex } from "../helpers/utils";
import PastDateIndicator from "./past-date-indicator";
import { motion } from "framer-motion";

const DragAndDropEvent: React.FC<CalendarDayProps> = ({
	date,
	month,
	year,
	events,
	showEventModal,
	updateEventPosition,
	onDayHover,
	handleDragEnd,
}) => {
	const [draggingEvent, setDraggingEvent] = useState<string | null>(null);
	const dragItemRef = useRef<HTMLDivElement | null>(null);

	const onDragStart = (event: Event, eventIndex: number) => {
		setDraggingEvent(event.event_title);
	};

	const onDragEnd = (
		event: Event,
		eventIndex: number,
		e: MouseEvent | TouchEvent | PointerEvent
	) => {
		const calendar = document.getElementById("calendar-grid");
		if (calendar) {
			const rect = calendar.getBoundingClientRect();
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
			const newDate = calculateNewDate(
				clientX - rect.left,
				clientY - rect.top,
				rect.width,
				rect.height,
				month,
				year
			);
			updateEventPosition(
				event,
				newDate.getDate(),
				newDate.getMonth(),
				newDate.getFullYear()
			);
		}
		setDraggingEvent(null);
	};

	return (
		<div
			style={{ width: "14.28%", height: "120px" }}
			className="px-4 pt-2 relative border-2 rounded-lg shadow-sm"
			onMouseOver={() => onDayHover(date, month, year)}
		>
			<PastDateIndicator date={date} month={month} year={year} />
			<div
				onClick={() => showEventModal(date)}
				className={`inline-flex w-8 h-8 items-center justify-center cursor-pointer text-center leading-none rounded-full transition ease-in-out duration-100 ${
					isToday(year, month, date)
						? "bg-primary hover:bg-secondary text-primary-foreground"
						: "text-foreground hover:bg-background-200"
				}`}
			>
				{date}
			</div>
			<div style={{ height: "80px" }} className="overflow-y-auto mt-1">
				{events
					.filter(
						(event) =>
							new Date(event.event_date).toDateString() ===
							new Date(year, month, date).toDateString()
					)
					.map((event, eventIndex) => {
						const hexColor = getColorHex(event.event_theme);
						const isDragging = draggingEvent === event.event_title;
						return (
							<motion.div
								key={eventIndex}
								ref={isDragging ? dragItemRef : null}
								className="px-2 py-1 rounded-lg mt-1 overflow-hidden border"
								style={{
									borderColor: `${hexColor}66`,
									color: `${hexColor}cc`,
									backgroundColor: `${hexColor}33`,
									zIndex: isDragging ? 1000 : 1,
									position: isDragging ? "absolute" : "relative",
								}}
								drag
								dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
								dragElastic={1}
								onDragStart={() => onDragStart(event, eventIndex)}
								onDragEnd={(e) => onDragEnd(event, eventIndex, e)}
								whileDrag={{ scale: 1.2 }}
								whileTap={{ scale: 0.95 }}
							>
								<p className="text-sm truncate leading-tight">
									{event.event_title}
								</p>
							</motion.div>
						);
					})}
			</div>
		</div>
	);
};

export default DragAndDropEvent;
