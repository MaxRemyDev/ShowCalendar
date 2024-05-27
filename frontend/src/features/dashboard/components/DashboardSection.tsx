"use client";

import React, { useEffect, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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

	//TODO: NEED MORE RESPONSIVE SIDEBAR COLLAPSED TO ADD LOGIC FOR DIFFERENT SCREEN SIZE TO COLLAPSE TO SAME LOCATION WITH PANELSIZE
	//INFO: FOR EXAMPLE IF SIZE IS 15 ON "XL SCREEN", SIDEBAR WILL NORMALLY COLLAPSE TO RIGHT PLACE
	//INFO: BUT IF SCREEN IS "MD", SIDEBAR IS SET TO 10, PANEL SIZE IT DOES NOT REDUCE TO SAME LOCATION AS ON “XL SCREEN”
	useEffect(() => {
		setIsCollapsed(panelSize < 10);
		console.log(panelSize);
	}, [panelSize]);

	return (
		<TooltipProvider delayDuration={0}>
			<div className="main-content w-full h-full overflow-hidden">
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
						<div className="flex h-full items-center justify-center p-6">{content}</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</TooltipProvider>
	);
};

export default DashboardSection;
