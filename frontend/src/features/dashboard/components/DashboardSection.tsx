"use client";

import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import FixedLayout from "./FixedLayout";

const DashboardSection = ({
	sidebarContent,
	content,
}: {
	sidebarContent?: React.ReactNode;
	content?: React.ReactNode;
}) => {
	return (
		<TooltipProvider delayDuration={1}>
			<div className="main-content w-full h-full overflow-hidden fixed">
				<FixedLayout
					sidebarContent={sidebarContent}
					content={content}
					direction="horizontal"
				/>
			</div>
		</TooltipProvider>
	);
};

export default DashboardSection;
