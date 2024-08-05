import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { DateInput, DateSegment } from "./minimal-date-field";
import { FieldError, FieldGroup, Label } from "./field";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { useState, useEffect } from "react";
import { format, parse, parseISO } from "date-fns";
import { CalendarDate, DateValue } from "@internationalized/date";
import {
	DatePicker as AriaDatePicker,
	DatePickerProps as AriaDatePickerProps,
	DateRangePicker as AriaDateRangePicker,
	DateRangePickerProps as AriaDateRangePickerProps,
	ValidationResult as AriaValidationResult,
	Text,
} from "react-aria-components";

const DatePicker = AriaDatePicker;
const DateRangePicker = AriaDateRangePicker;

const DatePickerContent = ({
	className,
	popoverClassName,
	children,
	...props
}: Readonly<{
	className?: string;
	popoverClassName?: string;
	children?: React.ReactNode;
}>) => (
	<Popover>
		<PopoverTrigger asChild>
			<Button
				variant="ghost"
				size="icon"
				className="mr-1 size-6 data-[focus-visible]:ring-offset-0"
			>
				<CalendarIcon aria-hidden className="size-4" />
			</Button>
		</PopoverTrigger>
		<PopoverContent className={cn("w-auto p-3", popoverClassName)} {...props}>
			<div
				role="dialog"
				className={cn(
					"flex w-full flex-col space-y-4 outline-none sm:flex-row sm:space-x-4 sm:space-y-0",
					className
				)}
			>
				{children}
			</div>
		</PopoverContent>
	</Popover>
);

interface MinimalDatePickerProps extends Readonly<AriaDatePickerProps<DateValue>> {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: AriaValidationResult) => string);
}

function MinimalDatePicker({
	label,
	description,
	errorMessage,
	className,
	value,
	onChange,
	...props
}: MinimalDatePickerProps) {
	const [date, setDate] = useState<DateValue | undefined>(value ?? undefined);
	const [month, setMonth] = useState<Date | undefined>(
		date ? new Date(date.toString()) : undefined
	);

	useEffect(() => {
		setDate(value ?? undefined);
		setMonth(value ? new Date(value.toString()) : undefined);
	}, [value]);

	const handleDateChange = (selectedDate: DateValue | undefined) => {
		if (selectedDate) {
			try {
				const isoString = new Date(selectedDate.toString()).toISOString();
				const parsedDate = parseISO(isoString);
				const calendarDate = new CalendarDate(
					parsedDate.getFullYear(),
					parsedDate.getMonth() + 1,
					parsedDate.getDate()
				) as DateValue;
				setDate(calendarDate);
				setMonth(new Date(calendarDate.toString()));
				if (onChange) onChange(calendarDate);
			} catch (error) {
				console.error("Selected date is invalid:", selectedDate, error);
			}
		} else {
			console.error("Selected date is invalid:", selectedDate);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value) {
			try {
				const parsedDate = parse(value, "yyyy-MM-dd", new Date());
				const isoString = parsedDate.toISOString();
				const calendarDate = new CalendarDate(
					parsedDate.getFullYear(),
					parsedDate.getMonth() + 1,
					parsedDate.getDate()
				) as DateValue;
				setDate(calendarDate);
				setMonth(parsedDate);
				if (onChange) onChange(calendarDate);
			} catch (error) {
				console.error("Input date is invalid:", value, error);
			}
		}
	};

	const handleMonthChange = (newMonth: Date) => {
		setMonth(newMonth);
	};

	const formattedDate = date ? format(new Date(date.toString()), "yyyy-MM-dd") : "";

	return (
		<DatePicker
			className={cn("group flex flex-col gap-2", className)}
			value={date}
			onChange={handleDateChange as any}
			{...props}
		>
			<Label>{label}</Label>
			<FieldGroup>
				<DateInput
					className="flex-1"
					variant="ghost"
					value={formattedDate}
					onChange={handleInputChange}
				>
					{(segment) => <DateSegment segment={segment} />}
				</DateInput>
				<DatePickerContent>
					<Calendar
						mode="single"
						selected={date ? new Date(date.toString()) : undefined}
						onSelect={handleDateChange}
						month={month}
						onMonthChange={handleMonthChange}
					/>
				</DatePickerContent>
			</FieldGroup>
			{description && (
				<Text className="text-sm text-muted-foreground" slot="description">
					{description}
				</Text>
			)}
			<FieldError>
				{typeof errorMessage === "function"
					? errorMessage({} as AriaValidationResult)
					: errorMessage}
			</FieldError>
		</DatePicker>
	);
}

interface MinimalDateRangePickerProps extends Readonly<AriaDateRangePickerProps<DateValue>> {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: AriaValidationResult) => string);
}

