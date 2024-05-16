"use client";

import { Section } from "./Section";
import AnimatedGradientText from "@/components/decoration/animated-gradient-text";
import AnimatedShinyText from "@/components/decoration/animated-shiny-text";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export const BannerHero = () => {
	return (
		<Section className="border-none pb-0">
			<div className="flex justify-center items-center w-full">
				<motion.div
					className="flex items-center gap-2"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					transition={{ type: "spring", stiffness: 400, damping: 17 }}
				>
					<Link href="/pricing">
						<AnimatedGradientText>
							<Badge className="bg-[#D4F7F0] text-[#067A6E]">NEW</Badge>
							<hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300 hidden md:inline" />
							<Image
								src="/assets/landing/hero/partying-face.webp"
								alt="Partying Face"
								width={32}
								height={32}
								className="max-sm:mx-1"
							/>
							<span
								className={cn(
									"inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent"
								)}
							>
								<span className="inline sm:hidden">
									Enjoy <strong>40% OFF</strong> paid Annually
								</span>
								<span className="hidden sm:inline lg-custom:hidden">
									Enjoy <strong className="text-lg">40% OFF</strong> for the
									Annual Subscription
								</span>
								<span className="hidden lg-custom:inline">
									Enjoy <strong className="text-lg">40% OFF</strong> for the
									Annual Subscription, now only{" "}
									<strong className="text-lg">$15 USD per month</strong> instead
									of $25 USD
								</span>
							</span>
							<hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300 hidden md:inline" />
							<AnimatedShinyText className="hidden md:inline">
								Subscribe
							</AnimatedShinyText>
							<div className="group">
								<ChevronRight className="max-sm:ml-0 ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:scale-150" />
							</div>
						</AnimatedGradientText>
					</Link>
				</motion.div>
			</div>
		</Section>
	);
};
