import React from "react";
import {
	eachDayOfInterval,
	isSameDay,
	startOfMonth,
	endOfMonth,
	addDays,
	startOfWeek,
} from "date-fns";
import { CalendarEvent } from "./helpers/types";
import { getBlankDaysInMonth, DAYS_NAMES, isPastDate, isToday } from "./helpers/utils";
import PastDateIndicator from "./ui/past-date-indicator";
import { Button } from "@/components/ui/button";
import DragAndDropEvent from "./ui/drag-and-drop-event";
import { cn } from "@/lib/utils";
import StripedPattern from "@/components/decoration/striped-pattern";

interface CalendarGridProps {
	currentDate: Date;
	events: CalendarEvent[];
	updateEventPosition: (event: CalendarEvent, date: Date) => void;
	onDayHover: (date: Date) => void;
	onDayClick: (date: Date) => void;
	handleDragEnd: (event: CalendarEvent, clientX: number, clientY: number) => void;
	selectedDay: Date | null;
	hoveredDay: Date | null;
	setIsDragging: (isDragging: boolean) => void;
	handleDragStart: () => void;
	isDragging: boolean;
	setSelectedDay: (date: Date | null) => void;
	showConsecutiveDays: boolean;
	startDate: Date;
	showEventModal: (date: Date) => void;
}

const isWeekend = (date: Date) => {
	const day = date.getDay();
	return day === 0 || day === 6;
};

const CalendarGrid: React.FC<CalendarGridProps> = ({
	currentDate,
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
	if (!currentDate) {
		return <div>Loading...</div>;
	}

	const getConsecutiveDaysArray = () => {
		const start = startOfWeek(startDate, { weekStartsOn: 1 });
		const end = addDays(startDate, 29);
		return eachDayOfInterval({ start, end });
	};

	const getMonthlyDaysArray = () => {
		const firstDayOfMonth = startOfMonth(currentDate);
		const lastDayOfMonth = endOfMonth(currentDate);
		return eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
	};

	const renderDayContent = (date: Date) => (
		<div
			style={{ width: "100%", height: "100%" }}
			className={cn("px-4 pt-2 relative border-2 rounded-lg shadow-sm", {
				"border-dashed border-primary": selectedDay && isSameDay(date, selectedDay),
				"border-dashed border-secondary":
					isDragging && hoveredDay && isSameDay(date, hoveredDay),
				"border-dashed border-background-700":
					hoveredDay &&
					isSameDay(date, hoveredDay) &&
					!isDragging &&
					!(selectedDay && isSameDay(date, selectedDay)),
			})}
			onMouseOver={() => onDayHover(date)}
			onDragOver={() => onDayHover(date)}
			onFocus={() => onDayHover(date)}
			onClick={() => onDayClick(date)}
			tabIndex={0}
			role="button"
			aria-pressed={selectedDay ? "true" : "false"}
		>
			<PastDateIndicator date={date} />
			<Button
				onClick={() => showEventModal(date)}
				onKeyDown={(e) => e.key === "Enter" && showEventModal(date)}
				variant="ghost"
				disabled={isPastDate(date)}
				className={cn(
					"inline-flex items-center justify-center cursor-pointer text-center leading-none rounded-full transition ease-in-out duration-100 w-8 h-8",
					{
						"bg-primary hover:bg-secondary text-primary-foreground": isToday(date),
					}
				)}
				aria-pressed={selectedDay ? "true" : "false"}
			>
				{date.getDate()}
			</Button>
			<DragAndDropEvent
				date={date.getDate()}
				month={date.getMonth()}
				year={date.getFullYear()}
				events={events.filter((event) => isSameDay(new Date(event.event_date), date))}
				updateEventPosition={updateEventPosition}
				onDayHover={onDayHover}
				onDayClick={onDayClick}
				handleDragEnd={handleDragEnd}
				selectedDay={selectedDay}
				hoveredDay={hoveredDay}
				setIsDragging={setIsDragging}
				handleDragStart={handleDragStart}
				isDragging={isDragging}
				setSelectedDay={setSelectedDay}
				showConsecutiveDays={showConsecutiveDays}
				startDate={currentDate}
				showEventModal={showEventModal}
			/>
		</div>
	);

	const renderDays = () => {
		const days = showConsecutiveDays ? getConsecutiveDaysArray() : getMonthlyDaysArray();
		return days.map((date, index) => {
			const dayContent = renderDayContent(date);
			return (
				<div key={index} className="w-[14.28%] h-[120px]">
					{isWeekend(date) ? (
						<StripedPattern className="w-full h-full">{dayContent}</StripedPattern>
					) : (
						dayContent
					)}
				</div>
			);
		});
	};

	const renderBlankDays = () => {
		const blankDays = getBlankDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
		return blankDays.map((_, index) => (
			<div
				key={index}
				className="w-[14.28%] h-[120px] text-center border-r border-b px-4 pt-2"
			/>
		));
	};

	return (
		<div id="calendar-grid" className="flex flex-wrap -mx-1 -mb-1">
			<div className="flex flex-wrap w-full mb-8">
				{DAYS_NAMES.map((day) => (
					<div key={day} className="w-[14.28%] px-2 py-2">
						<div className="text-foreground-600 text-sm uppercase tracking-wide font-bold text-center">
							{day}
						</div>
					</div>
				))}
			</div>
			<div className="flex flex-wrap w-full">
				{!showConsecutiveDays && renderBlankDays()}
				{renderDays()}
			</div>
		</div>
	);
};

export default CalendarGrid;
