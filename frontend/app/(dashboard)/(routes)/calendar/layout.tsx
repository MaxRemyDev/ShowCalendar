"use client";

import { CalendarIcon, CalendarRange } from "lucide-react";
import DashboardLayout from "../../layout";
import React from "react";

const calendarLinks = [
	{
		title: "Overview",
		href: "/calendar",
		label: "",
		icon: CalendarIcon,
		variant: "default" as const,
		mainLink: true,
		separator: <div />,
	},
	{
		title: "Monthly View",
		href: "/calendar/monthly-view",
		label: "",
		icon: CalendarRange,
		variant: "default" as const,
	},
	{
		title: "Weekly View",
		href: "/calendar/weekly-view",
		label: "",
		icon: CalendarRange,
		variant: "default" as const,
	},
	{
		title: "Daily View",
		href: "/calendar/daily-view",
		label: "",
		icon: CalendarRange,
		variant: "default" as const,
	},
];

const CalendarPageLayout = ({
	children,
	contents,
}: {
	children: React.ReactNode;
	contents: React.ReactNode;
}) => {
	return (
		<DashboardLayout links={calendarLinks} contents={contents}>
			{children && null}
		</DashboardLayout>
	);
};

export default CalendarPageLayout;
