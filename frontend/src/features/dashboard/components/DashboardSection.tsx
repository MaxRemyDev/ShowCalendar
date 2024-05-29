"use client";

import React, { useEffect, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardBreadcrumb } from "./DashboardBreadcrumb";

const DashboardSection = ({
	sidebarContent,
	content,
	direction = "horizontal",
	defaultLayout = [20, 80],
	defaultCollapsed = false,
	navCollapsedSize = 5,
}: {
	sidebarContent?: React.ReactNode;
	content?: React.ReactNode;
	direction?: "horizontal" | "vertical";
	defaultLayout?: number[] | undefined;
	defaultCollapsed?: boolean;
	navCollapsedSize?: number;
}) => {
	const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
	const [panelSize, setPanelSize] = useState<number>(defaultLayout[0]);

	const handleCollapse = () => {
		setIsCollapsed(!isCollapsed);
		document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(!isCollapsed)}`;
	};

	useEffect(() => {
		setIsCollapsed(panelSize < 10);
		console.log(panelSize);
	}, [panelSize]);

	return (
		<TooltipProvider delayDuration={1}>
			<div className="main-content w-full h-full overflow-hidden fixed">
				<ResizablePanelGroup
					direction={direction}
					onLayout={(sizes: number[]) => {
						document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
						setPanelSize(sizes[0]);
					}}
				>
					<ResizablePanel
						defaultSize={defaultLayout[0]}
						collapsedSize={navCollapsedSize}
						collapsible={true}
						minSize={15}
						maxSize={20}
						onCollapse={handleCollapse}
						onResize={(size: number) => setPanelSize(size)}
						className={cn(
							isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
						)}
					>
						{React.cloneElement(sidebarContent as React.ReactElement<any>, {
							isCollapsed,
						})}
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={defaultLayout[1]}>
						<ScrollArea className="h-screen w-screen pt-20">
							<div className="flex h-full items-start justify-start">
								<div className="fixed z-40 bg-background w-screen h-16 border-b-[2px]">
									<DashboardBreadcrumb className="mt-5 ml-5" />
								</div>
								<div className="max-w-screen-sm h-full p-10 pt-20 lg:max-w-screen-lg lg:w-1/2">
									{content}
								</div>
							</div>
						</ScrollArea>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</TooltipProvider>
	);
};

export default DashboardSection;
