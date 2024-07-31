"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	[
		"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors",
		/* Disabled */
		"data-[disabled]:pointer-events-none data-[disabled]:opacity-50 disabled:pointer-events-none disabled:opacity-50",
		/* Focus Visible */
		"data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ",
		/* Resets */
		"focus-visible:outline-none",
	],
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-secondary",
				destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"border border-input bg-background hover:bg-accent hover:text-accent-foreground",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-black underline-offset-4 hover:underline",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 px-3",
				lg: "h-11 px-8",
				xl: "h-14 px-14",
				xxl: "h-16 px-16",
				xxxl: "h-16 px-28",
				icon: "h-10 w-10",
			},
			border: {
				default: "",
			},
			borderRadius: {
				default: "rounded-md",
				lg: "rounded-lg",
				xl: "rounded-xl",
				xxl: "rounded-2xl",
				xxxl: "rounded-3xl",
				full: "rounded-full",
				none: "rounded-none",
			},
			textSize: {
				default: "text-sm",
				md: "text-md",
				lg: "text-lg",
				xl: "text-xl",
				xxl: "text-2xl",
				xxxl: "text-3xl",
			},
			shadow: {
				default: "",
				primary: "shadow-2xl shadow-primary",
				secondary: "shadow-2xl shadow-secondary",
				sm: "shadow-sm",
				lg: "shadow-lg",
				xl: "shadow-xl",
				xxl: "shadow-2xl",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			border: "default",
			borderRadius: "default",
			textSize: "default",
			shadow: "default",
		},
	}
);

interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps & AriaButtonProps>(
	(
		{
			className,
			variant,
			size,
			border,
			borderRadius,
			textSize,
			shadow,
			disabled,
			asChild = false,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : "button";

		return (
			<Comp
				className={cn(
					buttonVariants({
						variant,
						size,
						border,
						borderRadius,
						textSize,
						shadow,
						className,
					})
				)}
				disabled={disabled}
				ref={ref}
				{...props}
			/>
		);
	}
);

Button.displayName = "Button";

export { Button, buttonVariants };
