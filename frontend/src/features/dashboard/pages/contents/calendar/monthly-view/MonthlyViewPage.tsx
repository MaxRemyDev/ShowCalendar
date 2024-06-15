"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CreateNewEventDialog from "./components/create-new-event-dialog";
import { cn } from "@/lib/utils";
import { Event, CalendarProps, HeaderProps } from "./helpers/types";
import {
	getDaysArray,
	getNoOfDaysInMonth,
	getBlankDaysInMonth,
	isPastDate,
	calculateNewDate,
} from "./helpers/utils";
import DragAndDropEvent from "./components/drag-and-drop-event";

// CONSTANTS
const MONTH_NAMES: string[] = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const DAYS: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// MAIN COMPONENT
const MonthlyViewPage: React.FC = () => {
	const [month, setMonth] = useState<number>(new Date().getMonth());
	const [year, setYear] = useState<number>(new Date().getFullYear());
	const [noOfDays, setNoOfDays] = useState<number[]>([]);
	const [blankDays, setBlankDays] = useState<number[]>([]);
	const [events, setEvents] = useState<Event[]>([
		{ id: "1", event_date: new Date(2024, 5, 1), event_title: "Good Day", event_theme: "blue" },
		{ id: "2", event_date: new Date(2024, 5, 5), event_title: "Birthday", event_theme: "red" },
		{
			id: "3",
			event_date: new Date(2024, 5, 16),
			event_title: "Upcoming Event",
			event_theme: "green",
		},
	]);
	const [eventDate, setEventDate] = useState<string>("");
	const [openEventModal, setOpenEventModal] = useState<boolean>(false);
	const [hoveredDay, setHoveredDay] = useState<{
		date: number;
		month: number;
		year: number;
	} | null>(null);
	const [forceRender, setForceRender] = useState<boolean>(false);

	const updateCalendar = useCallback((): void => {
		setNoOfDays(getDaysArray(getNoOfDaysInMonth(year, month)));
		setBlankDays(getBlankDaysInMonth(year, month));
	}, [month, year]);

	useEffect(() => {
		updateCalendar();
	}, [updateCalendar, forceRender]);

	const showEventModal = (date: number): void => {
		if (!isPastDate(year, month, date)) {
			setOpenEventModal(true);
			setEventDate(new Date(year, month, date).toDateString());
		}
	};

	const addEvent = (title: string, date: string, theme: string): void => {
		const newEvent: Event = {
			id: (events.length + 1).toString(),
			event_date: new Date(date),
			event_title: title,
			event_theme: theme,
		};
		setEvents([...events, newEvent]);
		setForceRender(!forceRender);
	};

	const updateEventPosition = (event: Event, date: number, month: number, year: number) => {
		const updatedEvents = events.map((e) =>
			e.id === event.id ? { ...e, event_date: new Date(year, month, date) } : e
		);
		setEvents(updatedEvents);
		setForceRender(!forceRender);
	};

	const handlePrevMonth = (): void => {
		setMonth((prevMonth: number) => {
			const newMonth = prevMonth === 0 ? 11 : prevMonth - 1;
			if (newMonth === 11) setYear((prevYear: number) => prevYear - 1);
			return newMonth;
		});
	};

	const handleNextMonth = (): void => {
		setMonth((prevMonth: number) => {
			const newMonth = prevMonth === 11 ? 0 : prevMonth + 1;
			if (newMonth === 0) setYear((prevYear: number) => prevYear + 1);
			return newMonth;
		});
	};

	const handleDayHover = (date: number, month: number, year: number) => {
		setHoveredDay({ date, month, year });
	};

	const handleDragEnd = (event: Event, clientX: number, clientY: number) => {
		const calendar = document.getElementById("calendar-grid");
		if (calendar) {
			const rect = calendar.getBoundingClientRect();
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
		setHoveredDay(null);
	};

	return (
		<div className="flex-col md:flex fixed">
			<div className="mr-10">
				<CreateNewEventDialog
					open={openEventModal}
					onOpenChange={setOpenEventModal}
					eventDate={eventDate}
					addEvent={addEvent}
				/>

				<div className="w-full h-full">
					<Header
						month={month}
						year={year}
						handlePrevMonth={handlePrevMonth}
						handleNextMonth={handleNextMonth}
					/>
					<Calendar
						month={month}
						year={year}
						blankDays={blankDays}
						noOfDays={noOfDays}
						events={events}
						showEventModal={showEventModal}
						updateEventPosition={updateEventPosition}
						onDayHover={handleDayHover}
						handleDragEnd={handleDragEnd}
					/>
				</div>
			</div>
		</div>
	);
};

// SUB-COMPONENTS
const Header: React.FC<HeaderProps> = ({ month, year, handlePrevMonth, handleNextMonth }) => (
	<div className="flex items-center justify-between py-2 px-6">
		<div>
			<span className="text-lg font-bold text-foreground">{MONTH_NAMES[month]}</span>
			<span className="ml-1 text-lg text-foreground-500 font-normal">{year}</span>
		</div>
		<div className="space-x-2">
			<Button
				className={cn(
					month === 0 && year === new Date().getFullYear()
						? "cursor-not-allowed opacity-25"
						: ""
				)}
				disabled={month === 0 && year === new Date().getFullYear()}
				onClick={handlePrevMonth}
				variant="outline"
			>
				<ChevronLeft />
			</Button>
			<Button
				className={cn(
					month === 11 && year === new Date().getFullYear() + 1
						? "cursor-not-allowed opacity-25"
						: ""
				)}
				disabled={month === 11 && year === new Date().getFullYear() + 1}
				onClick={handleNextMonth}
				variant="outline"
			>
				<ChevronRight />
			</Button>
		</div>
	</div>
);

const Calendar: React.FC<CalendarProps> = ({
	month,
	year,
	blankDays,
	noOfDays,
	events,
	showEventModal,
	updateEventPosition,
	onDayHover,
	handleDragEnd,
}) => (
	<div id="calendar-grid" className="-mx-1 -mb-1">
		<div className="flex flex-wrap" style={{ marginBottom: -40 }}>
			{DAYS.map((day, index) => (
				<div key={index} style={{ width: "14.26%" }} className="px-2 py-2">
					<div className="text-foreground-600 text-sm uppercase tracking-wide font-bold text-center">
						{day}
					</div>
				</div>
			))}
		</div>
		<div className="flex flex-wrap">
			{blankDays.map((blankday, index) => (
				<div
					key={index}
					style={{ width: "14.28%", height: "120px" }}
					className="px-4 pt-0 text-center border-2 rounded-lg shadow-sm"
				/>
			))}
			{noOfDays.map((date, index) => (
				<DragAndDropEvent
					key={index}
					date={date}
					month={month}
					year={year}
					events={events}
					showEventModal={showEventModal}
					updateEventPosition={updateEventPosition}
					onDayHover={onDayHover}
					handleDragEnd={handleDragEnd}
				/>
			))}
		</div>
	</div>
);

export default MonthlyViewPage;
