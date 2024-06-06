import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardBreadcrumb } from "./DashboardBreadcrumb";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "react-responsive";
import { useSidebar } from "./hooks/useSidebar";
import { motion } from "framer-motion";

interface FixedLayoutProps {
	sidebarContent: React.ReactNode;
	content: React.ReactNode;
	direction?: "horizontal" | "vertical";
}

const FixedLayout: React.FC<FixedLayoutProps> = ({
	sidebarContent,
	content,
	direction = "horizontal",
}) => {
	const { isOpen, toggle } = useSidebar();
	const isSmallScreen = useMediaQuery({ maxWidth: 768 });

	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setHydrated(true);
	}, []);

	const handleCollapse = () => {
		toggle();
		document.cookie = `fixed-layout:collapsed=${JSON.stringify(!isOpen)}`;
	};

	const getAppliedDirection = () => {
		return isSmallScreen ? "vertical" : direction;
	};

	if (!hydrated) {
		return null;
	}

	if (!content) {
		return null;
	}

	const appliedDirection = getAppliedDirection();
	const sidebarClasses = isSmallScreen
		? "w-full h-auto"
		: isOpen
		? "w-[250px] min-w-[250px]"
		: "w-[50px] min-w-[50px]";

	return (
		<div
			className={cn(
				"flex h-full w-full",
				appliedDirection === "horizontal" ? "flex-row" : "flex-col"
			)}
		>
			{/* SIDEBAR */}
			<div
				className={cn(
					"relative transition-all duration-500 ease-in-out bg-background",
					sidebarClasses,
					appliedDirection === "horizontal" ? "border-r-2" : "border-b-2"
				)}
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
						"absolute transform p-2 rounded-l-md bg-background z-[51]",
						isSmallScreen
							? "top-0 left-1/2 -translate-x-1/2 mt-2"
							: "top-1/2 -translate-y-1/2 -right-5"
					)}
					variant="outline"
				>
					{isOpen ? <ChevronLeft /> : <ChevronRight />}
				</Button>
			</div>

			{/* CONTENT PAGE */}
			<div className="flex-grow h-full w-full z-40 overflow-hidden">
				<ScrollArea
					className={cn(
						"h-full w-full z-50",
						appliedDirection === "horizontal" ? "overflow-x-auto" : "overflow-y-auto"
					)}
				>
					<div className="h-full w-full flex flex-col items-start justify-start">
						<div
							className={cn(
								"fixed z-40 bg-background w-full h-16",
								appliedDirection === "horizontal" ? "border-b-2 mt-20" : "hidden"
							)}
						>
							<DashboardBreadcrumb className="mt-5 ml-5 " />
						</div>
						<div
							className={cn(
								"p-10 w-full flex-grow",
								appliedDirection === "horizontal" ? "pt-40" : "pt-5"
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
