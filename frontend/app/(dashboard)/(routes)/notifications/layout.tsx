"use client";

import { Bell } from "lucide-react";
import DashboardLayout from "../../layout";
import React from "react";

const NotificationsLinks = [
	{
		title: "Overview",
		href: "/notifications",
		label: "",
		icon: Bell,
		variant: "default" as const,
		mainLink: true,
		separator: <div />,
	},
];

const NotificationsPageLayout = ({
	children,
	contents,
}: {
	children: React.ReactNode;
	contents: React.ReactNode;
}) => {
	return (
		<DashboardLayout links={NotificationsLinks} contents={contents}>
			{children && null}
		</DashboardLayout>
	);
};

export default NotificationsPageLayout;
