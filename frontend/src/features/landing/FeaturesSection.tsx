"use client";

import { Section } from "./Section";
import Image from "next/image";
import { motion } from "framer-motion";
import React, { createRef, useRef } from "react";

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
	const cardRefs = useRef(features.map(() => createRef<HTMLDivElement>())); // CREATE REFS FOR EACH FEATURE CARD

	return (
		<Section>
			<div className="container mx-auto">
				<h2 className="text-3xl font-semibold text-center mb-12">
					What&apos;s in ShowCalendar?
				</h2>

				{/* GRID OF FEATURE CARDS */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => {
						// EVENT HANDLERS FOR MOUSE MOVEMENT
						const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
							const cardRef = cardRefs.current?.[index];
							if (cardRef?.current) {
								const rect = cardRef.current.getBoundingClientRect();
								const rotate = calcRotate(e.clientX, e.clientY, rect);
								cardRef.current.style.transform = `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`;
							}
						};

						// EVENT HANDLER FOR MOUSE LEAVE
						const handleMouseLeave = () => {
							const cardRef = cardRefs.current?.[index];
							if (cardRef?.current) {
								cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
							}
						};

						// RETURN FEATURE CARD
						return (
							<motion.div
								key={`${feature.title}-${feature.description}`}
								className="border-solid border-[2px] border-neutral-300 feature-card p-6 rounded-3xl shadow-xl"
								ref={cardRefs.current[index]}
								onMouseMove={handleMouseMove}
								onMouseLeave={handleMouseLeave}
							>
								{/* DISPLAY IMAGE IF AVAILABLE */}
								{feature.image && (
									<Image
										src={feature.image}
										alt={`${feature.title} image`}
										width={400}
										height={400}
										className="shadow-xl rounded-3xl mb-6"
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
