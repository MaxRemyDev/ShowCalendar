"use client";

import React from "react";
import { Section } from "./Section";
import { CalendarDays, PieChart, Settings2, SquareCheckBig } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

// DEFINE BENEFITS DATA OUTSIDE THE COMPONENT FOR POSSIBLE REUSE
const benefits = [
	{
		icon: <CalendarDays className="h-20 w-20" />,
		title: "Seamless Calendar Sync",
		description:
			"Seamless Calendar Sync allows you to integrate and synchronize your existing Google, Outlook, and other digital calendars with ShowCalendar. This feature provides a unified overview of all your appointments, meetings, and events across platforms, ensuring you never miss a beat. With real-time updates and customizable view options, you're in complete control of your schedule.",
	},
	{
		icon: <SquareCheckBig className="h-20 w-20" />,
		title: "Advanced Task Management",
		description:
			"With Advanced Task Management, prioritize and manage your daily tasks efficiently. Our integrated tool features task categorization, progress tracking, and deadline setting to help you stay on top of your workload. Collaborate on tasks with team members, set recurring tasks, and sync them with your calendar to maintain a seamless workflow.",
	},
	{
		icon: <Settings2 className="h-20 w-20" />,
		title: "Event Planning Tool",
		description:
			"Our Event Planning tool simplifies organizing meetings, webinars, and social gatherings. It offers capabilities to create events, send invites, manage RSVPs, and share event details all in one place. Enhance your event with agenda setting, attachment sharing, and automated reminders to ensure high attendance and engagement.",
	},
	{
		icon: <PieChart className="h-20 w-20" />,
		title: "Advanced Analytics and Reporting",
		description:
			"Dive into Advanced Analytics and Reporting to gain insights into your time management efficiency. ShowCalendar's analytics dashboard offers a comprehensive overview of your scheduling patterns, task completion rates, and team productivity. Customize reports to track your progress over time, set goals, and identify areas for improvement. By analyzing past activities, you can make data-driven decisions to optimize your future planning.",
	},
];

// DEFINE MAIN COMPONENT: BENEFITS SECTION
export const BenefitsSection = () => {
	// RENDER COMPONENT
	return (
		<Section>
			<h2 className="text-3xl font-semibold text-center mb-1">
				MAXIMIZE YOUR PRODUCTIVITY WITH SHOWCALENDAR
			</h2>
			<p className="text-xl text-center mb-12 text-foreground-400">
				Streamline scheduling, task management, and gain insights—all in one place.
			</p>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
				{benefits.map((benefit) => (
					// INLINE BENEFIT ITEM COMPONENT FOR BETTER ENCAPSULATION
					<div
						key={benefit.title}
						className="flex flex-col items-center text-center gap-y-5"
					>
						<motion.div
							whileHover={{ scale: [null, 1.5, 1.4] }}
							transition={{ duration: 0.3 }}
							className="text-background-800 hover:text-background-300"
						>
							{benefit.icon}
						</motion.div>
						<div className="w-full max-w-lg px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4">
							{/* APPLY TAILWIND CLASSES FOR WORD BREAK AND HYPHENS */}
							<p
								className="text-xs sm:text-sm md:text-base lg:text-lg text-foreground-400 break-words hyphens-auto text-justify"
								lang="en"
							>
								{benefit.description}
							</p>
						</div>
					</div>
				))}
			</div>
			<div className="flex justify-center pt-20 pb-10">
				<motion.div
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					transition={{ type: "spring", stiffness: 400, damping: 17 }}
				>
					<Button size="xl" borderRadius="xxxl" textSize="md" shadow="primary">
						<Link href="/get-started" legacyBehavior>
							Get Started
						</Link>
					</Button>
				</motion.div>
			</div>
		</Section>
	);
};
