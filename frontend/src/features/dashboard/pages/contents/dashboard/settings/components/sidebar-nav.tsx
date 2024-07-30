"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
	items: {
		href: string;
		title: string;
		color?: string;
	}[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
	const [activeHref, setActiveHref] = useState<string | null>(null);
	const [clickedHref, setClickedHref] = useState<string | null>(null);
	const [isScrolling, setIsScrolling] = useState<boolean>(false);
	const observer = useRef<IntersectionObserver | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const mutationObserverRef = useRef<MutationObserver | null>(null);

	useEffect(() => {
		// HANDLE SCROLLING AND SET ACTIVE SECTION BASED ON VISIBILITY
		const handleScroll = (entries: IntersectionObserverEntry[]) => {
			if (isScrolling) return;

			let maxRatio = 0;
			let activeId: string | null = null;

			entries.forEach((entry) => {
				if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
					maxRatio = entry.intersectionRatio;
					activeId = entry.target.id;
				}
			});

			if (activeId && maxRatio > 0.6 && activeHref !== activeId) {
				setActiveHref(activeId);
			}
		};

		// INITIALIZE INTERSECTION OBSERVER
		observer.current = new IntersectionObserver(handleScroll, {
			root: null,
			rootMargin: "0px",
			threshold: [0.1, 0.25, 0.5, 0.75, 1],
		});

		// OBSERVE EACH SECTION ELEMENT
		const elements = items.map((item) => document.getElementById(item.href));
		elements.forEach((element) => {
			if (element) {
				observer.current?.observe(element);
			}
		});

		// CLEAN UP ON COMPONENT UNMOUNT
		return () => {
			observer.current?.disconnect();
			mutationObserverRef.current?.disconnect();
		};
	}, [items, isScrolling, activeHref]);

	// HANDLE CLICK EVENT FOR NAVIGATION LINKS
	const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
		event.preventDefault();
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setClickedHref(href);
		setIsScrolling(true);
		const element = document.getElementById(href);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "center" });
		}

		// STOP SCROLLING STATE AFTER TIMEOUT
		timeoutRef.current = setTimeout(() => {
			setIsScrolling(false);
			setClickedHref(null);
		}, 1000);
	};

	// CHECK DOM STATE AFTER CLICK
	useEffect(() => {
		if (clickedHref) {
			const element = document.getElementById(clickedHref);
			if (element) {
				const rect = element.getBoundingClientRect();
				const viewportHeight = window.innerHeight;
				// ADJUST VIEW IF ELEMENT IS OUT OF VIEW
				if (rect.bottom > viewportHeight) {
					element.scrollIntoView({ behavior: "smooth", block: "end" });
				}
			}
		}
	}, [clickedHref]);

	return (
		<nav
			className={cn(
				"sticky top-48 flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
				className
			)}
			{...props}
		>
			{items.map((item) => (
				<Link
					key={item.href}
					href={`#${item.href}`}
					onClick={(e) => handleClick(e, item.href)}
					className={cn(
						buttonVariants({ variant: "ghost" }),
						(activeHref === item.href && !isScrolling) || clickedHref === item.href
							? "bg-background-200 hover:bg-background-200"
							: "hover:bg-transparent hover:underline",
						"justify-start",
						item.color
					)}
				>
					{item.title}
				</Link>
			))}
		</nav>
	);
}
