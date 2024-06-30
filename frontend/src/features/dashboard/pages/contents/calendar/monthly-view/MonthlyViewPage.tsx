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
		{ id: "1", event_date: new Date(2024, 5, 1), event_title: "Good Day", event_theme: "blue" },
		{ id: "2", event_date: new Date(2024, 5, 5), event_title: "Birthday", event_theme: "red" },
		{
			id: "3",
			event_date: new Date(2024, 5, 16),
			event_title: "Upcoming Event",
			event_theme: "green",
		},
	]);
	const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
	const [selectedDay, setSelectedDay] = useState<Date | null>(null);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [showConsecutiveDays, setShowConsecutiveDays] = useState<boolean>(false);
	const lastHoveredDay = useRef<Date | null>(null);

	const month = currentDate.getMonth();
	const year = currentDate.getFullYear();

	const addEvent = (title: string, date: string, theme: string): void => {
		const newEvent: CalendarEvent = {
			id: (events.length + 1).toString(),
			event_date: new Date(date),
			event_title: title,
			event_theme: theme,
		};
		setEvents([...events, newEvent]);
	};

	return (
		<div className="flex-col md:flex fixed">
			<div className="mr-10">
				<div className="w-full h-full">
					<CalendarHeader
						title={getHeaderTitle(currentDate, showConsecutiveDays)}
						toggleConsecutiveDays={() => setShowConsecutiveDays((prev) => !prev)}
						showConsecutiveDays={showConsecutiveDays}
						handlePrevMonth={() => setCurrentDate((prevDate) => subMonths(prevDate, 1))}
						handleNextMonth={() => setCurrentDate((prevDate) => addMonths(prevDate, 1))}
						handleToggleChange={setShowConsecutiveDays}
						handleSelectChange={(value) =>
							setShowConsecutiveDays(value === "consecutive")
						}
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
		</div>
	);
};

export default MonthlyViewPage;
