import * as React from "react";

import { cn } from "@/lib/utils";
import { Separator } from "./separator";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	icon?: React.ReactNode;
	actionButton?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, icon, actionButton, ...props }, ref) => {
		return (
			<div className="flex items-center border border-input rounded-md overflow-hidden">
				{icon && (
					<>
						<div className="flex items-center justify-center size-10">{icon}</div>
						<Separator orientation="vertical" />
					</>
				)}
				<input
					type={type}
					className={cn(
						"flex-1 h-10 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-ring focus-visible:outline-ring focus-visible:outline-2 focus-visible:-outline-offset-1",
						className
					)}
					ref={ref}
					{...props}
				/>
				{actionButton && (
					<>
						<Separator orientation="vertical" />
						<div className="flex items-center">{actionButton}</div>
					</>
				)}
			</div>
		);
	}
);

Input.displayName = "Input";

export { Input };
