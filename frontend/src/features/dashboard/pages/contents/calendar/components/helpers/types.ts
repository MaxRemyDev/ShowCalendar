export interface HeaderProps {
	month: number;
	year: number;
	handlePrevMonth: () => void;
	handleNextMonth: () => void;
	toggleConsecutiveDays: () => void;
	showConsecutiveDays: boolean;
	handleSelectChange: (value: string) => void;
	handleToggleChange: (selected: boolean) => void;
	title: string;
}

export interface CalendarProps {
	currentDate: Date;
	events: CalendarEvent[];
	setEvents: (events: CalendarEvent[]) => void;
	addEvent: (title: string, date: string, theme: string) => void;
	hoveredDay: Date | null;
	setHoveredDay: (date: Date | null) => void;
	selectedDay: Date | null;
	setSelectedDay: (date: Date | null) => void;
	isDragging: boolean;
	setIsDragging: (isDragging: boolean) => void;
	showConsecutiveDays: boolean;
	lastHoveredDay: React.MutableRefObject<Date | null>;
}

export interface CalendarDayProps {
	date: number;
	month: number;
	year: number;
	events: CalendarEvent[];
	showEventModal: (date: Date) => void;
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
}

export interface CalendarEvent {
	id: string;
	event_date: Date;
	event_title: string;
	event_theme: string;
}

export interface DragEndParams {
	event: CalendarEvent;
	eventIndex: number;
	e: MouseEvent | TouchEvent | PointerEvent;
	rect: DOMRect;
}
