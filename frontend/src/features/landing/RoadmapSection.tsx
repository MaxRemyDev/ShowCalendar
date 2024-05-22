"use client";

import { Braces, CodeXml, Database, GitCommitHorizontal, Globe, Menu } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
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
import { parseISO, format, getQuarter as fnsGetQuarter, isBefore, endOfQuarter } from "date-fns";
import Image from "next/image";

// EVENT AND COMMITS TIMELINE TYPES
interface Event {
	date: string;
	message: string;
	commitUrl: string;
	author: {
		name: string;
		avatarUrl: string;
		htmlUrl: string;
	};
}

// TASK TYPE
interface TaskType {
	description: string;
	icon: React.ReactNode;
}

// TASK ITEM TYPE
interface TaskItemType {
	title: string;
	tasks: TaskType[];
}

// ROADMAP ITEM TYPE
interface RoadmapItemType {
	quarter: string;
	pastQuarter?: string;
	decoration?: React.ReactNode;
	icon: React.ReactNode;
	label: string;
	labelColor?: string;
	description: string;
	bgColor: string;
	textColor?: string;
	left: string;
	taskItems: TaskItemType[];
	events?: Event[];
}

interface CommitsTimeLineProps {
	events: Event[];
}

export const RoadmapSection = () => {
	const [isMobile, setIsMobile] = useState(false); // STATE TO CHECK IF VIEW IS MOBILE
	const [selectedTask, setSelectedTask] = useState<TaskItemType | null>(null); // STATE TO STORE SELECTED TASK
	const [selectedQuarter, setSelectedQuarter] = useState<RoadmapItemType | null>(null); // STATE TO STORE SELECTED QUARTER
	const [commits, setCommits] = useState<Event[]>([]); // STATE TO STORE FETCHED COMMITS
	const [roadmapDataCopy, setRoadmapDataCopy] = useState<RoadmapItemType[]>([...roadmapData]); // STATE TO STORE ROADMAP DATA

	useEffect(() => {
		// FETCH COMMITS FROM PUBLIC GITHUB API WITH PAGINATION
		const fetchCommits = async () => {
			try {
				let page = 1;
				let allCommits: Event[] = [];
				let moreCommits = true;

				while (moreCommits) {
					const response = await axios.get(
						`https://api.github.com/repos/MaxRemyDev/ShowCalendar/commits?page=${page}&per_page=100`
					);
					const fetchedCommits = response.data.map((commit: any) => ({
						date: format(parseISO(commit.commit.author.date), "yyyy-MM-dd"),
						message: commit.commit.message,
						commitUrl: commit.html_url,
						author: {
							name: commit.commit.author.name,
							avatarUrl: commit.author.avatar_url,
							htmlUrl: commit.author.html_url,
						},
					}));
					allCommits = allCommits.concat(fetchedCommits);
					moreCommits = fetchedCommits.length === 100;
					page += 1;
				}

				setCommits(allCommits);
			} catch (error) {
				console.error("Error fetching commits: ", error);
			}
		};

		fetchCommits();
	}, []);

	// FUNCTION TO DETERMINE WHICH QUARTER A DATE FALLS INTO
	const getQuarter = (date: Date) => {
		const quarter = fnsGetQuarter(date);
		const year = date.getFullYear();
		return `Q${quarter} ${year}`;
	};

	// GET CURRENT DATE FOR COMPARISON
	const currentDate = useMemo(() => new Date(), []);

	// USE EFFECT TO SORT COMMITS INTO QUARTERS
	useEffect(() => {
		const updatedRoadmapData: RoadmapItemType[] = [...roadmapData];
		commits.forEach((commit) => {
			const commitDate = parseISO(commit.date);
			const quarter = getQuarter(commitDate);
			const endOfCurrentQuarter = endOfQuarter(currentDate);
			if (quarter && isBefore(commitDate, endOfCurrentQuarter)) {
				const quarterData = updatedRoadmapData.find((data) => data.quarter === quarter);
				if (quarterData) {
					if (!quarterData.events) {
						quarterData.events = [];
					}
					quarterData.events.push(commit);
				}
			}
		});

		// SORTING EVENTS IN EACH QUARTER BY DATE
		updatedRoadmapData.forEach((quarter) => {
			if (quarter.events) {
				quarter.events.sort(
					(a: Event, b: Event) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
				);
			}
		});

		setRoadmapDataCopy(updatedRoadmapData);
	}, [commits, currentDate]);

	// HOOK TO HANDLE RESIZE EVENT
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
				Explore our roadmap to see how ShowCalendar is developing. <br />
				Check out the commit history and tasks to get a glimpse of the future.
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

				{/* RENDER ROADMAP ITEMS WITH COMMIT & TASKS */}
				{roadmapDataCopy.map((item, index) => (
					<Dialog
						key={index}
						onOpenChange={(open) => setSelectedQuarter(open ? item : null)}
					>
						<DialogTrigger asChild>
							<div
								className={`mb-8 ${
									isMobile ? "w-full flex flex-col items-center" : "absolute"
								}`}
								style={{
									top: `${index * 12 + 10}vh`,
									left: isMobile ? "0" : item.left,
									transform: isMobile ? "none" : "translate(-50%, -50%)",
									marginBottom: isMobile ? "20px" : "0",
								}}
							>
								{/* ROADMAP ITEM CARD */}
								<div
									className={`cursor-pointer flex text-center items-center justify-center flex-col w-64 h-32 rounded-2xl shadow-2xl ${item.bgColor}`}
								>
									{item.icon}
									<span
										className={`mt-2 text-md text-center font-bold ${item.labelColor}`}
									>
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
						</DialogTrigger>

						{/* ROADMAP ITEM DIALOG CONTENT (TASKS AND EVENTS) */}
						{selectedQuarter === item && (
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>{item.quarter}</DialogTitle>
									<DialogDescription>{item.description}</DialogDescription>
								</DialogHeader>

								<div className="max-h-[400px] overflow-y-auto">
									{item.taskItems && item.taskItems.length > 0 && (
										<div className="w-full grid grid-cols-1 gap-4">
											{item.taskItems.map((taskItem, taskIndex) => (
												<Dialog
													key={taskIndex}
													onOpenChange={(open) =>
														setSelectedTask(open ? taskItem : null)
													}
												>
													<DialogTrigger asChild>
														<div className="p-4 flex flex-row items-center justify-center rounded-lg cursor-pointer border-[2px] border-background-200 hover:bg-neutral-200 dark:hover:bg-neutral-800">
															<h4 className="text-lg font-semibold mr-auto">
																{taskItem.title}
															</h4>
															<Menu className="my-auto" />
														</div>
													</DialogTrigger>

													{selectedTask === taskItem && (
														<DialogContent className="sm:max-w-[425px]">
															<DialogHeader>
																<DialogTitle>
																	{taskItem.title}
																</DialogTitle>
																<DialogDescription>
																	<div className="max-h-[300px] overflow-y-auto">
																		<ul className="list-none pl-0">
																			{taskItem.tasks.map(
																				(task, i) => (
																					<li
																						key={i}
																						className="flex items-center"
																					>
																						<span className="mr-2">
																							{
																								task.icon
																							}
																						</span>
																						<span>
																							{
																								task.description
																							}
																						</span>
																					</li>
																				)
																			)}
																		</ul>

																		{/* SCROLL INDICATOR FOR MORE TASKS */}
																		{taskItem.tasks.length >
																			11 && (
																			<div className="sticky bottom-0 bg-background py-2 z-10 text-center text-sm text-gray-500 dark:text-neutral-400">
																				Scroll to see more
																				details
																			</div>
																		)}
																	</div>
																</DialogDescription>
															</DialogHeader>
														</DialogContent>
													)}
												</Dialog>
											))}

											{/* SCROLL INDICATOR FOR MORE TASKS */}
											{item.taskItems.length > 4 && (
												<div className="sticky bottom-0 bg-background py-2 z-10 text-center text-sm text-gray-500 dark:text-neutral-400">
													Scroll to see more tasks
												</div>
											)}
										</div>
									)}

									{/* CommitsTimeLine FOR COMMITS */}
									{item.events && item.events.length > 0 && (
										<CommitsTimeLine events={item.events || []} />
									)}
								</div>
							</DialogContent>
						)}
					</Dialog>
				))}
			</div>
		</Section>
	);
};

