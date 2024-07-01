import * as React from "react";
import { Clock } from "lucide-react";
import { TimePickerField } from "./time-picker-field";

interface TimePickerProps {
	date: Date | undefined;
	setDate: (date: Date | undefined) => void;
	hideSeconds?: boolean;
	hideClockIcon?: boolean;
}

export function TimePicker({
	date,
	setDate,
	hideSeconds = false,
	hideClockIcon = false,
}: TimePickerProps) {
	const minuteRef = React.useRef<HTMLInputElement>(null);
	const hourRef = React.useRef<HTMLInputElement>(null);
	const secondRef = React.useRef<HTMLInputElement>(null);

	return (
		<div className="flex items-end gap-2">
			<TimePickerField
				label="Hours"
				picker="hours"
				date={date}
				setDate={setDate}
				ref={hourRef}
				onRightFocus={() => minuteRef.current?.focus()}
			/>
			<span className="flex h-10 items-center">:</span>
			<TimePickerField
				label="Minutes"
				picker="minutes"
				date={date}
				setDate={setDate}
				ref={minuteRef}
				onLeftFocus={() => hourRef.current?.focus()}
				onRightFocus={() => !hideSeconds && secondRef.current?.focus()}
			/>
			{!hideSeconds && (
				<TimePickerField
					label="Seconds"
					picker="seconds"
					date={date}
					setDate={setDate}
					ref={secondRef}
					onLeftFocus={() => minuteRef.current?.focus()}
				/>
			)}
			<div className="flex h-10 items-center">
				<Clock className={`ml-2 h-4 w-4 ${hideClockIcon ? "hidden" : ""}`} />
			</div>
		</div>
	);
}
