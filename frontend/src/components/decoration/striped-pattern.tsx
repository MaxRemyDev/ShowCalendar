import React from "react";
import { cn } from "@/lib/utils";

interface StripedBackgroundProps {
	children: React.ReactNode;
	className?: string;
}

const StripedPattern: React.FC<StripedBackgroundProps> = ({ children, className }) => {
	return (
		<div className={cn("relative w-full h-full", className)}>
			<div
				className="absolute inset-0 pointer-events-none w-full h-full bg-[length:15px_15px]
                           bg-[linear-gradient(45deg,_rgba(0,0,0,0.05)_25%,_transparent_25%,_transparent_50%,_rgba(0,0,0,0.05)_50%,_rgba(0,0,0,0.05)_75%,_transparent_75%,_transparent)]
                           dark:bg-[linear-gradient(45deg,_rgba(255,255,255,0.05)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.05)_50%,_rgba(255,255,255,0.05)_75%,_transparent_75%,_transparent)]"
			/>
			{children}
		</div>
	);
};

export default StripedPattern;
