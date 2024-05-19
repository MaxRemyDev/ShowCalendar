"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarCheck, ChevronRightIcon, Menu } from "lucide-react";
import { CollapsibleTrigger, CollapsibleContent, Collapsible } from "@/components/ui/collapsible";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { DropDownMenuModeToggle } from "../theme/DropDownMenuModeToggle";
import { OneClickModeToggle } from "../theme/OneClickModeToggle";

export const LandingHeader = () => {
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const toggleSheet = () => setIsSheetOpen(!isSheetOpen);

	return (
		<motion.header
			className="fixed inset-x-0 z-50 flex h-20 max-sm:h-16 items-center justify-between px-4 shadow-lg bg-white/30 dark:bg-black/30"
			style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
		>
			<div className="flex items-center justify-start flex-grow">
				{/* LOGO AND BRAND NAME */}
				<Link href="/" legacyBehavior>
					<a className="flex items-center text-lg font-bold mr-8">
						<Image
							src="/ShowCalendarLogo.png"
							width={0}
							height={0}
							alt="ShowCalendar logo"
							style={{ width: "auto", height: "auto" }}
							className="dark:filter dark:invert"
						/>
						<div className="text-xl font-bold">/ ShowCalendar</div>
					</a>
				</Link>

				{/* FULL NAVIGATION MENU, HIDDEN ON 'LG' LARGE SCREENS AND SMALLER */}
				<motion.nav className="hidden lg-custom:flex items-center gap-4 mr-4">
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent">
									Products
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
										<li className="row-span-3">
											<NavigationMenuLink asChild>
												<a
													className="flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none focus:shadow-md bg-background-200 dark:bg-background-100 hover:bg-background-300 dark:hover:bg-background-300"
													href="/"
												>
													<CalendarCheck className="w-10 h-10 m-auto" />
													<div className="mb-2 mt-4 text-xl font-medium">
														ShowCalendar
													</div>
													<p className="text-sm leading-tight text-foreground-500">
														Lorem ipsum dolor sit amet consectetur
														adipisicing elit. Maxime mollitia
													</p>
												</a>
											</NavigationMenuLink>
										</li>
										{components.map((component) => (
											<ListItem
												key={component.title}
												title={component.title}
												href={component.href}
											>
												{component.description}
											</ListItem>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent">
									Solutions
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
										{components.map((component) => (
											<ListItem
												key={component.title}
												title={component.title}
												href={component.href}
											>
												{component.description}
											</ListItem>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent">
									Enterprise
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
										{components.map((component) => (
											<ListItem
												key={component.title}
												title={component.title}
												href={component.href}
											>
												{component.description}
											</ListItem>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/docs" legacyBehavior passHref>
									<NavigationMenuLink
										className={navigationMenuTriggerStyle()}
										style={{ backgroundColor: "transparent" }}
									>
										Docs
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/pricing" legacyBehavior passHref>
									<NavigationMenuLink
										className={navigationMenuTriggerStyle()}
										style={{ backgroundColor: "transparent" }}
									>
										Pricing
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</motion.nav>
			</div>

			{/* ACTION BUTTONS VISIBLE UP TO 'MD' MIDDLE SCREENS */}
			<div className="hidden md:flex items-center space-x-4">
				<OneClickModeToggle />
				<Button variant="link" asChild className="dark:text-white">
					<Link href="/support">Support</Link>
				</Button>
				<Button
					asChild
					className="bg-white hover:bg-background-100 dark:hover:bg-background-800 text-foreground-900"
				>
					<Link href="/login">Login</Link>
				</Button>
				<Button asChild className="dark:text-white">
					<Link href="/signup">Sign up</Link>
				</Button>
			</div>

			<div className="lg-custom:hidden flex items-center space-x-4">
				{/* ONE CLICK MODE TOGGLE CHANGE THEME */}
				<div className="md:hidden">
					<OneClickModeToggle />
				</div>

				{/* HAMBURGER MENU TRIGGER */}
				<Button onClick={toggleSheet} variant="ghost" size="icon" className="ml-2">
					<Menu />
				</Button>

				{/* SHEET CONTENT*/}
				<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
					<SheetContent
						className="w-64 bg-white/75 dark:bg-black/50 shadow-lg"
						side="right"
						style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
					>
						<div className="mt-8 border-t-2 border-background-200 dark:border-background-700" />
						<div className="flex flex-col justify-between h-full">
							{/* LINKS */}
							<div className="p-4 space-y-4">
								<Collapsible className="grid gap-4">
									<CollapsibleTrigger className="flex items-center gap-2 px-3 py-2 rounded-md text-foreground-700 hover:bg-background-100 dark:text-foreground-300">
										<span className="text-base font-medium">Products</span>
										<ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
									</CollapsibleTrigger>
									<CollapsibleContent>
										<div className="-mx-4 -mt-2 grid gap-2 bg-background-100 p-4 rounded-lg border-2">
											<Link
												className="flex items-center justify-left gap-2 px-3 py-2 rounded-md text-foreground-700 hover:bg-background-200 dark:text-foreground-300 dark:hover:bg-background-200"
												href="#"
											>
												<span className="text-base font-medium">
													Lorem ipsum
												</span>
											</Link>
											<Link
												className="flex items-center justify-left gap-2 px-3 py-2 rounded-md text-foreground-700 hover:bg-background-200 dark:text-foreground-300 dark:hover:bg-background-200"
												href="#"
											>
												<span className="text-base font-medium">
													Lorem ipsum
												</span>
											</Link>
											<Link
												className="flex items-center justify-left gap-2 px-3 py-2 rounded-md text-foreground-700 hover:bg-background-200 dark:text-foreground-300 dark:hover:bg-background-200"
												href="#"
											>
												<span className="text-base font-medium">
													Lorem ipsum
												</span>
											</Link>
										</div>
									</CollapsibleContent>
								</Collapsible>
								<Link
									className="flex items-center gap-2 px-3 py-2 rounded-md text-foreground-700 hover:bg-background-100 dark:text-foreground-300"
									href="#"
								>
									<span className="text-base font-medium">Solution</span>
								</Link>
								<Link
									className="flex items-center gap-2 px-3 py-2 rounded-md text-foreground-700 hover:bg-background-100 dark:text-foreground-300"
									href="#"
								>
									<span className="text-base font-medium">Enterprise</span>
								</Link>
								<Link
									className="flex items-center gap-2 px-3 py-2 rounded-md text-foreground-700 hover:bg-background-100 dark:text-foreground-300"
									href="#"
								>
									<span className="text-base font-medium">Docs</span>
								</Link>
								<Link
									className="flex items-center gap-2 px-3 py-2 rounded-md text-foreground-700 hover:bg-background-100 dark:text-foreground-300"
									href="#"
								>
									<span className="text-base font-medium">Pricing</span>
								</Link>
								<Link
									className="flex items-center gap-2 px-3 py-2 rounded-md text-foreground-700 hover:bg-background-100 dark:text-foreground-300"
									href="#"
								>
									<span className="text-base font-medium">Support</span>
								</Link>
							</div>

							{/* ACTION BUTTONS */}
							<div className="p-4 mb-4 border-t-2 border-gray-200 dark:border-gray-700">
								<div className="flex flex-col space-y-4">
									<DropDownMenuModeToggle />
									<Button
										variant="secondary"
										asChild
										borderRadius="lg"
										shadow="lg"
										className="bg-white hover:bg-background-100 dark:hover:bg-background-800 text-foreground-900"
									>
										<Link href="/login">Login</Link>
									</Button>
									<Button
										asChild
										className="px-4 py-2"
										borderRadius="lg"
										shadow="lg"
									>
										<Link href="/signup">Sign up</Link>
									</Button>
								</div>
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</motion.header>
	);
};

// LIST ITEM COMPONENT
const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
	({ className, title, children, ...props }, ref) => {
		return (
			<li>
				<NavigationMenuLink asChild>
					<a
						ref={ref}
						className={cn(
							"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-background-200 hover:text-foreground focus:bg-background focus:text-foreground",
							className
						)}
						{...props}
					>
						<div className="text-sm font-medium leading-none">{title}</div>
						<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
							{children}
						</p>
					</a>
				</NavigationMenuLink>
			</li>
		);
	}
);
ListItem.displayName = "ListItem";

// DUMMY DATA
const components: { title: string; href: string; description: string }[] = [
	{
		title: "Alert Dialog",
		href: "/docs/primitives/alert-dialog",
		description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia",
	},
	{
		title: "Hover Card",
		href: "/docs/primitives/hover-card",
		description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia",
	},
];
