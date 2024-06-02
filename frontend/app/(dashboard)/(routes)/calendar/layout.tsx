"use client";

import { CalendarIcon } from "lucide-react";
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
