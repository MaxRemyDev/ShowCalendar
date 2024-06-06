"use client";

import {
	LayoutDashboard,
	MailIcon,
	CheckSquareIcon,
	FileTextIcon,
	SettingsIcon,
} from "lucide-react";
import DashboardLayout from "../../layout";

const dashboardLinks = [
	{
		title: "Overview",
		href: "/dashboard",
		label: "",
		icon: LayoutDashboard,
		variant: "default" as const,
		mainLink: true,
		position: "upper",
	},
	{
		title: "Messages",
		href: "/dashboard/messages",
		label: "128",
		icon: MailIcon,
		variant: "ghost" as const,
		position: "upper",
	},
	{
		title: "Tasks",
		href: "/dashboard/tasks",
		label: "9",
		icon: CheckSquareIcon,
		variant: "ghost" as const,
		position: "upper",
	},
	{
		title: "Files",
		href: "/dashboard/files",
		label: "",
		icon: FileTextIcon,
		variant: "ghost" as const,
		position: "upper",
	},
	{
		title: "Settings",
		href: "/dashboard/settings",
		label: "",
		icon: SettingsIcon,
		variant: "ghost" as const,
		separator: <div />,
		position: "upper",
	},
];

const DashboardPageLayout = ({
	contents,
	children,
}: {
	contents: React.ReactNode;
	children: React.ReactNode;
}) => {
	return (
		<DashboardLayout links={dashboardLinks} contents={contents}>
			{children && null}
		</DashboardLayout>
	);
};

export default DashboardPageLayout;
