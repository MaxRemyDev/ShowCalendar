import React from "react";
import { Separator } from "@/components/ui/separator";
import { BarChartIcon, UsersIcon, PieChartIcon, HelpCircleIcon, LogOutIcon } from "lucide-react";

export const SidebarDefaultLinks = [
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
		position: "lower" as const,
	},
	{
		title: "Contacts",
		href: "/contacts",
		label: "342",
		icon: UsersIcon,
		variant: "ghost" as const,
		position: "lower" as const,
	},
	{
		title: "Reports",
		href: "/reports",
		label: "128",
		icon: PieChartIcon,
		variant: "ghost" as const,
		position: "lower" as const,
	},
	{
		title: "Help",
		href: "/help",
		label: "8",
		icon: HelpCircleIcon,
		variant: "ghost" as const,
		position: "lower" as const,
	},
	{
		title: "Logout",
		href: "/logout",
		label: "",
		icon: LogOutIcon,
		variant: "ghost" as const,
		position: "lower" as const,
	},
];
