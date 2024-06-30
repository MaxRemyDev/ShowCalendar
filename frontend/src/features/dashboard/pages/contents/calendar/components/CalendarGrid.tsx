import React from "react";
import {
	eachDayOfInterval,
	format,
	isLastDayOfMonth,
	isSameDay,
	startOfMonth,
	endOfMonth,
	addDays,
} from "date-fns";
import { CalendarEvent } from "./helpers/types";
import { getBlankDaysInMonth, DAYS_NAMES, isPastDate, isToday } from "./helpers/utils";
import PastDateIndicator from "./ui/past-date-indicator";
import { Button } from "@/components/ui/button";
import DragAndDropEvent from "./ui/drag-and-drop-event";
import { cn } from "@/lib/utils";

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
	const month = currentDate.getMonth();
	const year = currentDate.getFullYear();

	const firstDayOfMonth = startOfMonth(currentDate);
	const lastDayOfMonth = endOfMonth(currentDate);
	const daysArray = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

	const getConsecutiveDaysArray = () => {
		const startDate = currentDate;
		const endDate = addDays(startDate, 29);
		return eachDayOfInterval({ start: startDate, end: endDate });
	};

	const renderDays = () => {
		if (showConsecutiveDays) {
			return getConsecutiveDaysArray().map((date, index) => {
				const isEndOfMonth = isLastDayOfMonth(date);
				return (
					<div
						key={index}
						style={{ width: "14.28%", height: "120px" }}
						className={cn("px-4 pt-2 relative border-2 rounded-lg shadow-sm", {
							"border-dashed border-primary":
								selectedDay && isSameDay(date, selectedDay) && !isDragging,
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
									"bg-primary hover:bg-secondary text-primary-foreground":
										isToday(date) && !isEndOfMonth,
									"-ml-3 w-16 bg-background-200 dark:bg-background-100":
										isEndOfMonth && !isToday(date),
									"-ml-3 w-16 bg-primary hover:bg-secondary text-primary-foreground":
										isToday(date) && isEndOfMonth,
								}
							)}
							aria-pressed={selectedDay ? "true" : "false"}
						>
							{date.getDate()}
							{isEndOfMonth && <div className="ml-1">{format(date, "MMM")}</div>}
						</Button>
						<DragAndDropEvent
							date={date.getDate()}
							month={date.getMonth()}
							year={date.getFullYear()}
							events={events.filter((event) =>
								isSameDay(new Date(event.event_date), date)
							)}
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
			});
		} else {
			return daysArray.map((date, index) => (
				<div
					key={index}
					style={{ width: "14.28%", height: "120px" }}
					className={cn("px-4 pt-2 relative border-2 rounded-lg shadow-sm", {
						"border-dashed border-primary":
							selectedDay && isSameDay(date, selectedDay) && !isDragging,
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
								"bg-primary hover:bg-secondary text-primary-foreground":
									isToday(date) && !isLastDayOfMonth(date),
								"-ml-3 w-16 bg-background-200 dark:bg-background-100":
									isLastDayOfMonth(date) && !isToday(date),
								"-ml-3 w-16 bg-primary hover:bg-secondary text-primary-foreground":
									isToday(date) && isLastDayOfMonth(date),
							}
						)}
						aria-pressed={selectedDay ? "true" : "false"}
					>
						{date.getDate()}
						{isLastDayOfMonth(date) && (
							<div className="ml-1">{format(date, "MMM")}</div>
						)}
					</Button>
					<DragAndDropEvent
						date={date.getDate()}
						month={month}
						year={year}
						events={events.filter((event) =>
							isSameDay(new Date(event.event_date), date)
						)}
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
			));
		}
	};

	return (
		<div id="calendar-grid" className="-mx-1 -mb-1">
			<div className="flex flex-wrap" style={{ marginBottom: -40 }}>
				{DAYS_NAMES.map((day) => (
					<div key={day} style={{ width: "14.26%" }} className="px-2 py-2">
						<div className="text-foreground-600 text-sm uppercase tracking-wide font-bold text-center">
							{day}
						</div>
					</div>
				))}
			</div>
			<div className="flex flex-wrap">
				{getBlankDaysInMonth(year, month).map((_, index) => (
					<div
						key={index}
						style={{ width: "14.28%", height: "120px" }}
						className="text-center border-r border-b px-4 pt-2"
					/>
				))}
				{renderDays()}
			</div>
		</div>
	);
};

export default CalendarGrid;
