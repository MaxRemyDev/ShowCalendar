"use client";

import React from "react";
import DashboardSection from "../components/DashboardSection";
import { SidebarContent } from "../components/SidebarContent";
import {
	BarChartIcon,
	CheckSquareIcon,
	FileTextIcon,
	HelpCircleIcon,
	HomeIcon,
	LogOutIcon,
	MailIcon,
	PieChartIcon,
	SettingsIcon,
	UsersIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const DashboardPage = () => {
	return (
		<div className="dashboard-container h-screen overflow-hidden">
			<DashboardSection
				sidebarContent={
					<SidebarContent
						isCollapsed={false}
						links={[
							{
								title: "Dashboard",
								href: "/dashboard",
								label: "",
								icon: HomeIcon,
								variant: "default",
							},
							{
								title: "Messages",
								href: "/messages",
								label: "128",
								icon: MailIcon,
								variant: "ghost",
							},
							{
								title: "Tasks",
								href: "/tasks",
								label: "9",
								icon: CheckSquareIcon,
								variant: "ghost",
							},
							{
								title: "Files",
								href: "/files",
								label: "",
								icon: FileTextIcon,
								variant: "ghost",
							},
							{
								title: "Settings",
								href: "/settings",
								label: "",
								icon: SettingsIcon,
								variant: "ghost",
								separator: (
									<div className="py-5 ">
										<Separator className="w-full" />
									</div>
								),
							},
							{
								title: "Analytics",
								href: "/analytics",
								label: "972",
								icon: BarChartIcon,
								variant: "ghost",
							},
							{
								title: "Contacts",
								href: "/contacts",
								label: "342",
								icon: UsersIcon,
								variant: "ghost",
							},
							{
								title: "Reports",
								href: "/reports",
								label: "128",
								icon: PieChartIcon,
								variant: "ghost",
							},
							{
								title: "Help",
								href: "/help",
								label: "8",
								icon: HelpCircleIcon,
								variant: "ghost",
							},
							{
								title: "Logout",
								href: "/logout",
								label: "",
								icon: LogOutIcon,
								variant: "ghost",
							},
						]}
					/>
				}
				content={<div>Content</div>}
				direction="horizontal"
				defaultCollapsed={false}
			/>
		</div>
	);
};

export default DashboardPage;
