"use client";

import { Section } from "./Section";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useThemeBasedImageSrc } from "../theme/useThemeBasedImageSrc";

type FeatureCategory = {
	category: string;
	items: FeatureItem[];
};

type FeatureItem = {
	title: string;
	description: string;
	imagesLight?: string;
	imagesDark?: string;
	disableOnMobile: boolean;
};

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
	const imagesLight = useMemo(
		() =>
			features
				.flatMap((category) => category.items.map((item) => item.imagesLight))
				.filter((image) => image !== undefined),
		[]
	);
	const imagesDark = useMemo(
		() =>
			features
				.flatMap((category) => category.items.map((item) => item.imagesDark))
				.filter((image) => image !== undefined),
		[]
	);

	const imageSrc = useThemeBasedImageSrc(imagesLight, imagesDark);

	const getImageIndex = (image: string | undefined, imagesArray: string[]) => {
		return image ? imagesArray.indexOf(image) : -1;
	};

	const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 768px)" });
	const cardRefs = useRef<Array<HTMLDivElement | null>>(features.map(() => null));

	const [isClient, setIsClient] = useState(false);

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

	// HANDLE MOUSE AND TOUCH MOVEMENT
	const handleMovement = (index: number, clientX: number, clientY: number) => {
		const cardRef = cardRefs.current?.[index];
		if (cardRef) {
			const rect = cardRef.getBoundingClientRect();
			const rotate = calcRotate(clientX, clientY, rect);
			setDebouncedPosition(rotate);
			setActiveCard(index);
		}
	};

	// HANDLE CARD CLICK
	const handleMouseMove = (index: number) => (e: React.MouseEvent<HTMLDivElement>) => {
		handleMovement(index, e.clientX, e.clientY);
	};

	// HANDLE TOUCH MOVEMENT
	const handleTouchMove = (index: number) => (e: React.TouchEvent<HTMLDivElement>) => {
		// Prevent window from being scrolled
		e.preventDefault();
		const touch = e.touches[0];
		handleMovement(index, touch.clientX, touch.clientY);
	};

	// HANDLE MOVING END
	const handleMoveLeave = (cardIndex: number) => {
		const cardRef = cardRefs.current?.[cardIndex];
		if (cardRef) {
			cardRef.style.transform = "rotateX(0deg) rotateY(0deg)";
		}
	};

	// REQUEST ANIMATION FRAME
	useEffect(() => {
		requestRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(requestRef.current!);
	}, [animate]);

	// CLEANUP ON UNMOUNT
	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<Section>
			<div className="container mx-auto">
				<h2 className="text-3xl font-semibold text-center mb-12">
					WHAT&apos;S IN SHOWCALENDAR?
				</h2>

				{/* GRID OF FEATURE CARDS */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{features.map((category, categoryIndex) => (
						<div key={category.category} className="flex flex-col space-y-8">
							{category.items.map((feature, featureIndex) => {
								const cardIndex = categoryIndex * 100 + featureIndex;
								const imageIndex = getImageIndex(feature.imagesLight, imagesLight);
								// CHECK IF CLIENT IS ON WHICH DEVICE RENDERING AND RETURNING IT IF FUNCTION OF CARDS SHOULD BE DISPLAYED ON MOBILE OR DESKTOP
								if (isClient && (!feature.disableOnMobile || isDesktopOrLaptop)) {
									// RETURN FEATURE CARD
									return (
										<motion.div
											key={feature.title}
											className="border-solid border-[2px] border-background-200 feature-card p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center h-full"
										>
											{(feature.imagesLight || feature.imagesDark) && (
												<motion.img
													src={imageSrc[imageIndex]}
													alt={`${feature.title} image`}
													width={400}
													height={400}
													className="rounded-3xl mb-6 items-center justify-center"
													style={{
														filter: "drop-shadow(0px 0px 25px rgba(0, 0, 0, 0.25))",
													}}
													ref={(el: HTMLDivElement | null) =>
														(cardRefs.current[cardIndex] = el)
													}
													// MOUSE INTERACTIONS FOR 3D EFFECT
													onMouseMove={handleMouseMove(cardIndex)}
													onMouseLeave={() => handleMoveLeave(cardIndex)}
													// TOUCH INTERACTIONS FOR 3D EFFECT
													onTouchMove={handleTouchMove(cardIndex)}
													onTouchStart={handleTouchMove(cardIndex)}
													onTouchEnd={() => handleMoveLeave(cardIndex)}
												/>
											)}
											<div className="flex-1 flex flex-col pt-3">
												<h3 className="text-xl font-semibold mb-2">
													{feature.title}
												</h3>
												<p className="flex-1 text-foreground-400">
													{feature.description}
												</p>
											</div>
										</motion.div>
									);
								} else {
									return null;
								}
							})}
						</div>
					))}
				</div>
			</div>
		</Section>
	);
};

const features: FeatureCategory[] = [
	// FIRST VERTICAL COLUMN
	{
		category: "Organize and Collaborate",
		items: [
			{
				title: "Organize and Collaborate",
				imagesLight: "/assets/placeholder.svg",
				imagesDark: "/assets/placeholder-Dark.svg",
				description:
					"Streamline your planning and collaboration with easy scheduling, real-time updates, and integration with the tools you love.",
				disableOnMobile: false,
			},
			{
				title: "Intuitive Scheduling",
				description:
					"Organize your day with ease using a simple drag-and-drop interface and customizable calendar views.",
				disableOnMobile: true,
			},
			{
				title: "Real-Time Collaboration",
				description:
					"Invite colleagues to events, share your availability, and schedule together effortlessly.",
				disableOnMobile: true,
			},
			{
				title: "Sync with Your Favorite Tools",
				description:
					"Connect ShowCalendar with other apps for seamless synchronization and enhanced productivity.",
				disableOnMobile: true,
			},
		],
	},

	// SECOND VERTICAL COLUMN
	{
		category: "Stay Informed and Personalized",
		items: [
			{
				title: "Stay Informed and Personalized",
				imagesLight: "/assets/placeholder.svg",
				imagesDark: "/assets/placeholder-Dark.svg",
				description:
					"Get timely reminders, tailor your experience to fit your style, and enjoy the convenience of accessing your calendar wherever you are.",
				disableOnMobile: false,
			},
			{
				title: "Automatic Reminders",
				description:
					"Never miss an important appointment with custom reminders and push notifications.",
				disableOnMobile: true,
			},
			{
				title: "Advanced Customization",
				description:
					"Create a calendar that reflects your style with customizable themes and flexible settings.",
				disableOnMobile: true,
			},
			{
				title: "Access Anywhere, Anytime",
				description:
					"Manage your schedule from any device, at any time, with secure cloud syncing.",
				disableOnMobile: true,
			},
		],
	},

	// THIRD VERTICAL COLUMN
	{
		category: "Support, Security, and Insights",
		items: [
			{
				title: "Support, Security, and Insights",
				imagesLight: "/assets/placeholder.svg",
				imagesDark: "/assets/placeholder-Dark.svg",
				description:
					"Rely on our dedicated support team, trust in our robust security measures, and gain valuable insights from comprehensive reports.",
				disableOnMobile: false,
			},
			{
				title: "Dedicated Customer Support",
				description:
					"Our team is always on hand to help you make the most of ShowCalendar.",
				disableOnMobile: true,
			},
			{
				title: "Data Protection",
				description:
					"We take security seriously with end-to-end encryption for your information and calendars.",
				disableOnMobile: true,
			},
			{
				title: "Insights and Reports",
				description:
					"Make informed decisions with detailed reports on your time management and activities.",
				disableOnMobile: true,
			},
		],
	},
];
