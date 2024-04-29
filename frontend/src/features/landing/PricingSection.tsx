"use client";

import React from "react";
import { Section } from "./Section";
import { Check, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import Link from "next/link";

// FEATURE DECORATION COMPONENT
type FeatureWithDecoration = {
	text: string;
	decoration: React.ReactNode;
};

// PRICING OPTION COMPONENT
interface PricingOption {
	title: string;
	description: string;
	price: string;
	priceAnnually?: string;
	paidMonthly?: string;
	perMonth?: boolean;
	paidAnnually?: string;
	features: FeatureWithDecoration[];
	buttonText: string;
	mostPopular?: boolean;
}

// DECORATION ICON COMPONENT
const getDecorationIcon = (decorationType: "check" | "line" | "x") => {
	const decorations: { [key: string]: JSX.Element } = {
		check: <Check className="text-green-500" />,
		line: <Minus className="text-orange-300" />,
		x: <X className="text-red-500" />,
	};
	return decorations[decorationType] || null;
};

// PRICING OPTIONS DATA
const pricingOptions: PricingOption[] = [
	// FREE CARD
	{
		title: "Free",
		description: "Start with essential scheduling tools at no cost, perfect for personal use.",
		price: "$0",
		features: [
			{ text: "Basic Calendar Integration", decoration: getDecorationIcon("check") },
			{ text: "Access to Standard Features", decoration: getDecorationIcon("check") },
			{ text: "Single User Access", decoration: getDecorationIcon("check") },
			{ text: "Community Support", decoration: getDecorationIcon("check") },
			{ text: "Limited Feature", decoration: getDecorationIcon("line") },
		],
		buttonText: "Select",
	},

	// PREMIUM CARD
	{
		title: "Premium",
		description: "Enhance your productivity with advanced features and priority support.",
		price: "$25",
		priceAnnually: "$180",
		perMonth: true,
		paidAnnually: "$15 USD per month, paid annually",
		paidMonthly: "Instead of $300 per year, paid monthly",
		features: [
			{ text: "Multi-Calendar Sync", decoration: getDecorationIcon("check") },
			{ text: "Advanced Task Management", decoration: getDecorationIcon("check") },
			{ text: "Custom Event Reminders", decoration: getDecorationIcon("check") },
			{ text: "Detailed Analytics", decoration: getDecorationIcon("check") },
			{ text: "Priority Email Support", decoration: getDecorationIcon("check") },
			{ text: "Unlimited Feature", decoration: getDecorationIcon("check") },
			{ text: "Access beta functionality", decoration: getDecorationIcon("check") },
			{ text: "Add 2 Users Access", decoration: getDecorationIcon("check") },
		],
		buttonText: "Select",
		mostPopular: true,
	},

	// ENTERPRISE CARD
	{
		title: "Enterprise",
		description:
			"Collaborate effectively with full team integration and exclusive enterprise features.",
		price: "Contact Us",
		features: [
			{ text: "Team Collaboration Tools", decoration: getDecorationIcon("check") },
			{ text: "Unlimited Calendar Integration", decoration: getDecorationIcon("check") },
			{ text: "Customizable Team Permissions", decoration: getDecorationIcon("check") },
			{ text: "Integration with Enterprise Tools", decoration: getDecorationIcon("check") },
			{ text: "Dedicated Phone Support", decoration: getDecorationIcon("check") },
			{ text: "Onboarding and Training", decoration: getDecorationIcon("check") },
		],
		buttonText: "Select",
	},
];

// PRICING CARD COMPONENT
const PricingCard: React.FC<PricingOption> = ({
	title,
	description,
	price,
	priceAnnually,
	perMonth,
	paidAnnually,
	paidMonthly,
	features,
	buttonText,
	mostPopular,
}) => (
	<motion.div
		whileHover={{ scale: 1.05 }}
		className={`relative flex flex-col border-4 p-6 rounded-2xl text-center transition-all duration-300 ${
			mostPopular ? "border-red-500 shadow-lg" : "border-gray-200"
		} h-full`}
	>
		{/* FAKE MOST POPULAR CARD */}
		{mostPopular && (
			<span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 px-3 py-1 text-red-500 text-sm font-bold mb-4 inline-block rounded-full border-2 border-red-500">
				Most Popular
			</span>
		)}

		{/* TITLE WITH DESCRIPTION */}
		<h3 className="text-3xl font-semibold mb-4">{title}</h3>
		<p className="text-sm mb-4">{description}</p>

		{/* PRICING INFORMATION WITH CHANGE STATE */}
		<div className="flex justify-center items-baseline">
			<p className="text-4xl font-bold mb-2">
				{title === "Premium" && !perMonth ? priceAnnually : price}
			</p>
			{title === "Premium" && (
				<span className="text-xl font-sm ml-2 tracking-tighter">
					{perMonth ? "/Month" : "/Year"}
				</span>
			)}
		</div>

		{/* PRICING AND FEATURE TEXT WITH DECORATION*/}
		<p className="text-xs text-gray-500 mb-6">{!perMonth ? paidMonthly : paidAnnually}</p>
		<ul className="flex-1 ">
			{features.map((feature) => (
				<li key={feature.text} className="my-2 ml-5 text-left flex items-center">
					{feature.decoration}
					<span className="ml-2">{feature.text}</span>
				</li>
			))}
		</ul>

		{/* SELECT BUTTON */}
		<Button
			variant={`${mostPopular ? "secondary" : "outline"}`}
			className={`mt-auto py-2 my-5 px-4 rounded-3xl border-[3px] border-red-500 hover:bg-red-600 hover:text-white ${
				mostPopular ? "bg-red-500 hover:bg-red-600 border-none text-white" : "text-red-500"
			}`}
			asChild
		>
			<Link href="/">{buttonText}</Link>
		</Button>
	</motion.div>
);

export const PricingSection = () => {
	const [isYearly, setIsYearly] = React.useState(false); // TRACK STATE OF SWITCH

	// HANDLES CHANGE EVENT FOR SWITCH PRICING
	const handleSwitchChange = () => {
		setIsYearly(!isYearly);
	};

	return (
		<Section>
			{/* SECTION TITLE */}
			<div className="text-center">
				<h2 className="text-4xl font-bold mb-6">PRICING</h2>
				<p className="mb-10">
					Choose the plan that fits your needs and start optimizing your schedule today.
					<br />
					From individual use to team collaboration, ShowCalendar has a solution for
					everyone.
				</p>
			</div>
			{/* SWITCH WITH TOOLTIP */}
			<div className="flex flex-col items-center space-y-2 mb-8">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger className="mb-1 ml-28">
							<Badge variant="default" className="bg-gray-400">
								40% OFF
							</Badge>
						</TooltipTrigger>
						<TooltipContent className="mb-2">
							<p>
								Enjoy 40% OFF 🥳 for the Annual Subscription, now only $15 USD per
								month instead of $25 USD
							</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<div className="flex items-center space-x-2">
					<Label htmlFor="pricing-mode">Monthly</Label>
					<Switch
						id="pricing-mode"
						checked={isYearly}
						onCheckedChange={handleSwitchChange}
					/>
					<Label htmlFor="pricing-mode">Yearly</Label>
				</div>
			</div>

			{/* PRICING CARDS RENDER */}
			<div className="flex flex-wrap justify-center gap-4 mx-auto p-4 items-stretch">
				{pricingOptions.map((option) => (
					<div
						key={option.title}
						className={`flex-1 px-2 mb-4 min-w-[280px] max-w-[350px] ${
							option.mostPopular ? "" : "py-5"
						}`}
					>
						<PricingCard {...option} perMonth={!isYearly} />
					</div>
				))}
			</div>
		</Section>
	);
};
