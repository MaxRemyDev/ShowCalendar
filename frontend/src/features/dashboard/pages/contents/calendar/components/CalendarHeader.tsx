"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { HeaderProps } from "./helpers/types";

const CalendarHeader: React.FC<HeaderProps & { title: string }> = ({
	title,
	handlePrevMonth,
	handleNextMonth,
	toggleConsecutiveDays,
	showConsecutiveDays,
	handleSelectChange,
	handleToggleChange,
	month,
	year,
}) => (
	<div className="flex items-center justify-between py-5 px-6">
		<div>
			<span className="text-lg font-bold text-foreground">{title}</span>
			{!title.includes("-") && (
				<span className="ml-1 text-lg text-foreground-500 font-normal">{year}</span>
			)}
		</div>
		<div className="space-x-2 flex items-center">
			<Select
				value={showConsecutiveDays ? "consecutive" : "monthly"}
				defaultValue={"consecutive"}
				onValueChange={handleSelectChange}
			>
				<SelectTrigger>
					{showConsecutiveDays ? "Consecutive Days" : "Monthly View"}
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="monthly">
						Monthly View
						{showConsecutiveDays}
					</SelectItem>
					<SelectItem value="consecutive">
						Consecutive Days
						{!showConsecutiveDays}
					</SelectItem>
				</SelectContent>
			</Select>
			<Button onClick={handlePrevMonth} variant="outline">
				<ChevronLeft />
			</Button>
			<Button onClick={handleNextMonth} variant="outline">
				<ChevronRight />
			</Button>
		</div>
	</div>
);

export default CalendarHeader;
