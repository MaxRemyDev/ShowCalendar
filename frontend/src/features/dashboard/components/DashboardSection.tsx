"use client";

import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import ResizableLayout from "./ResizableLayout";

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
				<ResizableLayout
					sidebarContent={sidebarContent}
					content={content}
					direction="horizontal"
					defaultLayout={[20, 80]}
					defaultCollapsed={false}
					navCollapsedSize={5}
				/>
			</div>
		</TooltipProvider>
	);
};

export default DashboardSection;
