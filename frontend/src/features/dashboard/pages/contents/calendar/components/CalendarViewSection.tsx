"use client";

import React, { useState, useRef } from "react";
import { format, isSameDay } from "date-fns";
import { CalendarEvent, CalendarProps } from "./helpers/types";
import {
	isPastDate,
	throttle,
	calculateNewDate,
	calculateNewConsecutiveDate,
} from "./helpers/utils";
import CreateNewEventDialog from "./ui/create-new-event-dialog";
import CalendarGrid from "./CalendarGrid";

const CalendarViewSection: React.FC<CalendarProps> = ({
	currentDate,
	events,
	setEvents,
	addEvent,
	hoveredDay,
	setHoveredDay,
	selectedDay,
	setSelectedDay,
	isDragging,
	setIsDragging,
	showConsecutiveDays,
	lastHoveredDay,
}) => {
	const [eventDate, setEventDate] = useState<string>("");
	const [openEventModal, setOpenEventModal] = useState<boolean>(false);

	const showEventModalInternal = (date: Date): void => {
		if (!isPastDate(date)) {
			setOpenEventModal(true);
			setEventDate(format(date, "yyyy-MM-dd"));
		}
	};

	const month = currentDate.getMonth();
	const year = currentDate.getFullYear();

	const updateEventPosition = (event: CalendarEvent, date: Date) => {
		const updatedEvents = events.map((e) =>
			e.id === event.id ? { ...e, event_date: date } : e
		);
		setEvents(updatedEvents);
	};

	const handleDayHover = throttle((date: Date) => {
		if (!lastHoveredDay.current || !isSameDay(date, lastHoveredDay.current)) {
			setHoveredDay(date);
			lastHoveredDay.current = date;
		}
	}, 100);

	const handleDayClick = (date: Date) => {
		if (!isDragging) {
			setSelectedDay(date);
		}
	};

	const handleDragStart = () => {
		setSelectedDay(null);
		setIsDragging(true);
	};

	const handleDragEnd = (event: CalendarEvent, clientX: number, clientY: number) => {
		const calendar = document.getElementById("calendar-grid");
		if (calendar) {
			const rect = calendar.getBoundingClientRect();
			const newDate = showConsecutiveDays
				? calculateNewConsecutiveDate(
						clientX - rect.left,
						clientY - rect.top,
						rect.width,
						rect.height,
						currentDate
				  )
				: calculateNewDate(
						clientX - rect.left,
						clientY - rect.top,
						rect.width,
						rect.height,
						currentDate
				  );

			updateEventPosition(event, newDate);
			setSelectedDay(newDate);
		}
		setHoveredDay(null);
		setIsDragging(false);
		lastHoveredDay.current = null;
	};

	return (
		<div id="calendar-grid" className="-mx-1 -mb-1">
			<CreateNewEventDialog
				open={openEventModal}
				onOpenChange={setOpenEventModal}
				eventDate={eventDate}
				addEvent={addEvent}
			/>
			<CalendarGrid
				currentDate={currentDate}
				events={events}
				updateEventPosition={updateEventPosition}
				onDayHover={handleDayHover}
				onDayClick={handleDayClick}
				handleDragEnd={handleDragEnd}
				selectedDay={selectedDay}
				hoveredDay={hoveredDay}
				setIsDragging={setIsDragging}
				handleDragStart={handleDragStart}
				isDragging={isDragging}
				setSelectedDay={setSelectedDay}
				showConsecutiveDays={showConsecutiveDays}
				startDate={currentDate}
				showEventModal={showEventModalInternal}
			/>
		</div>
	);
};

export default CalendarViewSection;
