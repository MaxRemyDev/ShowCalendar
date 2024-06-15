export interface Event {
	id: string;
	event_date: Date;
	event_title: string;
	event_theme: string;
}

export interface CalendarDayProps {
	date: number;
	month: number;
	year: number;
	events: Event[];
	showEventModal: (date: number) => void;
	updateEventPosition: (event: Event, date: number, month: number, year: number) => void;
	onDayHover: (date: number, month: number, year: number) => void;
	handleDragEnd: (event: Event, clientX: number, clientY: number) => void;
}

export interface CalendarProps {
	month: number;
	year: number;
	blankDays: number[];
	noOfDays: number[];
	events: Event[];
	showEventModal: (date: number) => void;
	updateEventPosition: (event: Event, date: number, month: number, year: number) => void;
	onDayHover: (date: number, month: number, year: number) => void;
	handleDragEnd: (event: Event, clientX: number, clientY: number) => void;
}

export interface HeaderProps {
	month: number;
	year: number;
	handlePrevMonth: () => void;
	handleNextMonth: () => void;
}
