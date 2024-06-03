"use client";

import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import { SidebarNav } from "./components/sidebar-nav";
import ContentsTitle from "@/features/dashboard/components/ContentsTitle";

export const metadata: Metadata = {
	title: "Settings - Dashboard - ShowCalendar",
	description: "Manage your account settings and preferences system.",
};

const sidebarNavItems = [
	{
		title: "Profile",
		href: "/dashboard/settings",
	},
	{
		title: "Account",
		href: "/dashboard/settings/account",
	},
	{
		title: "Appearance",
		href: "/dashboard/settings/appearance",
	},
	{
		title: "Notifications",
		href: "/dashboard/settings/notifications",
	},
	{
		title: "Display",
		href: "/dashboard/settings/display",
	},
];

interface SettingsLayoutProps {
	children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
	return (
		<div className="space-y-6 pb-16">
			<ContentsTitle
				title="Settings"
				description="Manage your account settings and preferences system."
			/>
			<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
				<aside className="-mx-4 lg:w-1/5 ">
					<SidebarNav items={sidebarNavItems} />
				</aside>

				<div className="flex-1 lg:max-w-2xl">{children}</div>
			</div>
		</div>
	);
}
