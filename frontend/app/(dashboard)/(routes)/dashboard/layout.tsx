"use client";

import { Separator } from "@/components/ui/separator";
import {
	LayoutDashboard,
	MailIcon,
	CheckSquareIcon,
	FileTextIcon,
	SettingsIcon,
	BarChartIcon,
	UsersIcon,
	PieChartIcon,
	HelpCircleIcon,
	LogOutIcon,
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
	},
	{
		title: "Messages",
		href: "/dashboard/messages",
		label: "128",
		icon: MailIcon,
		variant: "ghost" as const,
	},
	{
		title: "Tasks",
		href: "/dashboard/tasks",
		label: "9",
		icon: CheckSquareIcon,
		variant: "ghost" as const,
	},
	{
		title: "Files",
		href: "/dashboard/files",
		label: "",
		icon: FileTextIcon,
		variant: "ghost" as const,
	},
	{
		title: "Settings",
		href: "/dashboard/settings",
		label: "",
		icon: SettingsIcon,
		variant: "ghost" as const,
		separator: <div />,
	},
	{
		title: "Analytics",
		href: "/analytics",
		label: "972",
		icon: BarChartIcon,
		variant: "ghost" as const,
		separator: (
			<div className="py-5">
				<Separator className="w-full" />
			</div>
		),
	},
	{
		title: "Contacts",
		href: "/contacts",
		label: "342",
		icon: UsersIcon,
		variant: "ghost" as const,
	},
	{
		title: "Reports",
		href: "/reports",
		label: "128",
		icon: PieChartIcon,
		variant: "ghost" as const,
	},
	{ title: "Help", href: "/help", label: "8", icon: HelpCircleIcon, variant: "ghost" as const },
	{ title: "Logout", href: "/logout", label: "", icon: LogOutIcon, variant: "ghost" as const },
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
