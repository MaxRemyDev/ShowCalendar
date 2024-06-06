import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { DashboardRoutes } from "./utils/DashboardRoutes";
import { useMediaQuery } from "react-responsive";
import { useSidebar } from "./hooks/useSidebar";

interface SidebarProps {
	links: {
		title?: string;
		href: string;
		label?: string;
		icon: LucideIcon;
		variant?: "default" | "ghost";
		separator?: React.ReactNode;
		mainLink?: boolean;
	}[];
	direction?: "horizontal" | "vertical";
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

	const separatorIndex = links.findIndex((link) => link.separator);
	const upperLinks = links.slice(0, separatorIndex + 1);
	const lowerLinks = links.slice(separatorIndex + 1);

	const isLinkActive = (linkHref: string, mainLink?: boolean) => {
		const isDashboardRoute = DashboardRoutes.some((route) => pathname.startsWith(route.href));

		if (isDashboardRoute && linkHref === pathname.split("/").slice(0, 2).join("/")) {
			return false;
		}

		if (pathname === linkHref) {
			return true;
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

	return (
		<div
			className={cn(
				"group flex flex-col justify-between gap-4 py-2 pt-24 h-full",
				(!isOpen || isSmallScreen) && "items-center",
				appliedDirection === "horizontal" ? "flex flex-col" : "flex flex-row"
			)}
		>
			<nav
				className={cn(
					"grid gap-1",
					!isOpen || isSmallScreen ? "justify-center" : "px-2",
					appliedDirection === "horizontal" ? "flex flex-col" : "flex flex-row"
				)}
			>
				{upperLinks.map((link, index) =>
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
									<span className="ml-auto text-muted-foreground">
										{link.label}
									</span>
								)}
							</TooltipContent>
						</Tooltip>
					) : (
						<React.Fragment key={`${link.title}-${index}`}>
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
								<span className="transition-transform duration-1000">
									{link.title}
								</span>
								{link.label && (
									<span
										className={cn("ml-auto", link.variant === "default" && "")}
									>
										{link.label}
									</span>
								)}
							</Link>
							{link.separator}
						</React.Fragment>
					)
				)}
			</nav>
			<nav
				className={cn(
					"grid gap-1",
					!isOpen || isSmallScreen ? "justify-center" : "px-2",
					appliedDirection === "horizontal" ? "flex flex-col" : "flex flex-row"
				)}
			>
				{lowerLinks.map((link, index) =>
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
								className="flex items-center gap-4 z-50"
							>
								{link.title}
								{link.label && (
									<span className="ml-auto text-muted-foreground">
										{link.label}
									</span>
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
								<span className="transition-transform duration-1000">
									{link.title}
								</span>
								{link.label && (
									<span
										className={cn("ml-auto", link.variant === "default" && "")}
									>
										{link.label}
									</span>
								)}
							</Link>
						</React.Fragment>
					)
				)}
			</nav>
		</div>
	);
}
