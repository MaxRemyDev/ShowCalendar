"use client";

import { Pin } from "lucide-react";
import DashboardLayout from "../../layout";
import React from "react";

const AppointmentsLinks = [
	{
		title: "Overview",
		href: "/appointments",
		label: "",
		icon: Pin,
		variant: "default" as const,
		mainLink: true,
		separator: <div />,
	},
];

const AppointmentsPageLayout = ({
	children,
	contents,
}: {
	children: React.ReactNode;
	contents: React.ReactNode;
}) => {
	return (
		<DashboardLayout links={AppointmentsLinks} contents={contents}>
			{children && null}
		</DashboardLayout>
	);
};

export default AppointmentsPageLayout;
