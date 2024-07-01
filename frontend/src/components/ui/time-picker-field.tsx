import * as React from "react";
import { Label } from "@/components/ui/label";
import { TimePickerInput, TimePickerInputProps } from "./time-picker-input";

interface TimePickerFieldProps extends Omit<TimePickerInputProps, "date" | "setDate"> {
	label: string;
	date: Date | undefined;
	setDate: (date: Date | undefined) => void;
}

const TimePickerField = React.forwardRef<HTMLInputElement, TimePickerFieldProps>(
	({ label, date, setDate, ...props }, ref) => {
		return (
			<div className="grid gap-1 text-center">
				<Label htmlFor={props.picker} className="text-xs">
					{label}
				</Label>
				<TimePickerInput date={date} setDate={setDate} ref={ref} {...props} />
			</div>
		);
	}
);

TimePickerField.displayName = "TimePickerField";

export { TimePickerField };
