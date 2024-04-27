"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Section } from "./Section";
import styles from "./modules/HeroSection.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

export const HeroSection = () => {
	const images = ["/assets/landing/hero/AppointmentsScreenshot.png", "/assets/placeholder.svg"];

	const [[page, direction], setPage] = useState([0, 0]); // STATE FOR CURRENT PAGE AND DIRECTION

	// BUTTON CLICK HANDLER
	const paginate = useCallback(
		(newDirection: number) => {
			// COMPUTE NEW PAGE INDEX BASED ON DIRECTION
			const imageIndex = (newDirection: number) => {
				let newIndex = page + newDirection;
				if (newIndex < 0) {
					newIndex = images.length - 1;
				} else if (newIndex >= images.length) {
					newIndex = 0;
				}
				return newIndex;
			};

			// CAROUSEL IMAGE TRANSITION
			const newIndex = imageIndex(newDirection);
			setPage([newIndex, newDirection]);
		},
		[images.length, page] // DEPENDENCIES
	);

	// IMAGE CAROUSEL ANIMATION VARIANTS
	const variants = {
		enter: (direction: number) => ({
			opacity: 0.4,
			scale: 0.5,
			x: direction > 0 ? 200 : -200,
		}),
		center: {
			zIndex: 1,
			opacity: 1,
			scale: 1,
			x: 0,
		},
		exit: (direction: number) => ({
			zIndex: 0,
			opacity: 0.1,
			scale: 0.5,
			x: direction > 0 ? -200 : 200,
		}),
	};

	// CAROUSEL LOOP ANIMATION
	useEffect(() => {
		const interval = setInterval(() => {
			paginate(1);
		}, 7500); // MILLISECONDS (15 SECONDS)

		return () => clearInterval(interval);
	}, [page, paginate]);

	return (
		<Section>
			<div className="flex flex-wrap items-center lg:flex-nowrap">
				{/* TEXT SECTION */}
				<div className="lg:flex-1 lg:flex lg:items-center lg:justify-center relative">
					<div>
						{/* TODO: REWORK ON LEADING_RELAXED RESPONSIVE */}
						<h1
							className={`
								text-4xl tracking-normal font-medium text-gray-900 md:text-5xl xl:text-6xl max-w-screen-md
								leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-relaxed xl:leading-relaxed 2xl:leading-relaxed
								${styles.h1Responsive}
							`}
						>
							<span className="font-extrabold">All </span> Your Scheduling{" "}
							<span className="font-extrabold relative inline-block" id="inOne">
								in One
								<div className={styles.zLineRed}>
									<Image
										src="/assets/landing/hero/Z-LineRed.svg"
										alt="Z Line Red"
										width={300}
										height={300}
										priority
									/>
								</div>
							</span>{" "}
							Place with
							<span className="font-extrabold"> ShowCalendar.</span>
						</h1>
						<p className="mt-12 text-base text-gray-500 sm:text-lg xl:text-xl">
							Merge personal and professional schedules seamlessly in a unified tool.
							<br />
							Simplify your daily life, maximize productivity across all fronts.
						</p>
						<div className="mt-12 relative">
							<Button size="lg" className="bg-red-600 text-white">
								<Link href="/get-started" legacyBehavior>
									Get Started
								</Link>
							</Button>
							<div className="top-1/2 transform -translate-y-1/2 max-sm:ml-40 md:left-80 md:ml-80">
								<Image
									src="/assets/landing/hero/HeroShape.svg"
									alt="Decorative Shape"
									width={300}
									height={300}
									priority
								/>
							</div>
						</div>
					</div>
				</div>

				{/* IMAGE SECTION */}
				<div className="flex-1 lg:relative lg:w-1/2 max-w-screen-lg py-5 px-5 max-sm:p-5">
					{/* IMAGE CAROUSEL */}
					<div className="relative h-[555px] flex flex-col justify-end">
						<AnimatePresence initial={false} custom={direction}>
							<motion.div
								key={page}
								custom={direction}
								variants={variants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{
									x: { type: "spring", stiffness: 300, damping: 30 },
									opacity: { duration: 0.2 },
									scale: { duration: 0.2 },
								}}
								drag="x"
								dragConstraints={{ left: 0, right: 0 }}
								dragElastic={1}
								onDragEnd={(e: any, { offset, velocity }: any) => {
									const swipeThreshold = 50;
									if (Math.abs(offset.x) > swipeThreshold) {
										const newDirection = offset.x > 0 ? -1 : 1;
										paginate(newDirection);
									}
								}}
								className="absolute inset-0 flex justify-center items-center cursor-grab"
							>
								<Image
									src={images[page]}
									alt="Hero Screenshot"
									sizes="100%"
									fill={true}
									priority
									onDragStart={(e) => e.preventDefault()}
									style={{ objectFit: "contain", width: "100%", height: "100%" }}
								/>
							</motion.div>
						</AnimatePresence>
					</div>

					{/* DOTS NAVIGATION CONTAINER */}
					<div className="flex justify-center mt-5 z-10">
						{images.map((image, index) => (
							<motion.div
								key={image}
								onClick={() => setPage([index, 0])}
								initial={{ opacity: 1 }}
								animate={{ opacity: page === index ? 1 : 0.75 }}
								className={`mx-2 cursor-pointer ${
									page === index
										? "h-4 w-12 bg-red-500 rounded-full"
										: "h-4 w-4 bg-gray-300 rounded-full"
								}`}
								whileHover={{ scale: 1.25 }}
								whileTap={{ scale: 0.9 }}
							/>
						))}
					</div>
				</div>
			</div>
		</Section>
	);
};
