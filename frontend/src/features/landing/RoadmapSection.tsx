"use client";

import { Braces, CodeXml, Database, GitCommitHorizontal, Globe } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Section } from "./Section";
import getStatusIcon from "@/components/decoration/get-status-icon";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export const RoadmapSection = () => {
	const [isMobile, setIsMobile] = useState(false); // STATE TO CHECK IF VIEW IS MOBILE
	const [selectedItem, setSelectedItem] = useState<(typeof roadmapData)[number] | null>(null); // STATE TO STORE SELECTED ITEM

	// USE EFFECT HOOK TO HANDLE RESIZE EVENT
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// DYNAMIC HEIGHT CALCULATION FOR CONTAINER
	const containerHeight = `${roadmapData.length * 12 + 10}vh`;

	return (
		<Section>
			{/* ROADMAP TITLE & DESCRIPTION */}
			<h2 className="text-3xl font-semibold text-center mb-1">ROADMAP</h2>
			<p className="text-xl text-center mb-12 text-foreground-400">
				Roadmap description Lorem ipsum dolor sit amet, consectetur adipiscing
			</p>

			{/* ROADMAP CONTAINER */}
			<div
				className={`container mx-auto relative w-full ${
					isMobile ? "flex flex-col items-center" : ""
				}`}
				style={{ height: isMobile ? "auto" : containerHeight }}
			>
				{/* RENDER ROADMAP LINES IF NOT MOBILE */}
				{!isMobile && <RoadmapLines />}

				{/* RENDER ROADMAP ITEMS WITH DIALOGS */}
				{roadmapData.map((item, index) => (
					<Dialog
						key={index}
						onOpenChange={(open) => setSelectedItem(open ? item : null)}
					>
						<DialogTrigger asChild>
							<button className="appearance-none bg-none border-none p-0 m-0 w-full">
								<RoadmapItem item={item} index={index} isMobile={isMobile} />
							</button>
						</DialogTrigger>
						{selectedItem === item && (
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>{item.quarter}</DialogTitle>
									<DialogDescription>{item.description}</DialogDescription>
								</DialogHeader>
								<Timeline
									events={item.events.map((event) => ({
										...event,
										user: event.author,
									}))}
								/>
							</DialogContent>
						)}
					</Dialog>
				))}
			</div>
		</Section>
	);
};

// ROADMAP ITEM COMPONENT
const RoadmapItem = ({
	item,
	index,
	isMobile,
}: {
	item: {
		left: string;
		bgColor: string;
		textColor?: string;
		icon: React.ReactNode;
		quarter: string;
		pastQuarter?: string;
		label: string;
		labelColor?: string;
		decoration?: React.ReactNode;
	};
	index: number;
	isMobile: boolean;
}) => {
	// DYNAMIC STYLES BASED ON MOBILE VIEW
	const top = isMobile ? "auto" : `${index * 12 + 10}vh`;
	const leftPosition = isMobile ? "0" : item.left;
	const transform = isMobile ? "none" : "translate(-50%, -50%)";
	const marginBottom = isMobile ? "20px" : "0";

	return (
		<div
			className={`mb-8 ${isMobile ? "w-full flex flex-col items-center" : "absolute"}`}
			style={{
				top,
				left: leftPosition,
				transform,
				marginBottom,
			}}
		>
			{/* ROADMAP ITEM CARD */}
			<div
				className={`flex text-center items-center justify-center flex-col w-64 h-32 rounded-2xl shadow-2xl ${item.bgColor}`}
			>
				{item.icon}
				<span className={`mt-2 text-md text-center font-bold ${item.labelColor}`}>
					{item.label}
				</span>
			</div>

			{/* ROADMAP ITEM QUARTER */}
			<div className="flex text-center items-center justify-center flex-row mt-4">
				{item.decoration}
				<h4
					className={`ml-2 text-lg text-center font-extrabold ${item.pastQuarter} ${item.textColor}`}
				>
					{item.quarter}
				</h4>
			</div>
		</div>
	);
};