function MinimalDateRangePicker({
	label,
	description,
	errorMessage,
	className,
	...props
}: MinimalDateRangePickerProps) {
	const [range, setRange] = useState<{
		start: DateValue | undefined;
		end: DateValue | undefined;
	}>({
		start: props.value?.start ?? undefined,
		end: props.value?.end ?? undefined,
	});
	const [month, setMonth] = useState<Date | undefined>(
		range.start ? new Date(range.start.toString()) : undefined
	);

	const handleRangeChange = (selectedRange: {
		start: DateValue | undefined;
		end: DateValue | undefined;
	}) => {
		if (selectedRange.start && selectedRange.end) {
			try {
				const startISO = new Date(selectedRange.start.toString()).toISOString();
				const endISO = new Date(selectedRange.end.toString()).toISOString();
				const startParsedDate = parseISO(startISO);
				const endParsedDate = parseISO(endISO);

				const startCalendarDate = new CalendarDate(
					startParsedDate.getFullYear(),
					startParsedDate.getMonth() + 1,
					startParsedDate.getDate()
				) as DateValue;
				const endCalendarDate = new CalendarDate(
					endParsedDate.getFullYear(),
					endParsedDate.getMonth() + 1,
					endParsedDate.getDate()
				) as DateValue;

				setRange({
					start: startCalendarDate,
					end: endCalendarDate,
				});
				setMonth(new Date(startCalendarDate.toString()));
			} catch (error) {
				console.error(
					"Selected range does not have valid start and end dates:",
					selectedRange,
					error
				);
			}
		} else {
			console.error("Selected range does not have valid start and end dates:", selectedRange);
		}
	};

	const handleStartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value) {
			try {
				const parsedDate = parse(value, "yyyy-MM-dd", new Date());
				const isoString = parsedDate.toISOString();
				const calendarDate = new CalendarDate(
					parsedDate.getFullYear(),
					parsedDate.getMonth() + 1,
					parsedDate.getDate()
				) as DateValue;
				setRange((prevRange) => ({
					...prevRange,
					start: calendarDate,
				}));
				setMonth(parsedDate);
			} catch (error) {
				console.error("Start input date is invalid:", value, error);
			}
		}
	};

	const handleEndInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value) {
			try {
				const parsedDate = parse(value, "yyyy-MM-dd", new Date());
				const isoString = parsedDate.toISOString();
				const calendarDate = new CalendarDate(
					parsedDate.getFullYear(),
					parsedDate.getMonth() + 1,
					parsedDate.getDate()
				) as DateValue;
				setRange((prevRange) => ({
					...prevRange,
					end: calendarDate,
				}));
			} catch (error) {
				console.error("End input date is invalid:", value, error);
			}
		}
	};

	const handleMonthChange = (newMonth: Date) => {
		setMonth(newMonth);
	};

	const formattedStartDate = range.start
		? format(new Date(range.start.toString()), "yyyy-MM-dd")
		: "";
	const formattedEndDate = range.end ? format(new Date(range.end.toString()), "yyyy-MM-dd") : "";
	console.log(
		"Rendering MinimalDateRangePicker with range:",
		formattedStartDate,
		formattedEndDate
	);

	return (
		<DateRangePicker
			className={cn("group flex flex-col gap-2", className)}
			value={{ start: range.start as DateValue, end: range.end as DateValue }}
			onChange={handleRangeChange as any}
			{...props}
		>
			<Label>{label}</Label>
			<FieldGroup>
				<DateInput
					variant="ghost"
					slot={"start"}
					value={formattedStartDate}
					onChange={handleStartInputChange}
				>
					{(segment) => <DateSegment segment={segment} />}
				</DateInput>
				<span aria-hidden className="px-2 text-sm text-muted-foreground">
					-
				</span>
				<DateInput
					className="flex-1"
					variant="ghost"
					slot={"end"}
					value={formattedEndDate}
					onChange={handleEndInputChange}
				>
					{(segment) => <DateSegment segment={segment} />}
				</DateInput>
				<DatePickerContent>
					<Calendar
						mode="range"
						selected={{
							start: range.start ? new Date(range.start.toString()) : undefined,
							end: range.end ? new Date(range.end.toString()) : undefined,
						}}
						onSelect={handleRangeChange}
						month={month}
						onMonthChange={handleMonthChange}
					/>
				</DatePickerContent>
			</FieldGroup>
			{description && (
				<Text className="text-sm text-muted-foreground" slot="description">
					{description}
				</Text>
			)}
			<FieldError>
				{typeof errorMessage === "function"
					? errorMessage({} as AriaValidationResult)
					: errorMessage}
			</FieldError>
		</DateRangePicker>
	);
}

export {
	DatePicker,
	DatePickerContent,
	DateRangePicker,
	MinimalDatePicker,
	MinimalDateRangePicker,
};
export type { MinimalDatePickerProps, MinimalDateRangePickerProps };
