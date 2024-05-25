import * as React from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import timeZoneData from "../data/time-zone";

export function SelectScrollableTimeZone() {
	return (
		<Select>
			<SelectTrigger className="w-[280px]">
				<SelectValue placeholder="Select a timezone" />
			</SelectTrigger>
			<SelectContent>
				{Object.entries(timeZoneData).map(([key, { label, options }]) => (
					<SelectGroup key={key}>
						<SelectLabel>{label}</SelectLabel>
						{options.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectGroup>
				))}
			</SelectContent>
		</Select>
	);
}