// ROADMAP LINES COMPONENT
const RoadmapLines = () => {
	// STATE TO STORE LINE COORDINATES
	const [lineCoordinates, setLineCoordinates] = useState<
		{ x1: string; y1: number; x2: string; y2: number }[]
	>([]);

	// USE EFFECT HOOK TO UPDATE LINE COORDINATES ON RESIZE
	useEffect(() => {
		const updateLineCoordinates = () => {
			const vh = window.innerHeight / 100;
			const lines: { x1: string; y1: number; x2: string; y2: number }[] = [];

			for (let i = 0; i < roadmapData.length - 1; i++) {
				const current = roadmapData[i];
				const next = roadmapData[i + 1];

				const currentPos = {
					x: parseFloat(current.left),
					y: (i * 12 + 10) * vh,
				};
				const nextPos = {
					x: parseFloat(next.left),
					y: ((i + 1) * 12 + 10) * vh,
				};

				lines.push({
					x1: `${currentPos.x}%`,
					y1: currentPos.y,
					x2: `${nextPos.x}%`,
					y2: nextPos.y,
				});
			}

			setLineCoordinates(lines);
		};

		updateLineCoordinates();
		window.addEventListener("resize", updateLineCoordinates);

		return () => window.removeEventListener("resize", updateLineCoordinates);
	}, []);

	return (
		<svg className="absolute w-full h-full">
			{lineCoordinates.map((line, index) => (
				<line
					key={index}
					x1={line.x1}
					y1={line.y1}
					x2={line.x2}
					y2={line.y2}
					stroke="gray"
					strokeWidth="3"
				/>
			))}
		</svg>
	);
};

// TIMELINE COMPONENT TO DISPLAY EVENTS
interface Event {
	date: string;
	message: string;
	commitUrl: string;
	author: {
		name: string;
		avatarUrl: string;
	};
}

