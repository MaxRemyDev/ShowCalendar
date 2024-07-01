"use client";

import { useState, useRef } from "react";
import { addMonths, subMonths } from "date-fns";
import { CalendarEvent } from "../components/helpers/types";
import { getHeaderTitle } from "../components/helpers/utils";
import CalendarHeader from "../components/CalendarHeader";
import CalendarViewSection from "../components/CalendarViewSection";

const MonthlyViewPage: React.FC = () => {
	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const [events, setEvents] = useState<CalendarEvent[]>([
		{
			id: "1",
			event_date: new Date(2024, 6, 1),
			event_title: "Good Day",
			event_theme: "blue",
			event_description: "A good day to have a good day",
			event_location: "Park",
			participants: [{ name: "Alice" }, { name: "Bob" }],
			event_notes: "Don't forget to bring snacks",
			start_time: "10:00",
			end_time: "12:00",
		},
		{
			id: "2",
			event_date: new Date(2024, 6, 5),
			event_title: "Birthday",
			event_theme: "red",
			event_description: "Celebrating a birthday",
			event_location: "Restaurant",
			participants: [{ name: "Charlie" }, { name: "Dave" }],
			event_notes: "Remember to buy a gift",
			start_time: "14:00",
			end_time: "16:00",
		},
		{
			id: "3",
			event_date: new Date(2024, 6, 16),
			event_title: "Upcoming Event",
			event_description: "This is a event description",
			event_theme: "green",
			// event_theme_description: "This is a theme description",
			event_location: "Conference Hall",
			participants: [
				{
					name: "Eva",
					role: "Manager",
					notes: "Bring the presentation",
					email: "eva_martinet@exemple.com",
					phone: "1234567890",
				},
				{ name: "Frank", avatarFallback: "FM" },
				{ name: "Alexandra" },
			],
			event_notes: "Prepare the presentation",
			start_time: "09:00",
			end_time: "10:00",
		},
	]);
	const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
	const [selectedDay, setSelectedDay] = useState<Date | null>(null);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [showConsecutiveDays, setShowConsecutiveDays] = useState<boolean>(false);
	const lastHoveredDay = useRef<Date | null>(null);

	const month = currentDate.getMonth();
	const year = currentDate.getFullYear();

	const addEvent = (
		title: string,
		date: string,
		theme: string,
		description: string,
		location: string,
		startTime: string,
		endTime: string,
		participants: any[] = [],
		notes: string = ""
	): void => {
		const newEvent: CalendarEvent = {
			id: (events.length + 1).toString(),
			event_date: new Date(date),
			event_title: title,
			event_theme: theme,
			event_description: description,
			event_location: location,
			start_time: startTime,
			end_time: endTime,
			participants: participants,
			event_notes: notes,
		};
		setEvents([...events, newEvent]);
	};

	return (
		<div className="flex-col md:flex">
			<div className="w-full h-full">
				<CalendarHeader
					title={getHeaderTitle(currentDate, showConsecutiveDays)}
					toggleConsecutiveDays={() => setShowConsecutiveDays((prev) => !prev)}
					showConsecutiveDays={showConsecutiveDays}
					handlePrevMonth={() => setCurrentDate((prevDate) => subMonths(prevDate, 1))}
					handleNextMonth={() => setCurrentDate((prevDate) => addMonths(prevDate, 1))}
					handleToggleChange={setShowConsecutiveDays}
					handleSelectChange={(value) => setShowConsecutiveDays(value === "consecutive")}
					month={month}
					year={year}
				/>

				<CalendarViewSection
					currentDate={currentDate}
					events={events}
					setEvents={setEvents}
					addEvent={addEvent}
					hoveredDay={hoveredDay}
					setHoveredDay={setHoveredDay}
					selectedDay={selectedDay}
					setSelectedDay={setSelectedDay}
					isDragging={isDragging}
					setIsDragging={setIsDragging}
					showConsecutiveDays={showConsecutiveDays}
					lastHoveredDay={lastHoveredDay}
				/>
			</div>
		</div>
	);
};

export default MonthlyViewPage;
