"use client";

import { BackgroundBeams } from "@/components/decoration/background-beams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import React, { useState } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { OneClickModeToggle } from "@/features/theme/OneClickModeToggle";
import ShaderGradientComponent from "@/components/decoration/shader-gradient";

// WAITLIST SECTION COMPONENT
export function WaitListSection() {
	const [email, setEmail] = useState(""); // STATE FOR EMAIL INPUT
	const [isSubmitted, setIsSubmitted] = useState(false); // STATE FOR SUBMISSION STATUS
	const { toast } = useToast(); // TOAST FOR NOTIFICATIONS

	// VALIDATE EMAIL FORMAT
	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	// HANDLE FORM SUBMISSION
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!validateEmail(email)) {
			toast({
				title: "Invalid email",
				description: "Please enter a valid email address.",
				variant: "destructive",
			});
			return;
		}

		// SEND EMAIL TO WAITLIST API WITH TOAST NOTIFICATIONS
		try {
			const response = await fetch("/api/waitlist", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();
			if (response.ok) {
				toast({
					title: "Success",
					description: data.message,
					variant: "default",
				});
				setIsSubmitted(true);
			} else {
				toast({
					title: "Error",
					description: data.message,
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "An error occurred. Please try again.",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="h-screen w-full rounded-md bg-background relative flex flex-col items-center justify-center antialiased">
			<div className="flex flex-row absolute top-4 left-5 z-10 w-full items-center justify-between ">
				<Link href="/" legacyBehavior>
					<Button
						shadow="xxl"
						borderRadius="xl"
						className="bg-black dark:bg-white hover:bg-background-900 dark:hover:bg-background-900 dark:text-black"
					>
						Back to Home
					</Button>
				</Link>
				<div className="absolute right-5 mr-5">
					<OneClickModeToggle />
				</div>
			</div>

			<Card
				className="z-10 max-w-2xl mx-auto p-4 rounded-xl border-none shadow-2xl max-sm:shadow-none max-sm:bg-transparent max-sm:dark:bg-transparent bg-transparent/10 dark:bg-transparent/30"
				style={{ backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}
			>
				{!isSubmitted ? (
					<>
						<CardHeader>
							<CardTitle className="relative z-10 text-6xl max-sm:text-4xl bg-clip-text text-center font-sans font-bold pb-5">
								JOIN THE WAITLIST
							</CardTitle>
						</CardHeader>

						<CardContent>
							<CardDescription className="text-foreground-800 dark:text-foreground-400 max-w-2xl mx-auto my-2 text-sm relative z-10 break-words hyphens-auto text-justify">
								<strong>WELCOME TO SHOWCALENDAR</strong>, your ultimate solution for
								managing personal and professional appointments is currently under
								development (WIP). Join our waitlist by entering your email address
								below. An invitation will be sent to you as soon as ShowCalendar is
								ready, with a limited technical demo scheduled for the 3rd quarter
								of 2024 and public deployment in the 4th quarter.
								<br />
								<br />
								Don&apos;t miss this exclusive opportunity to discover our
								innovative platform as soon as it launches. Sign up now to be among
								the first to benefit from our advanced features.
							</CardDescription>
						</CardContent>

						<CardFooter className="z-20 flex w-full max-w-sm items-center space-x-2 mx-auto">
							<Input
								className="z-20"
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<Button className="z-20" type="submit" onClick={handleSubmit}>
								Join Now
							</Button>
						</CardFooter>
					</>
				) : (
					<>
						<CardHeader>
							<CardTitle>
								You are on the{" "}
								<span className="text-primary font-extrabold">WAITLIST</span>
							</CardTitle>
						</CardHeader>

						<CardContent>
							<CardDescription className="text-foreground-800 dark:text-foreground-400">
								Thanks for joining ShowCalendar waitlist. We would notify you for
								beta release. <br /> Stay tuned :)
							</CardDescription>
						</CardContent>
					</>
				)}
			</Card>

			<BackgroundBeams className="hidden sm:block" />

			{/* <ShaderGradientComponent
				color1="#ff7f50"
				color2="#1e90ff"
				color3="#32cd32"
				type="plane"
				animate="on"
				uTime={1.0}
				uSpeed={0.4}
				uStrength={4}
				uDensity={1.3}
				uFrequency={5.5}
				positionX={0}
				positionY={0}
				positionZ={0}
				rotationX={0}
				rotationY={0}
				rotationZ={0}
				reflection={0.5}
				wireframe={false}
				shader="default"
			/> */}
		</div>
	);
}
