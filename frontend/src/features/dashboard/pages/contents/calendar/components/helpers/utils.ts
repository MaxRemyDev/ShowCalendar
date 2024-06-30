import { tailwindColors } from "../ui/select-color-combobox";
import {
	startOfMonth,
	getDay,
	endOfMonth,
	eachDayOfInterval,
	format,
	isSameDay,
	addDays,
	startOfToday,
	subDays,
	startOfDay,
} from "date-fns";

export const getHeaderTitle = (currentDate: Date, showConsecutiveDays: boolean): string => {
	if (showConsecutiveDays) {
		const consecutiveDays = eachDayOfInterval({
			start: currentDate,
			end: addDays(currentDate, 29),
		});
		const startDate = consecutiveDays[0];
		const endDate = consecutiveDays[consecutiveDays.length - 1];
		return `${format(startDate, "MMMM d, yyyy")} - ${format(endDate, "MMMM d, yyyy")}`;
	} else {
		return `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
	}
};

export const getColorHex = (colorName: string): string => {
	const color = tailwindColors.find((c) => c.name === colorName);
	return color ? color.hex : "#000000";
};

export const isToday = (date: Date): boolean => {
	return isSameDay(new Date(), date);
};

export const isPastDate = (date: Date): boolean => {
	return date < startOfToday();
};

export const getBlankDaysInMonth = (year: number, month: number): number[] => {
	const firstDayOfMonth = startOfMonth(new Date(year, month));
	const dayOfWeek = (getDay(firstDayOfMonth) + 6) % 7;
	return Array.from({ length: dayOfWeek }, (_, i) => i + 1);
};

export const calculateNewDate = (
	x: number,
	y: number,
	calendarWidth: number,
	calendarHeight: number,
	currentDate: Date
): Date => {
	const dayWidth = calendarWidth / 7;
	const totalDaysInMonth = endOfMonth(currentDate).getDate();
	const firstDayOfMonth = startOfMonth(currentDate);
	const firstDayOfMonthWeekday = (getDay(firstDayOfMonth) + 6) % 7;

	const weeksInMonth = Math.ceil((totalDaysInMonth + firstDayOfMonthWeekday) / 7);
	const weekHeight = calendarHeight / weeksInMonth;

	if (x < 0) x = 0;
	if (x > calendarWidth) x = calendarWidth;
	if (y < 0) y = 0;
	if (y > calendarHeight) y = calendarHeight;

	const col = Math.floor(x / dayWidth);
	const row = Math.floor(y / weekHeight);

	const newDay = row * 7 + col - firstDayOfMonthWeekday + 1;

	let finalDate;
	if (newDay > 0 && newDay <= totalDaysInMonth) {
		finalDate = addDays(firstDayOfMonth, newDay - 1);
	} else if (newDay <= 0) {
		finalDate = subDays(firstDayOfMonth, Math.abs(newDay));
	} else {
		finalDate = addDays(firstDayOfMonth, newDay - totalDaysInMonth);
	}

	return finalDate;
};

export const calculateNewConsecutiveDate = (
	x: number,
	y: number,
	calendarWidth: number,
	calendarHeight: number,
	startDate: Date
): Date => {
	const dayWidth = calendarWidth / 7;
	const dayHeight = calendarHeight / 5;

	x = Math.max(0, Math.min(x, calendarWidth - 1));
	y = Math.max(0, Math.min(y, calendarHeight - 1));

	const col = Math.floor(x / dayWidth);
	const row = Math.floor(y / dayHeight);

	const newDay = row * 7 + col;

	return startOfDay(addDays(startDate, newDay));
};

export const throttle = (func: Function, delay: number) => {
	let lastCall = 0;
	return (...args: any[]) => {
		const now = new Date().getTime();
		if (now - lastCall < delay) {
			return;
		}
		lastCall = now;
		return func(...args);
	};
};

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
export const DAYS_NAMES: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
