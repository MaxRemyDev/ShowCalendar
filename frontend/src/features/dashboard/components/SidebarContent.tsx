import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { useSidebar } from "./hooks/useSidebar";
import { SidebarDefaultLinks } from "./utils/SidebarDefaultLinks";
import { motion } from "framer-motion";

interface SidebarProps {
	links: LinkType[];
	direction?: "horizontal" | "vertical";
}

interface LinkType {
	title?: string;
	href: string;
	label?: string;
	icon: LucideIcon;
	variant?: "default" | "ghost";
	separator?: React.ReactNode;
	mainLink?: boolean;
	position?: "upper" | "lower";
}

export function SidebarContent({ links, direction = "horizontal" }: SidebarProps) {
	const pathname = usePathname();
	const { isOpen } = useSidebar();
	const isSmallScreen = useMediaQuery({ maxWidth: 768 });

	const [hydrated, setHydrated] = React.useState(false);
	const [shouldShowTooltip, setShouldShowTooltip] = React.useState(false);

	React.useEffect(() => {
		setHydrated(true);
	}, []);

	// DELEY ONLY WHEN SIDEBAR IS CLOSING
	React.useEffect(() => {
		if (!isOpen) {
			const delayTimeout = setTimeout(() => {
				setShouldShowTooltip(!isOpen || isSmallScreen);
			}, 300); // 300 ms delay

			return () => clearTimeout(delayTimeout);
		} else {
			setShouldShowTooltip(isSmallScreen);
		}
	}, [isOpen, isSmallScreen]);

	if (!hydrated) {
		return null;
	}

	if (!links || links.length === 0) {
		return null;
	}

	// COMBINE DEFAULT LINKS WITH CUSTOM LINKS AND HIDDEN DEFAULT IF ON MOBILE
	const combinedLinks = isSmallScreen ? links : [...links, ...SidebarDefaultLinks];

	const upperLinks = combinedLinks.filter((link) => link.position !== "lower");
	const lowerLinks = combinedLinks.filter((link) => link.position === "lower");

	// CHECK IF LINK IS ACTIVE OR CHILD IS ACTIVE TO HIGHLIGHT
	const isLinkActive = (linkHref: string, mainLink?: boolean) => {
		const isCurrentPath = pathname === linkHref;
		const isChildPath = pathname.startsWith(linkHref) && pathname !== linkHref;

		// DO NOT ACTIVATE PARENT LINK IF A CHILD IS ACTIVE
		if (mainLink && isChildPath) {
			return false;
		}

		// ENABLE LINK IF IT IS CURRENT PATH OR A CHILD PATH
		return isCurrentPath || isChildPath;
	};

	const appliedDirection = isSmallScreen ? "vertical" : direction;

	const renderLinks = (links: LinkType[]) => (
		<nav
			className={cn(
				"grid gap-2",
				shouldShowTooltip ? "justify-center" : "px-2",
				appliedDirection === "horizontal" ? "flex flex-col" : "flex flex-row space-x-2"
			)}
		>
			{links.map((link: LinkType, index: number) => {
				const active = isLinkActive(link.href, link.mainLink);
				return shouldShowTooltip ? (
					<Tooltip key={`${link.title}-${index}`} delayDuration={0}>
						{link.separator}
						<TooltipTrigger asChild>
							<Link
								href={link.href}
								className={cn(
									buttonVariants({
										variant: active ? "default" : "ghost",
										size: "icon",
									}),
									"relative h-9 w-9"
								)}
							>
								<div>
									<link.icon className="h-4 w-4" />
									{link.label && (
										<span
											className={cn(
												"absolute top-0 right-0 -mt-1 -mr-2 text-white text-xs rounded-full flex justify-center items-center min-w-[1rem] h-4 px-1 z-[52]",
												active ? "bg-secondary" : "bg-primary"
											)}
										>
											{link.label}
										</span>
									)}
								</div>
							</Link>
						</TooltipTrigger>
						<TooltipContent
							side={isSmallScreen ? "bottom" : "right"}
							className="flex items-center gap-4 z-[51]"
						>
							{link.title}
						</TooltipContent>
					</Tooltip>
				) : (
					<React.Fragment key={`${link.title}-${index}`}>
						{link.separator}
						<Link
							href={link.href}
							className={cn(
								buttonVariants({
									variant: active ? "default" : "ghost",
									size: "sm",
								}),
								"justify-start flex items-center overflow-hidden"
							)}
						>
							<div className="-ml-[0.11rem]">
								<link.icon className="h-4 w-4" />
							</div>

							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 1 }}
								className="flex w-full justify-between mx-4"
							>
								<span className="truncate">{link.title}</span>
								{link.label && (
									<span className={cn("", link.variant === "default" && "")}>
										{link.label}
									</span>
								)}
							</motion.div>
						</Link>
					</React.Fragment>
				);
			})}
		</nav>
	);

	return (
		<div
			className={cn(
				"group flex flex-col justify-between gap-4 py-4 h-full",
				shouldShowTooltip && "items-start pl-2",
				appliedDirection === "horizontal"
					? "flex flex-col pt-24"
					: "flex flex-row justify-center gap-0 max-sm:pt-20 max-lg:pt-24"
			)}
		>
			{/* SIDEBAR UPPER LINKS */}
			{renderLinks(upperLinks)}

			{/* SIDEBAR LOWER LINKS */}
			{renderLinks(lowerLinks)}
		</div>
	);
}
