"use client";

import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import DashboardSection from "@/features/dashboard/components/DashboardSection";
import { SidebarContent } from "@/features/dashboard/components/SidebarContent";
import { LucideIcon } from "lucide-react";

type Props = {
	children?: React.ReactNode;
	contents: React.ReactNode;
	links: {
		title?: string;
		href: string;
		label?: string;
		icon: LucideIcon;
		variant?: "default" | "ghost";
		separator?: React.ReactNode;
		mainLink?: boolean;
	}[];
};

const DashboardLayout = ({ children, contents, links }: Props) => {
	return (
		<div className="h-full relative overflow-hidden">
			<DashboardHeader />
			<DashboardSection
				sidebarContent={<SidebarContent isCollapsed={false} links={links} />}
				content={contents}
				direction="horizontal"
				defaultCollapsed={false}
			/>
			{children}
		</div>
	);
};

export default DashboardLayout;
