"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarCheck, ChevronRightIcon, Menu } from "lucide-react";
import {
	CollapsibleTrigger,
	CollapsibleContent,
	Collapsible,
} from "@/components/ui/collapsible";
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

export const LandingHeader = () => {
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const toggleSheet = () => setIsSheetOpen(!isSheetOpen);

	return (
		<motion.header className="fixed inset-x-0 z-50 flex h-20 items-center justify-between px-4 shadow-lg backdrop-blur-md bg-white/30">
			<div className="flex items-center justify-start flex-grow">
				{/* LOGO AND BRAND NAME */}
				<Link href="/" legacyBehavior>
					<a className="flex items-center text-lg font-bold text-gray-800 hover:text-gray-600 mr-8">
						<Image
							src="/ShowCalendarLogo.png"
							width={22}
							height={22}
							alt="ShowCalendar logo"
						/>
						<div className="text-xl font-bold">/ ShowCalendar</div>
					</a>
				</Link>

				{/* FULL NAVIGATION MENU, HIDDEN ON 'LG' LARGE SCREENS AND SMALLER */}
				<motion.nav className="hidden lg:flex items-center gap-4 mr-4">
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger>
									Products
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
										<li className="row-span-3">
											<NavigationMenuLink asChild>
												<a
													className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
													href="/"
												>
													<CalendarCheck className="w-10 h-10 m-auto" />
													<div className="mb-2 mt-4 text-xl font-medium">
														ShowCalendar
													</div>
													<p className="text-sm leading-tight text-muted-foreground">
														Lorem ipsum dolor sit
														amet consectetur
														adipisicing elit. Maxime
														mollitia
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
								<NavigationMenuTrigger>
									Solutions
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
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
								<NavigationMenuTrigger>
									Enterprise
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
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
									>
										Docs
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/pricing" legacyBehavior passHref>
									<NavigationMenuLink
										className={navigationMenuTriggerStyle()}
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
				<Button variant="link" asChild>
					<Link href="/login">Support</Link>
				</Button>
				<Button
					variant="secondary"
					asChild
					className="bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded border border-gray-300"
				>
					<Link href="/login">Login</Link>
				</Button>
				<Button
					asChild
					className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
				>
					<Link href="/signup">Sign up</Link>
				</Button>
			</div>

			<div className="lg:hidden flex items-center space-x-4">
				{/* HAMBURGER MENU TRIGGER */}
				<Button onClick={toggleSheet} variant="ghost" size="icon">
					<Menu />
				</Button>

				{/* SHEET CONTENT*/}
				<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
					<SheetContent
						className="w-64 bg-white shadow-lg dark:bg-gray-800"
						side="right"
					>
						<div className="mt-8 border-t-2 border-gray-200 dark:border-gray-700" />
						<div className="flex flex-col justify-between h-full">
							{/* LINKS */}
							<div className="p-4 space-y-4">
								<Collapsible className="grid gap-4">
									<CollapsibleTrigger className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md dark:text-gray-300 dark:hover:bg-gray-700">
										<span className="text-base font-medium">
											Products
										</span>
										<ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
									</CollapsibleTrigger>
									<CollapsibleContent>
										<div className="-mx-4 -mt-2 grid gap-2 bg-gray-100 p-4 dark:bg-gray-700 rounded-lg border-2">
											<Link
												className="flex items-center justify-left gap-2 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md dark:text-gray-300 dark:hover:bg-gray-600"
												href="#"
											>
												<span className="text-base font-medium">
													Lorem ipsum
												</span>
											</Link>
											<Link
												className="flex items-center justify-left gap-2 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md dark:text-gray-300 dark:hover:bg-gray-600"
												href="#"
											>
												<span className="text-base font-medium">
													Lorem ipsum
												</span>
											</Link>
											<Link
												className="flex items-center justify-left gap-2 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md dark:text-gray-300 dark:hover:bg-gray-600"
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
									className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md dark:text-gray-300 dark:hover:bg-gray-700"
									href="#"
								>
									<span className="text-base font-medium">
										Solution
									</span>
								</Link>
								<Link
									className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md dark:text-gray-300 dark:hover:bg-gray-700"
									href="#"
								>
									<span className="text-base font-medium">
										Enterprise
									</span>
								</Link>
								<Link
									className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md dark:text-gray-300 dark:hover:bg-gray-700"
									href="#"
								>
									<span className="text-base font-medium">
										Docs
									</span>
								</Link>
								<Link
									className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md dark:text-gray-300 dark:hover:bg-gray-700"
									href="#"
								>
									<span className="text-base font-medium">
										Pricing
									</span>
								</Link>
								<Link
									className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md dark:text-gray-300 dark:hover:bg-gray-700"
									href="#"
								>
									<span className="text-base font-medium">
										Support
									</span>
								</Link>
							</div>

							{/* ACTION BUTTONS */}
							<div className="p-4 mb-4 border-t-2 border-gray-200 dark:border-gray-700">
								<div className="flex flex-col space-y-4">
									<Button
										variant="secondary"
										asChild
										className="bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded border border-gray-300"
									>
										<Link href="/login">Login</Link>
									</Button>
									<Button
										asChild
										className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
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
const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">
						{title}
					</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";

// DUMMY DATA
const components: { title: string; href: string; description: string }[] = [
	{
		title: "Alert Dialog",
		href: "/docs/primitives/alert-dialog",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia",
	},
	{
		title: "Hover Card",
		href: "/docs/primitives/hover-card",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia",
	},
];
