import React from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const DashboardSection = ({
	sidebarContent,
	content,
	sidebarSize = 25,
	contentSize = 75,
	direction = "horizontal",
}: {
	sidebarContent: React.ReactNode;
	content: React.ReactNode;
	sidebarSize?: number;
	contentSize?: number;
	direction?: "horizontal" | "vertical";
}) => {
	return (
		<div className="dashboard-container">
			<div className="main-content w-full h-screen">
				<ResizablePanelGroup direction={direction}>
					<ResizablePanel defaultSize={sidebarSize}>
						<div className="flex h-full items-center justify-center p-6">
							{sidebarContent}
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={contentSize}>
						<div className="flex h-full items-center justify-center p-6">{content}</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	);
};

export default DashboardSection;
