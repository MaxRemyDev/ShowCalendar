import React from "react";
import { cn } from "@/lib/utils";

type SpinnerProps = {
	size?: "small" | "medium" | "large";
	borderSize?: "small" | "medium" | "large";
	borderColor?: "primary" | "secondary" | "destructive" | "custom";
	className?: string;
};

const spinnerSizeClasses = {
	small: "h-8 w-8",
	medium: "h-12 w-12",
	large: "h-16 w-16",
};

const borderSizeClasses = {
	small: "border-2",
	medium: "border-4",
	large: "border-8",
};

const borderColorClasses = {
	primary: "border-t-primary",
	secondary: "border-t-secondary",
	destructive: "border-t-destructive",
	custom: "",
};

const Spinner: React.FC<SpinnerProps> = ({
	size = "medium",
	borderSize = "medium",
	borderColor = "primary",
	className,
}) => {
	return (
		<div
			className={cn(
				"animate-spin rounded-full border-solid ",
				spinnerSizeClasses[size],
				borderSizeClasses[borderSize],
				borderColorClasses[borderColor],
				className
			)}
		/>
	);
};

export default Spinner;
