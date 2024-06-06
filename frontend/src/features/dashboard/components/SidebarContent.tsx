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

interface SidebarProps {
	links: {
		title?: string;
		href: string;
		label?: string;
		icon: LucideIcon;
		variant?: "default" | "ghost";
		separator?: React.ReactNode;
		mainLink?: boolean;
		position?: "upper" | "lower";
	}[];
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

	React.useEffect(() => {
		setHydrated(true);
	}, []);

	React.useEffect(() => {}, [isSmallScreen, isOpen, direction, hydrated]);

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

	const isLinkActive = (linkHref: string, mainLink?: boolean) => {
		if (pathname === linkHref) {
			return true;
		}

		if (pathname.startsWith(linkHref) && pathname !== linkHref) {
			return false;
		}

		if (!mainLink && pathname.startsWith(linkHref)) {
			return true;
		}

		if (mainLink && pathname.startsWith(linkHref)) {
			const remainingPath = pathname.replace(linkHref, "");
			if (remainingPath === "" || remainingPath.startsWith("/")) {
				return true;
			}
		}

		return false;
	};

	const appliedDirection = isSmallScreen ? "vertical" : direction;

	const renderLinks = (links: LinkType[]) => (
		<nav
			className={cn(
				"grid gap-1",
				!isOpen || isSmallScreen ? "justify-center" : "px-2",
				appliedDirection === "horizontal" ? "flex flex-col" : "flex flex-row"
			)}
		>
			{links.map((link: LinkType, index: number) =>
				!isOpen || isSmallScreen ? (
					<Tooltip key={`${link.title}-${index}`} delayDuration={0}>
						<TooltipTrigger asChild>
							<Link
								href={link.href}
								className={cn(
									buttonVariants({
										variant: isLinkActive(link.href, link.mainLink)
											? "default"
											: "ghost",
										size: "icon",
									}),
									"h-9 w-9"
								)}
							>
								<link.icon className="h-4 w-4" />
								<span className="sr-only">{link.title}</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent
							side={isSmallScreen ? "bottom" : "right"}
							className="flex items-center gap-4"
						>
							{link.title}
							{link.label && (
								<span className="ml-auto text-muted-foreground">{link.label}</span>
							)}
						</TooltipContent>
					</Tooltip>
				) : (
					<React.Fragment key={`${link.title}-${index}`}>
						{link.separator}
						<Link
							href={link.href}
							className={cn(
								buttonVariants({
									variant: isLinkActive(link.href, link.mainLink)
										? "default"
										: "ghost",
									size: "sm",
								}),
								"justify-start flex items-center transition-transform duration-1000",
								!isOpen || isSmallScreen
									? "opacity-0 -translate-x-4"
									: "opacity-100 translate-x-0"
							)}
						>
							<link.icon className="mr-2 h-4 w-4" />
							<span className="transition-transform duration-1000">{link.title}</span>
							{link.label && (
								<span className={cn("ml-auto", link.variant === "default" && "")}>
									{link.label}
								</span>
							)}
						</Link>
					</React.Fragment>
				)
			)}
		</nav>
	);

	return (
		<div
			className={cn(
				"group flex flex-col justify-between gap-4 py-2 px-2 pt-24 h-full",
				(!isOpen || isSmallScreen) && "items-center",
				appliedDirection === "horizontal"
					? "flex flex-col"
					: "flex flex-row justify-center gap-0 pt-20"
			)}
		>
			{/* SIDEBAR UPPER LINKS */}
			{renderLinks(upperLinks)}

			{/* SIDEBAR LOWER LINKS */}
			{renderLinks(lowerLinks)}
		</div>
	);
}
