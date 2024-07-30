"use client";

import { Metadata } from "next";
import { SidebarNav } from "./components/sidebar-nav";
import ContentsTitle from "@/features/dashboard/components/ContentsTitle";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export const metadata: Metadata = {
	title: "Settings - Dashboard - ShowCalendar",
	description: "Manage your account settings and preferences system.",
};

const sidebarNavItems = [
	{
		title: "Account",
		href: "account",
	},
	{
		title: "Appearance",
		href: "appearance",
	},

	{
		title: "Display",
		href: "display",
	},
	{
		title: "Notifications",
		href: "notifications",
	},
	{
		title: "Danger Zone",
		href: "danger-zone",
		color: "text-red-500 hover:text-red-500",
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
			<Tabs defaultValue="setting-layout" className="space-y-4">
				<TabsContent value="setting-layout" className="space-y-4">
					<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
						<aside className="lg:w-1/5 ">
							<SidebarNav items={sidebarNavItems} />
						</aside>

						<div className="flex-1 lg:max-w-5xl">{children}</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
