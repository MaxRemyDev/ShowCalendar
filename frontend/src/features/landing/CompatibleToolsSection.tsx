"use client";

import { Section } from "./Section";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faDiscord, faGoogle, faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";

export const CompatibleToolsSection = () => {
	return (
		<Section>
			<div className="mx-auto px-4 text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
				<h2 className="text-4xl font-bold">COMPATIBLE TOOLS</h2>
				<div className="mt-8 flex flex-wrap items-center justify-center text-background-300 sm:justify-between">
					{/* Apple */}

					<motion.a
						href="https://www.apple.com/"
						className="mb-10 mr-10 hover:text-background-800 lg:mb-0"
						whileHover={{ scale: 1.2 }}
						whileTap={{ scale: 0.9 }}
						transition={{ type: "spring", stiffness: 400, damping: 17 }}
					>
						<FontAwesomeIcon icon={faApple} className="size-20" />
					</motion.a>

					{/* Google */}
					<motion.a
						href="https://www.google.com/"
						className="mb-10 mr-10 hover:text-background-800 lg:mb-0"
						whileHover={{ scale: 1.2 }}
						whileTap={{ scale: 0.9 }}
						transition={{ type: "spring", stiffness: 400, damping: 17 }}
					>
						<FontAwesomeIcon icon={faGoogle} className="size-20" />
					</motion.a>

					{/* Microsoft */}
					<motion.a
						href="https://www.microsoft.com/"
						className="mb-10 mr-10 hover:text-background-800 lg:mb-0"
						whileHover={{ scale: 1.2 }}
						whileTap={{ scale: 0.9 }}
						transition={{ type: "spring", stiffness: 400, damping: 17 }}
					>
						<FontAwesomeIcon icon={faMicrosoft} className="size-20" />
					</motion.a>

					{/* Zoom */}
					{/* <motion.a
						href="https://zoom.us/"
						className="mb-10 mr-10 hover:text-background-800 lg:mb-0"
						whileHover={{ scale: 1.2 }}
						whileTap={{ scale: 0.9 }}
						transition={{ type: "spring", stiffness: 400, damping: 17 }}
					>
						<FontAwesomeIcon icon={faZoom} className="size-20" />
					</motion.a> */}

					{/* Discord */}
					<motion.a
						href="https://discord.com/"
						className="mb-10 mr-10 hover:text-background-800 lg:mb-0"
						whileHover={{ scale: 1.2 }}
						whileTap={{ scale: 0.9 }}
						transition={{ type: "spring", stiffness: 400, damping: 17 }}
					>
						<FontAwesomeIcon icon={faDiscord} className="size-20" />
					</motion.a>
				</div>
			</div>
		</Section>
	);
};
