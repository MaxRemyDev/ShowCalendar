// DashboardHeader.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OneClickModeToggle } from "@/features/theme/OneClickModeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { DashboardRoutes } from "./utils/DashboardRoutes";
import DashboardDropMenuAccount from "./DashboardDropMenuAccount";

const DashboardHeader = () => {
	const pathname = usePathname();

	return (
		<header className="fixed inset-x-0 z-50 flex h-20 max-sm:h-16 items-center justify-between px-4 shadow-lg bg-background">
			<nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
				<Link
					href="/"
					className="flex items-center gap-2 text-lg font-semibold md:text-base"
				>
					<CalendarIcon className="h-6 w-6" />
					<span className="sr-only">ShowCalendar</span>
				</Link>
				{DashboardRoutes.map((route) => (
					<Link
						key={route.href}
						href={route.href}
						className={cn(
							"transition-colors hover:text-foreground",
							pathname.startsWith(route.href)
								? "text-foreground font-bold"
								: "text-muted-foreground"
						)}
					>
						{route.label}
					</Link>
				))}
			</nav>
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="outline" size="icon" className="shrink-0 md:hidden">
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left">
					<nav className="grid gap-6 text-lg font-medium">
						<Link href="/" className="flex items-center gap-2 text-lg font-semibold">
							<CalendarIcon className="h-6 w-6" />
							<span className="sr-only">ShowCalendar</span>
						</Link>
						{DashboardRoutes.map((route) => (
							<Link
								key={route.href}
								href={route.href}
								className={cn(
									"hover:text-foreground",
									pathname.startsWith(route.href)
										? "text-foreground font-bold"
										: "text-muted-foreground"
								)}
							>
								{route.label}
							</Link>
						))}
					</nav>
				</SheetContent>
			</Sheet>
			<div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
				<OneClickModeToggle />
				<DashboardDropMenuAccount />
			</div>
		</header>
	);
};

export default DashboardHeader;