interface TimelineProps {
	events: Event[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
	// GROUPING EVENTS BY DATE
	const groupedEvents = events.reduce((acc, event) => {
		if (!acc[event.date]) {
			acc[event.date] = [];
		}
		acc[event.date].push(event);
		return acc;
	}, {} as { [key: string]: Event[] });

	return (
		<div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 relative">
			{Object.entries(groupedEvents).map(([date, dateEvents]) => (
				<div key={date}>
					{/* DATE HEADING */}
					<div className="ps-2 my-2 first:mt-0">
						<h3 className="text-xs font-medium uppercase text-gray-500 dark:text-neutral-400">
							{date}
						</h3>
					</div>

					{/* EVENTS FOR SAME DATE */}
					{dateEvents.map((event, index) => (
						<div
							key={index}
							className="flex gap-x-3 relative group rounded-lg hover:bg-neutral-200 dark:hover:bg-white/10"
						>
							<a className="absolute inset-0 z-[1]" href={event.commitUrl}></a>

							{/* ICON AND VERTICAL LINE */}
							<div className="relative after:absolute after:top-0 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700 dark:group-hover:after:bg-neutral-600">
								{index === 0 && (
									<div className="relative z-10 size-7 flex justify-center items-center">
										<GitCommitHorizontal className="size-6 text-gray-400 group-hover:text-gray-600 dark:text-neutral-500 dark:group-hover:text-neutral-400" />
									</div>
								)}
								{/* SPACER TO KEEP COMMITS ALIGNED */}
								{index > 0 && (
									<div className="size-7 flex justify-center items-center"></div>
								)}
							</div>

							{/* RIGHT CONTENT */}
							<div className="grow p-2 pb-8">
								<h3 className="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">
									{event.message}
								</h3>
								{/* AUTHOR INFORMATION */}
								{event.author && (
									<button
										type="button"
										className="mt-1 -ms-1 p-1 relative z-10 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800"
									>
										{/* AUTHOR AVATAR */}
										<img
											className="flex-shrink-0 size-4 rounded-full"
											src={event.author.avatarUrl}
											alt={event.author.name}
											width={32}
											height={32}
										/>
										{event.author.name}
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			))}
			{/* SCROLL INDICATOR FOR MORE COMMITS */}
			{events.length > 2 && (
				<div className="sticky bottom-0 bg-background py-2 z-10">
					<div className="text-center text-sm text-gray-500 dark:text-neutral-400">
						Scroll to see more commits
					</div>
				</div>
			)}
		</div>
	);
};

// ROADMAP DATA FOR DIFFERENT QUARTERS
const roadmapData = [
	{
		quarter: "Q1 2024",
		pastQuarter: "line-through",
		decoration: getStatusIcon("check"),
		icon: <Database className="w-10 h-10 text-black dark:text-white" />,
		label: "Backend Development",
		description: "Backend Development Description",
		bgColor: "bg-white dark:bg-black",
		textColor: "text-foreground-300",
		left: "25%",
		events: [
			{
				date: "1 Jan, 2024",
				message: "Initial commit for backend setup",
				commitUrl: "https://github.com/username/repo/commit/abc123",
				author: {
					name: "James Collins",
					avatarUrl: "https://avatars.githubusercontent.com/u/123456?v=4",
				},
			},
			{
				date: "1 Jan, 2024",
				message: "Added README",
				commitUrl: "https://github.com/username/repo/commit/xyz789",
				author: {
					name: "Jane Doe",
					avatarUrl: "https://avatars.githubusercontent.com/u/654321?v=4",
				},
			},
			{
				date: "29 Jan , 2024",
				message: "Setup CI/CD pipeline",
				commitUrl: "https://github.com/username/repo/commit/def456",
				author: {
					name: "Alex Gregarov",
					avatarUrl: "https://avatars.githubusercontent.com/u/789012?v=4",
				},
			},
			{
				date: "30 Jan, 2024",
				message: "Configured database connections",
				commitUrl: "https://github.com/username/repo/commit/ghi789",
				author: {
					name: "Sarah Lee",
					avatarUrl: "https://avatars.githubusercontent.com/u/345678?v=4",
				},
			},
		],
	},

	{
		quarter: "Q2 2024",
		decoration: getStatusIcon("work"),
		icon: <Braces className="w-10 h-10 text-primary" />,
		label: "Frontend Development",
		labelColor: "text-white dark:text-black",
		description: "Frontend Development Description",
		bgColor: "bg-black dark:bg-white",
		left: "75%",
		events: [
			{
				date: "1 May, 2024",
				message: "Added new components for the dashboard",
				commitUrl: "https://github.com/username/repo/commit/ghi789",
				author: {
					name: "Sarah Lee",
					avatarUrl: "https://avatars.githubusercontent.com/u/345678?v=4",
				},
			},
			{
				date: "15 May, 2024",
				message: "Fixed bug in login flow",
				commitUrl: "https://github.com/username/repo/commit/jkl012",
				author: {
					name: "John Doe",
					avatarUrl: "https://avatars.githubusercontent.com/u/987654?v=4",
				},
			},
		],
	},

	{
		quarter: "Q3 2024",
		decoration: getStatusIcon("x"),
		icon: <CodeXml className="w-10 h-10 text-black dark:text-white" />,
		label: "Integrated Development",
		description: "Integrated Development Description",
		bgColor: "bg-white dark:bg-black",
		left: "25%",
		events: [],
	},

	{
		quarter: "Q4 2024",
		decoration: getStatusIcon("x"),
		icon: <Globe className="w-10 h-10 text-black dark:text-white" />,
		label: "Launch",
		description: "Launch Description",
		bgColor: "bg-white dark:bg-black",
		left: "75%",
		events: [],
	},
];
