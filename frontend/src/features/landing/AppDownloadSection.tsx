"use client";

import React from "react";
import { Section } from "./Section";
import Image from "next/image";
import { motion } from "framer-motion";

export const AppDownloadSection = () => {
	return (
		<Section>
			<div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
				{/* IPHONE SCREENSHOT */}
				<motion.div
					className="relative justify-center flex md:flex-1 mb-8 md:mb-0 md:mr-8"
					whileHover={{ scale: [null, 1.2, 1.1] }}
					transition={{ duration: 0.3 }}
				>
					<Image
						src="/assets/landing/app-download/Iphone-Screenshot.svg"
						alt="iPhone App Screenshot"
						width={300}
						height={600}
						className="rounded-lg shadow-2xl"
					/>
				</motion.div>

				{/* TEXT AND DOWNLOAD BADGES */}
				<div className="md:flex-1">
					<h2 className="text-4xl font-bold">DOWNLOAD THE MOBILE APP</h2>
					<p className="my-8">
						Stay organized on the go with the{" "}
						<span className="font-semibold">ShowCalendar mobile app</span>. Download now
						for instant access to your scheduling and productivity tools. Available on
						iOS and Android.
					</p>
					<div className="flex justify-center md:justify-start gap-4">
						<motion.a
							href="https://www.apple.com/app-store/"
							target="_blank"
							rel="noopener noreferrer"
							whileHover={{ scale: 1.2 }}
							whileTap={{ scale: 0.9 }}
							transition={{ type: "spring", stiffness: 400, damping: 17 }}
						>
							<Image
								src="/assets/landing/app-download/AppleStore-Badge.svg"
								alt="Download on the App Store"
								width={140}
								height={50}
								className="shadow-2xl"
							/>
						</motion.a>
						<motion.a
							href="https://play.google.com/store"
							target="_blank"
							rel="noopener noreferrer"
							whileHover={{ scale: 1.2 }}
							whileTap={{ scale: 0.9 }}
							transition={{ type: "spring", stiffness: 400, damping: 17 }}
						>
							<Image
								src="/assets/landing/app-download/PlayStore-Badge.svg"
								alt="Get it on Google Play"
								width={150}
								height={50}
								className="shadow-2xl"
							/>
						</motion.a>
					</div>
				</div>
			</div>
		</Section>
	);
};
