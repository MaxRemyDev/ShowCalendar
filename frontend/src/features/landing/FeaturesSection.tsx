"use client";

import { Section } from "./Section";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";

type Coordinate = { x: number; y: number }; // TYPE FOR COORDINATES

// FUNCTION TO CALCULATE ROTATION ANGLE
const calcRotate = (x: number, y: number, rect: DOMRect): Coordinate => {
	const xDiff = x - (rect.left + rect.width / 2);
	const yDiff = y - (rect.top + rect.height / 2);
	const rotateX = (yDiff / rect.height) * 40;
	const rotateY = (xDiff / rect.width) * 40;
	return {
		x: rotateX,
		y: -rotateY,
	};
};

export const FeaturesSection = () => {
	const cardRefs = useRef<Array<HTMLDivElement | null>>(features.map(() => null)); // CREATE REFS FOR EACH FEATURE CARD

	// DEBOUNCING STATE FOR ANIMATION
	const [debouncedPosition, setDebouncedPosition] = useState({ x: 0, y: 0 });
	const [activeCard, setActiveCard] = useState<number | null>(null);

	// DEBOUNCED ANIMATION EFFECT
	useEffect(() => {
		const handler = setTimeout(() => {
			if (activeCard !== null) {
				const cardRef = cardRefs.current?.[activeCard];
				if (cardRef) {
					cardRef.style.transform = `rotateX(${debouncedPosition.x}deg) rotateY(${debouncedPosition.y}deg)`;
				}
			}
		}, 100); // Debounce time 100 ms

		return () => {
			clearTimeout(handler);
		};
	}, [debouncedPosition, activeCard]);

	// MOUSE MOVEMENT MANAGEMENT WITH DEBOUNCING
	const handleMouseMove = (index: number) => (e: React.MouseEvent<HTMLDivElement>) => {
		const cardRef = cardRefs.current?.[index];
		if (cardRef) {
			const rect = cardRef.getBoundingClientRect();
			const rotate = calcRotate(e.clientX, e.clientY, rect);

			setDebouncedPosition(rotate);
			setActiveCard(index);
		}
	};

	const requestRef = useRef<number | null>(null); // REFERENCE FOR ANIMATION FRAME

	// ANIMATION FUNCTION
	const animate = useCallback(() => {
		if (activeCard !== null) {
			const cardRef = cardRefs.current?.[activeCard];
			if (cardRef) {
				cardRef.style.transform = `rotateX(${debouncedPosition.x}deg) rotateY(${debouncedPosition.y}deg)`;
			}
		}
		requestRef.current = requestAnimationFrame(animate);
	}, [activeCard, debouncedPosition]);

	// REQUEST ANIMATION FRAME
	useEffect(() => {
		requestRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(requestRef.current!);
	}, [animate]);

	return (
		<Section>
			<div className="container mx-auto">
				<h2 className="text-3xl font-semibold text-center mb-12">
					WHAT&apos;S IN SHOWCALENDAR ?
				</h2>

				{/* GRID OF FEATURE CARDS */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((category, categoryIndex) => (
						<div key={category.category} className="flex flex-col space-y-8">
							{category.items.map((feature, featureIndex) => {
								const cardIndex = categoryIndex * 100 + featureIndex;
								const handleMouseLeave = () => {
									const cardRef = cardRefs.current?.[cardIndex];
									if (cardRef) {
										cardRef.style.transform = "rotateX(0deg) rotateY(0deg)";
									}
								};

								// RETURN FEATURE CARD
								return (
									<motion.div
										key={`${feature.title}-${feature.description}`}
										className="border-solid border-[2px] border-neutral-300 feature-card p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center"
										style={{ minHeight: "165px" }}
									>
										{/* DISPLAY IMAGE IF AVAILABLE WITH 3D EFFECT ANIMATION*/}
										{feature.image && (
											<motion.img
												src={feature.image}
												alt={`${feature.title} image`}
												width={400}
												height={400}
												className="shadow-2xl rounded-3xl mb-6 items-center justify-center"
												ref={(el: HTMLDivElement | null) =>
													(cardRefs.current[cardIndex] = el)
												}
												onMouseMove={handleMouseMove(cardIndex)}
												onMouseLeave={handleMouseLeave}
											/>
										)}
										<div className="flex-1 flex flex-col pt-3">
											<h3 className="text-xl font-semibold mb-2">
												{feature.title}
											</h3>
											<p className="flex-1">{feature.description}</p>
										</div>
									</motion.div>
								);
							})}
						</div>
					))}
				</div>
			</div>
		</Section>
	);
};

const features = [
	// FIRST VERTICAL COLUMN
	{
		category: "Organize and Collaborate",
		items: [
			{
				title: "Organize and Collaborate",
				image: "/assets/placeholder.svg",
				description:
					"Streamline your planning and collaboration with easy scheduling, real-time updates, and integration with the tools you love.",
			},
			{
				title: "Intuitive Scheduling",
				description:
					"Organize your day with ease using a simple drag-and-drop interface and customizable calendar views.",
			},
			{
				title: "Real-Time Collaboration",
				description:
					"Invite colleagues to events, share your availability, and schedule together effortlessly.",
			},
			{
				title: "Sync with Your Favorite Tools",
				description:
					"Connect ShowCalendar with other apps for seamless synchronization and enhanced productivity.",
			},
		],
	},

	// SECOND VERTICAL COLUMN
	{
		category: "Stay Informed and Personalized",
		items: [
			{
				title: "Stay Informed and Personalized",
				image: "/assets/placeholder.svg",
				description:
					"Get timely reminders, tailor your experience to fit your style, and enjoy the convenience of accessing your calendar wherever you are.",
			},
			{
				title: "Automatic Reminders",
				description:
					"Never miss an important appointment with custom reminders and push notifications.",
			},
			{
				title: "Advanced Customization",
				description:
					"Create a calendar that reflects your style with customizable themes and flexible settings.",
			},
			{
				title: "Access Anywhere, Anytime",
				description:
					"Manage your schedule from any device, at any time, with secure cloud syncing.",
			},
		],
	},

	// THIRD VERTICAL COLUMN
	{
		category: "Support, Security, and Insights",
		items: [
			{
				title: "Support, Security, and Insights",
				image: "/assets/placeholder.svg",
				description:
					"Rely on our dedicated support team, trust in our robust security measures, and gain valuable insights from comprehensive reports.",
			},
			{
				title: "Dedicated Customer Support",
				description:
					"Our team is always on hand to help you make the most of ShowCalendar.",
			},
			{
				title: "Data Protection",
				description:
					"We take security seriously with end-to-end encryption for your information and calendars.",
			},
			{
				title: "Insights and Reports",
				description:
					"Make informed decisions with detailed reports on your time management and activities.",
			},
		],
	},
];
