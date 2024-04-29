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
					WHAT&apos;S IN SHOWCALENDAR?
				</h2>

				{/* GRID OF FEATURE CARDS */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => {
						// EVENT HANDLER FOR MOUSE LEAVE
						const handleMouseLeave = () => {
							const cardRef = cardRefs.current?.[index];
							if (cardRef) {
								cardRef.style.transform = "rotateX(0deg) rotateY(0deg)";
							}
						};

						// RETURN FEATURE CARD
						return (
							<motion.div
								key={`${feature.title}-${feature.description}`}
								className="border-solid border-[2px] border-neutral-300 feature-card p-6 rounded-3xl shadow-xl"
							>
								{/* DISPLAY IMAGE IF AVAILABLE WITH 3D EFFECT ANIMATION*/}
								{feature.image && (
									<motion.img
										src={feature.image}
										alt={`${feature.title} image`}
										width={400}
										height={400}
										className="shadow-2xl rounded-3xl mb-6"
										ref={(el: HTMLDivElement | null) =>
											(cardRefs.current[index] = el)
										}
										onMouseMove={handleMouseMove(index)}
										onMouseLeave={handleMouseLeave}
									/>
								)}
								<h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
								<p>{feature.description}</p>
							</motion.div>
						);
					})}
				</div>
			</div>
		</Section>
	);
};

const features = [
	// FIRST HORIZONTAL COLUMN
	{
		title: "Organize and Collaborate",
		description:
			"Streamline your planning and collaboration with easy scheduling, real-time updates, and integration with the tools you love.",
		image: "/assets/placeholder.svg",
	},
	{
		title: "Stay Informed and Personalized",
		description:
			"Get timely reminders, tailor your experience to fit your style, and enjoy the convenience of accessing your calendar wherever you are.",
		image: "/assets/placeholder.svg",
	},
	{
		title: "Support, Security, and Insights",
		description:
			"Rely on our dedicated support team, trust in our robust security measures, and gain valuable insights from comprehensive reports.",
		image: "/assets/placeholder.svg",
	},

	// SECOND HORIZONTAL COLUMN
	{
		title: "Intuitive Scheduling",
		description:
			"Organize your day with ease using a simple drag-and-drop interface and customizable calendar views.",
	},
	{
		title: "Automatic Reminders",
		description:
			"Never miss an important appointment with custom reminders and push notifications.",
	},
	{
		title: "Dedicated Customer Support",
		description: "Our team is always on hand to help you make the most of ShowCalendar.",
	},

	// THIRD HORIZONTAL COLUMN
	{
		title: "Real-Time Collaboration",
		description:
			"Invite colleagues to events, share your availability, and schedule together effortlessly.",
	},
	{
		title: "Advanced Customization",
		description:
			"Create a calendar that reflects your style with customizable themes and flexible settings.",
	},
	{
		title: "Data Protection",
		description:
			"We take security seriously with end-to-end encryption for your information and calendars.",
	},

	// FOURTH HORIZONTAL COLUMN
	{
		title: "Sync with Your Favorite Tools",
		description:
			"Connect ShowCalendar with other apps for seamless synchronization and enhanced productivity.",
	},
	{
		title: "Access Anywhere, Anytime",
		description:
			"Manage your schedule from any device, at any time, with secure cloud syncing.",
	},
	{
		title: "Insights and Reports",
		description:
			"Make informed decisions with detailed reports on your time management and activities.",
	},
];
