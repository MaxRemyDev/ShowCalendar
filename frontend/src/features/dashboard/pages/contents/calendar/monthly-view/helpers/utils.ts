import { tailwindColors } from "../components/select-color-combobox";

export const getColorHex = (colorName: string): string => {
	const color = tailwindColors.find((c) => c.name === colorName);
	return color ? color.hex : "#000000";
};

export const isToday = (year: number, month: number, date: number): boolean => {
	const today = new Date();
	const d = new Date(year, month, date);
	return today.toDateString() === d.toDateString();
};

export const isPastDate = (year: number, month: number, date: number): boolean => {
	const today = new Date();
	const d = new Date(year, month, date);
	return d < today && !isToday(year, month, date);
};

export const getNoOfDaysInMonth = (year: number, month: number): number => {
	return new Date(year, month + 1, 0).getDate();
};

export const getBlankDaysInMonth = (year: number, month: number): number[] => {
	const dayOfWeek = new Date(year, month, 1).getDay();
	return Array.from({ length: dayOfWeek }, (_, i) => i + 1);
};

export const getDaysArray = (noOfDays: number): number[] => {
	return Array.from({ length: noOfDays }, (_, i) => i + 1);
};

export const calculateNewDate = (
	x: number,
	y: number,
	calendarWidth: number,
	calendarHeight: number,
	month: number,
	year: number
): Date => {
	const dayWidth = calendarWidth / 7;
	const weekHeight = calendarHeight / 6;

	if (x < 0) x = 0;
	if (x > calendarWidth) x = calendarWidth;
	if (y < 0) y = 0;
	if (y > calendarHeight) y = calendarHeight;

	const col = Math.floor(x / dayWidth);
	const row = Math.floor(y / weekHeight);

	const firstDayOfMonth = new Date(year, month, 1).getDay();
	const newDay = row * 7 + col - firstDayOfMonth + 1;

	const totalDaysInMonth = getNoOfDaysInMonth(year, month);
	const finalDate =
		newDay > 0 && newDay <= totalDaysInMonth
			? new Date(year, month, newDay)
			: new Date(year, month, 1);

	return finalDate;
};