// ROADMAP LINES COMPONENT
const RoadmapLines = () => {
	// STATE TO STORE LINE COORDINATES
	const [lineCoordinates, setLineCoordinates] = useState<
		{ x1: string; y1: number; x2: string; y2: number }[]
	>([]);

	// HOOK TO UPDATE LINE COORDINATES ON RESIZE
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

// FUNCTION TO PRESERVE FORMATTING OF COMMIT MESSAGES
const formatCommitMessage = (message: string) => {
	return message.split("\n").map((line, index) => (
		<React.Fragment key={index}>
			{line}
			<br />
		</React.Fragment>
	));
};

// COMMITS TIMELINE COMPONENT TO DISPLAY EVENTS
const CommitsTimeLine: React.FC<CommitsTimeLineProps> = ({ events }) => {
	// GROUPING EVENTS BY DATE
	const groupedEvents = events.reduce((acc, event) => {
		if (!acc[event.date]) {
			acc[event.date] = [];
		}
		acc[event.date].push(event);
		return acc;
	}, {} as { [key: string]: Event[] });

	return (
		<div className="mt-5 max-h-[300px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 relative">
			{Object.entries(groupedEvents).map(([date, dateEvents]) => (
				<div key={date}>
					{/* DATE HEADING */}
					<div className="ps-2 my-2 first:mt-0">
						<h3 className="text-xs font-medium uppercase text-gray-500 dark:text-neutral-400">
							{format(parseISO(date), "dd MMMM yyyy")}
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
									{formatCommitMessage(event.message)}
								</h3>
								{/* AUTHOR INFORMATION */}
								{event.author && (
									<button
										type="button"
										className="mt-1 -ms-1 p-1 relative z-10 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800"
										onClick={() => {
											window.open(event.author.htmlUrl, "_blank");
										}}
									>
										{/* AUTHOR AVATAR */}
										<Image
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
				<div className="sticky bottom-0 bg-background py-2 z-10 text-center text-sm text-gray-500 dark:text-neutral-400">
					Scroll to see more commits
				</div>
			)}
		</div>
	);
};

// ROADMAP DATA FOR DIFFERENT QUARTERS
const roadmapData: RoadmapItemType[] = [
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
		taskItems: [
			{
				title: "Backend Development Tasks",
				tasks: [
					{
						description: "Backend Development Task 1",
						icon: getStatusIcon("check"),
					},
					{
						description: "Backend Development Task 2",
						icon: getStatusIcon("circleCheck"),
					},
					{
						description: "Backend Development Task 3",
						icon: getStatusIcon("circleCheckBig"),
					},
					{
						description: "Backend Development Task 4",
						icon: getStatusIcon("work"),
					},
					{
						description: "Backend Development Task 5",
						icon: getStatusIcon("work2"),
					},
					{
						description: "Backend Development Task 6",
						icon: getStatusIcon("line"),
					},
					{
						description: "Backend Development Task 7",
						icon: getStatusIcon("circleLine"),
					},
					{
						description: "Backend Development Task 8",
						icon: getStatusIcon("x"),
					},

					{
						description: "Backend Development Task 9",
						icon: getStatusIcon("circleX"),
					},
				],
			},
		],
		events: [],
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
		taskItems: [
			{
				title: "Frontend Development Tasks",
				tasks: [
					{
						description: "Frontend Development Task 1",
						icon: getStatusIcon("check"),
					},
				],
			},
		],
		events: [],
	},

	{
		quarter: "Q3 2024",
		decoration: getStatusIcon("x"),
		icon: <CodeXml className="w-10 h-10 text-black dark:text-white" />,
		label: "Integrated Development",
		description: "Integrated Development Tasks",
		bgColor: "bg-white dark:bg-black",
		left: "25%",
		taskItems: [
			{
				title: "Integrated Development Tasks 1",
				tasks: [
					{
						description: "Integrated Development Task 1",
						icon: getStatusIcon("check"),
					},
				],
			},
			{
				title: "Integrated Development Tasks 2",
				tasks: [
					{
						description: "Integrated Development Task 2",
						icon: getStatusIcon("x"),
					},
				],
			},
		],
		events: [],
	},

	{
		quarter: "Q4 2024",
		decoration: getStatusIcon("x"),
		icon: <Globe className="w-10 h-10 text-black dark:text-white" />,
		label: "Launch",
		description: "Launch Tasks",
		bgColor: "bg-white dark:bg-black",
		left: "75%",
		taskItems: [
			{
				title: "Launch Tasks",
				tasks: [
					{
						description: "Launch Task 1",
						icon: getStatusIcon("circleLine"),
					},
				],
			},
		],
		events: [],
	},
];
