"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Section } from "./Section";
import styles from "./modules/HeroSection.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useThemeBasedImageSrc } from "../theme/useThemeBasedImageSrc";

export const HeroSection = () => {
	// IMAGE CAROUSEL IMAGES
	const imagesLight = useMemo(
		() => ["/assets/landing/hero/AppointmentsScreenshot.png", "/assets/placeholder.svg"],
		[]
	);
	const imagesDark = useMemo(
		() => [
			"/assets/landing/hero/AppointmentsScreenshot-Dark.png",
			"/assets/placeholder-Dark.svg",
		],
		[]
	);

	const imageSrc = useThemeBasedImageSrc(imagesLight, imagesDark);

	// IMAGE CAROUSEL STATES
	const [[page, direction], setPage] = useState([0, 0]);
	const [imageLoaded, setImageLoaded] = useState(Array(imagesLight.length).fill(false));

	// IMAGE LOAD HANDLER
	const handleLoad = (index: number) => {
		const newLoadedState = [...imageLoaded];
		newLoadedState[index] = true;
		setImageLoaded(newLoadedState);
	};

	// BUTTON CLICK HANDLER
	const paginate = useCallback(
		(newDirection: number) => {
			// COMPUTE NEW PAGE INDEX BASED ON DIRECTION
			const imageIndex = (newDirection: number) => {
				let newIndex = page + newDirection;
				if (newIndex < 0) {
					newIndex = imagesLight.length - 1;
				} else if (newIndex >= imagesLight.length) {
					newIndex = 0;
				}
				return newIndex;
			};

			// CAROUSEL IMAGE TRANSITION
			const newIndex = imageIndex(newDirection);
			setPage([newIndex, newDirection]);
		},
		[imagesLight.length, page] // DEPENDENCIES
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
			opacity: 0.0,
			scale: 0.5,
			x: direction > 0 ? -250 : 500,
		}),
	};

	// CAROUSEL LOOP ANIMATION
	useEffect(() => {
		const interval = setInterval(() => {
			paginate(1);
		}, 7500); // MILLISECONDS (7.5 SECONDS)

		return () => clearInterval(interval);
	}, [page, paginate]);

	return (
		<Section>
			<div className="container flex flex-col xl:flex-row items-center max-w-screen-xl mx-auto px-4">
				{/* TEXT & BUTTON SECTION */}
				<div className="flex flex-col items-center xl:items-start text-center xl:text-left xl:w-1/2 mb-12 xl:mb-0">
					<h1 className={`text-5xl max-sm:text-4xl font-medium ${styles.leadingRelaxed}`}>
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
					<p className=" mt-6 text-base xl:text-lg text-foreground-400">
						Merge personal and professional schedules seamlessly in a unified tool.{" "}
						<br className="hidden sm:inline" />
						Simplify your daily life, maximize productivity across all fronts.
					</p>

					<div className="mt-8">
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							transition={{ type: "spring", stiffness: 400, damping: 17 }}
							className="z-10 w-fit"
						>
							<Link href="/waitlist" legacyBehavior>
								<Button
									size="xxxl"
									borderRadius="xxxl"
									textSize="lg"
									shadow="primary"
									className="text-foreground-50 z-10 h-16 px-28"
								>
									JOIN WAITLIST
								</Button>
							</Link>
						</motion.div>

						<div className="hidden md:block z-0 pointer-events-none top-1/2 transform -translate-y-1/2 md:ml-80">
							<Image
								src="/assets/landing/hero/HeroShape.svg"
								alt="Decorative Shape"
								width={300}
								height={300}
								priority
								className="dark:filter dark:invert dark:brightness dark:opacity-75"
							/>
						</div>
					</div>
				</div>

				{/* IMAGE CAROUSEL & DOTS NAVIGATION SECTION */}
				<div className="relative xl:w-1/2 w-full xl:pl-12">
					{/* IMAGE CAROUSEL */}
					<div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] flex justify-center items-center">
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
								className="absolute inset-0 flex justify-center items-center"
							>
								<Image
									src={imageSrc[page]}
									alt="Hero Screenshot"
									sizes="100%"
									fill={true}
									onDragStart={(e) => e.preventDefault()}
									style={{
										display: imageLoaded[page] ? "block" : "none",
										transition: "opacity 1s ease-in-out",
										objectFit: "contain",
										width: "100%",
										height: "100%",
									}}
									className="drop-shadow-all cursor-grab"
									onLoad={() => handleLoad(page)}
									priority
								/>
							</motion.div>
						</AnimatePresence>
					</div>

					{/* DOTS NAVIGATION CONTAINER */}
					<div className="flex justify-center z-10">
						{imagesLight.map((_, index) => (
							<motion.div
								key={index}
								onClick={() => setPage([index, 0])}
								initial={{ opacity: 1 }}
								animate={{ opacity: page === index ? 1 : 0.75 }}
								className={`mx-2 cursor-pointer ${
									page === index
										? "h-4 w-12 bg-primary shadow-lg shadow-secondary rounded-full"
										: "h-4 w-4 bg-background-300 rounded-full"
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
