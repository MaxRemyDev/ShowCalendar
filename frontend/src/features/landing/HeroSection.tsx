import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Section } from "./Section";
import styles from "./modules/HeroSection.module.css";

export const HeroSection = () => {
	return (
		<Section>
			<div className="flex flex-wrap items-center lg:flex-nowrap">
				{/* TEXT SECTION */}
				<div className="lg:flex-1 lg:flex lg:items-center lg:justify-center relative">
					<div>
						{/* TODO: REWORK ON LEADING_RELAXED RESPONSIVE */}
						<h1
							className={`text-4xl tracking-normal font-medium text-gray-900 md:text-5xl xl:text-6xl max-w-screen-md
							leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-relaxed xl:leading-relaxed 2xl:leading-relaxed ${styles.h1Responsive}`}
						>
							<span className="font-extrabold">All </span> Your Scheduling{" "}
							<span className="font-extrabold relative inline-block" id="inOne">
								in One
								<div className={styles.zLineRed}>
									<Image
										src="/assets/landing/hero/Z-LineRed.svg"
										alt="Z Line Red"
										layout="intrinsic"
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
				<div className="flex-1 flex lg:relative lg:w-1/2 max-w-screen-lg p-10 max-sm:p-5">
					<Image
						src="/assets/landing/hero/AppointmentsScreenshot.png"
						alt="Appointments Screenshot"
						layout="responsive"
						width={700}
						height={400}
						objectFit="contain"
						priority
					/>
				</div>
			</div>
		</Section>
	);
};
