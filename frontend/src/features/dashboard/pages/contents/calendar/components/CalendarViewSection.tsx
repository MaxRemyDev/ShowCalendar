"use client";

import React, { useState } from "react";
import { format, isSameDay, startOfDay, startOfWeek } from "date-fns";
import { CalendarEvent, CalendarProps } from "./helpers/types";
import {
	isPastDate,
	throttle,
	calculateNewDate,
	calculateNewConsecutiveDate,
} from "./helpers/utils";
import CreateNewEventDialog from "./ui/create-new-event-dialog";
import CalendarGrid from "./CalendarGrid";
import CollapsibleDayDetails from "./ui/collapsible-day-details";
import clsx from "clsx";
import { Separator } from "@/components/ui/separator";

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

	const updateEventPosition = (event: CalendarEvent, date: Date) => {
		const updatedEvents = events.map((e) =>
			e.id === event.id ? { ...e, event_date: startOfDay(date) } : e
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

	const startDateForConsecutiveDays = showConsecutiveDays
		? startOfWeek(currentDate, { weekStartsOn: 1 })
		: currentDate;

	return (
		<div className="flex">
			<div
				id="calendar-grid"
				className={clsx("-mx-1 -mb-1", {
					"w-full": !selectedDay,
					"w-3/4": selectedDay,
				})}
			>
				<CreateNewEventDialog
					open={openEventModal}
					onOpenChange={setOpenEventModal}
					eventDate={eventDate}
					addEvent={(
						title: string,
						date: string,
						theme: string,
						description: string,
						location: string,
						startTime: Date | undefined,
						endTime: Date | undefined,
						participants: any[] = [],
						notes: string = ""
					) => {
						addEvent(
							title,
							date,
							theme,
							description,
							location,
							startTime ? format(startTime, "HH:mm") : "",
							endTime ? format(endTime, "HH:mm") : "",
							participants,
							notes
						);
					}}
				/>

				<Separator className="h-[4px] rounded" />

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
					startDate={startDateForConsecutiveDays}
					showEventModal={showEventModalInternal}
				/>
			</div>
			{selectedDay && (
				<div className="w-1/4">
					<CollapsibleDayDetails
						date={selectedDay}
						events={events.filter(
							(event) =>
								selectedDay && isSameDay(new Date(event.event_date), selectedDay)
						)}
						onClose={() => setSelectedDay(null)}
						onEditEvent={(eventId) => {
							//TODO: Handle edit event
						}}
						onDeleteEvent={(eventId) => {
							//TODO: Handle delete event
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default CalendarViewSection;
