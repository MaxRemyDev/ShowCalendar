"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";
import React from "react";
import { usePathname } from "next/navigation";

interface SidebarProps {
	isCollapsed: boolean;
	links: {
		title?: string;
		href: string;
		label?: string;
		icon: LucideIcon;
		variant?: "default" | "ghost";
		separator?: React.ReactNode;
	}[];
}

export function SidebarContent({ links, isCollapsed }: SidebarProps) {
	const pathname = usePathname();

	const upperLinks = links.slice(0, links.findIndex((link) => link.separator) + 1);
	const lowerLinks = links.slice(links.findIndex((link) => link.separator) + 1);

	return (
		<div
			className={cn(
				"group flex flex-col justify-between gap-4 py-2 pt-24 h-full",
				isCollapsed && "items-center"
			)}
		>
			<nav className={cn("grid gap-1", isCollapsed ? "justify-center" : "px-2")}>
				{upperLinks.map((link, index) =>
					isCollapsed ? (
						<Tooltip key={index} delayDuration={0}>
							<TooltipTrigger asChild>
								<>
									<Link
										href={link.href}
										className={cn(
											buttonVariants({
												variant:
													pathname === link.href ? "default" : "ghost",
												size: "icon",
											}),
											"h-9 w-9"
										)}
									>
										<link.icon className="h-4 w-4" />
										<span className="sr-only">{link.title}</span>
									</Link>
									{link.separator}
								</>
							</TooltipTrigger>
							<TooltipContent side="right" className="flex items-center gap-4">
								{link.title}
								{link.label && (
									<span className="ml-auto text-muted-foreground">
										{link.label}
									</span>
								)}
							</TooltipContent>
						</Tooltip>
					) : (
						<React.Fragment key={index}>
							<Link
								href={link.href}
								className={cn(
									buttonVariants({
										variant: pathname === link.href ? "default" : "ghost",
										size: "sm",
									}),
									"justify-start flex items-center"
								)}
							>
								<link.icon className="mr-2 h-4 w-4" />
								{link.title}
								{link.label && (
									<span
										className={cn("ml-auto", link.variant === "default" && "")}
									>
										{link.label}
									</span>
								)}
							</Link>
							<div>{link.separator}</div>
						</React.Fragment>
					)
				)}
			</nav>
			<nav className={cn("grid gap-1", isCollapsed ? "justify-center" : "px-2")}>
				{lowerLinks.map((link, index) =>
					isCollapsed ? (
						<Tooltip key={index} delayDuration={0}>
							<TooltipTrigger asChild>
								<>
									<Link
										href={link.href}
										className={cn(
											buttonVariants({
												variant:
													pathname === link.href ? "default" : "ghost",
												size: "icon",
											}),
											"h-9 w-9"
										)}
									>
										<link.icon className="h-4 w-4" />
										<span className="sr-only">{link.title}</span>
									</Link>
									{link.separator}
								</>
							</TooltipTrigger>
							<TooltipContent side="right" className="flex items-center gap-4">
								{link.title}
								{link.label && (
									<span className="ml-auto text-muted-foreground">
										{link.label}
									</span>
								)}
							</TooltipContent>
						</Tooltip>
					) : (
						<React.Fragment key={index}>
							<div>{link.separator}</div>
							<Link
								href={link.href}
								className={cn(
									buttonVariants({
										variant: pathname === link.href ? "default" : "ghost",
										size: "sm",
									}),
									"justify-start flex items-center"
								)}
							>
								<link.icon className="mr-2 h-4 w-4" />
								{link.title}
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
