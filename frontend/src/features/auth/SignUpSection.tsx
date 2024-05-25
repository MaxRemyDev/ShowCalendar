"use client";

import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserAuthForm } from "@/components/form/auth/user-auth-form";
import { OneClickModeToggle } from "../theme/OneClickModeToggle";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import { extend } from "@react-three/fiber";
import { PlaneGeometry, MeshBasicMaterial } from "three";
import { useState, useEffect } from "react";
import { getRandomTip } from "./utils/getRandomTip";
import Image from "next/image";

extend({ PlaneGeometry, MeshBasicMaterial });

export const metadata: Metadata = {
	title: "ShowCalendar - Login",
	description: "Login to ShowCalendar",
};

export function SignUpSection() {
	const [tip, setTip] = useState({ tip: "", number: 0 });

	useEffect(() => {
		setTip(getRandomTip());
	}, []);

	return (
		<div className="relative w-full h-screen">
			<div className="relative z-10 flex flex-col items-center justify-center w-full h-full lg:grid lg:grid-cols-2">
				{/* LEFT SIDE */}
				<div className="hidden lg:block relative h-full p-10 text-white dark:border-r">
					{/* BACKGROUND SHADER GRADIENT */}
					<div className="absolute inset-0 z-0">
						<ShaderGradientCanvas pointerEvents="none">
							<ShaderGradient
								control="query"
								urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1&cAzimuthAngle=0&cDistance=5&cPolarAngle=80&cameraZoom=9.1&color1=%23414141&color2=%23818181&color3=%23212121&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=50&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=0&rotationZ=0&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=2&uFrequency=0&uSpeed=0.3&uStrength=2&uTime=8&wireframe=false"
							/>
						</ShaderGradientCanvas>
					</div>

					{/* LOGO AND BRAND NAME */}
					<div className="relative z-20 flex items-center justify-start text-lg font-medium">
						<Link href="/" legacyBehavior>
							<a className="flex items-center text-lg font-bold">
								<div className="text-xl font-bold">ShowCalendar /</div>
								<Image
									src="/ShowCalendarLogo.png"
									width={0}
									height={0}
									alt="ShowCalendar logo"
									style={{ width: "auto", height: "auto" }}
									className="filter invert ml-1"
								/>
							</a>
						</Link>
					</div>

					{/* TIPS */}
					{tip.tip && (
						<div className="absolute z-20 bottom-5 left-5">
							<blockquote className="space-y-2">
								<h3 className="text-sm text-start font-bold">
									TIPS: N°{tip.number}
								</h3>
								<p className="text-lg text-start">&ldquo;{tip.tip}&rdquo;</p>
							</blockquote>
						</div>
					)}
				</div>

				{/* RIGHT SIDE */}
				<div className="flex flex-col items-center justify-center max-sm:justify-start w-full h-full p-10 max-sm:pt-5 max-sm:pb-0 space-y-6 max-sm:space-y-0">
					{/* BUTTON LOGIN TOP RIGHT OR BOTTOM RIGHT */}
					<div className="hidden lg:flex absolute top-4 right-4 lg:bottom-5 lg:right-4 space-x-5 md:top-8 md:right-8">
						<span className="my-2"> Already have an account?</span>
						<Button
							asChild
							shadow="xxl"
							className="bg-black dark:bg-white hover:bg-background-800 dark:hover:bg-background-600 text-white dark:text-black"
						>
							<Link href="/login">Login</Link>
						</Button>
					</div>

					{/* BUTTON THEME MODE TOP RIGHT */}
					<div className="absolute bottom-5 right-4 ml-5 max-lg:top-4 lg:right-4 lg:ml-0 hidden sm:block">
						<OneClickModeToggle />
					</div>

					{/* FORM */}
					<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
						<UserAuthForm />
					</div>

					{/* BUTTON LOGIN BOTTOM RIGHT FOR LG */}
					<div className="lg:hidden absolute bottom-5 right-4 space-x-5 max-sm:bottom-20 max-sm:mx-5">
						<span> Already have an account?</span>
						<Button
							asChild
							shadow="xxl"
							className="bg-black dark:bg-white hover:bg-background-800 dark:hover:bg-background-200 text-white dark:text-black"
						>
							<Link href="/login">Login</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
