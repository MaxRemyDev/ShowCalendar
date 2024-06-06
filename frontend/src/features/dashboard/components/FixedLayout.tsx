import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardBreadcrumb } from "./DashboardBreadcrumb";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "react-responsive";
import { useSidebar } from "./hooks/useSidebar";

interface FixedLayoutProps {
	sidebarContent: React.ReactNode;
	content: React.ReactNode;
	direction?: "horizontal" | "vertical";
	defaultLayout?: number;
}

const FixedLayout: React.FC<FixedLayoutProps> = ({
	sidebarContent,
	content,
	direction = "horizontal",
	defaultLayout = 15,
}) => {
	const { isOpen, toggle } = useSidebar();
	const isSmallScreen = useMediaQuery({ maxWidth: 768 });

	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setHydrated(true);
		console.log("Component has been hydrated");
	}, []);

	const handleCollapse = () => {
		toggle();
		document.cookie = `fixed-layout:collapsed=${JSON.stringify(!isOpen)}`;
		console.log("Sidebar toggled:", !isOpen);
	};

	const appliedDirection = isSmallScreen ? "vertical" : direction;

	if (!hydrated) {
		console.log("Component not hydrated yet");
		return null;
	}

	if (!content) {
		console.log("Content is not defined");
		return null;
	}

	console.log("Rendering FixedLayout with props:", {
		sidebarContent,
		content,
		direction,
		defaultLayout,
		isOpen,
		isSmallScreen,
		appliedDirection,
	});

	return (
		<div
			className={cn(
				"Fixed-Layout flex h-full w-full",
				appliedDirection === "horizontal" ? "flex-row" : "flex-col"
			)}
		>
			<div
				className={cn(
					"Sidebar-Content relative transition-all duration-300 ease-in-out bg-background-50",
					isOpen ? `w-[${defaultLayout}%]` : "w-[50px]",
					"min-w-[50px]",
					isSmallScreen && "w-full h-auto",
					appliedDirection === "horizontal" ? "flex-row" : "flex-col"
				)}
				style={{
					width: isSmallScreen ? "100%" : isOpen ? `${defaultLayout}%` : "50px",
					height: isSmallScreen ? "auto" : "100%",
				}}
			>
				{React.isValidElement(sidebarContent) ? (
					React.cloneElement(sidebarContent as React.ReactElement<any>, {
						isOpen,
						isSmallScreen,
					})
				) : (
					<div>No Sidebar Content</div>
				)}
				<Button
					onClick={handleCollapse}
					className={cn(
						"absolute transform p-2 rounded-l-md",
						isSmallScreen
							? "top-0 left-1/2 -translate-x-1/2 mt-2"
							: "top-1/2 right-0 -translate-y-1/2"
					)}
					variant="ghost"
				>
					{isOpen ? <ChevronLeft /> : <ChevronRight />}
				</Button>
			</div>
			<div className="flex-grow h-full w-full z-40 overflow-hidden">
				<ScrollArea
					className={cn(
						"h-full w-full z-50",
						appliedDirection === "horizontal" ? "overflow-x-auto" : "overflow-y-auto"
					)}
				>
					<div className="h-full w-full flex flex-col items-start justify-start">
						<div className="Dashboard-Breadcrumb-class fixed z-40 bg-background w-full h-16 border-b-[2px]">
							<DashboardBreadcrumb className="mt-5 ml-5 " />
						</div>
						<div
							className={cn(
								"Content-class p-10 w-full flex-grow",
								appliedDirection === "horizontal" ? "pt-28" : "pt-20"
							)}
						>
							{content}
						</div>
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};

export default FixedLayout;
