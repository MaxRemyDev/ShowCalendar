import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WidgetProps {
	title?: string;
	content?: string | number | React.ReactNode;
	icon?: React.ReactNode;
	description?: string;
	className?: string;
	customContent?: React.ReactNode;
	gridArea?: string;
	isEditing?: boolean;
	isSelected?: boolean;
	onSelect?: () => void;
}

const Widget: React.FC<WidgetProps> = ({
	title,
	content,
	icon,
	description,
	className,
	customContent,
	gridArea,
	isEditing,
	isSelected,
	onSelect,
}) => {
	const isEditingValue = isEditing ?? false;

	const handleMouseDown = (e: React.MouseEvent) => {
		if (onSelect) {
			onSelect();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			if (onSelect) {
				onSelect();
			}
		}
	};

	const borderClass = isEditingValue ? "border-dashed rounded-md border-2" : "";
	const borderColorClass = isSelected ? "border-red-500" : "border-background-400";

	return (
		<motion.div
			style={{ gridArea: gridArea }}
			className={cn(
				`p-1 ${className} ${borderClass} ${borderColorClass}`,
				isEditingValue ? "" : "pointer-events-auto"
			)}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3 }}
			tabIndex={isEditingValue ? 0 : -1}
			onMouseDown={isEditingValue ? handleMouseDown : undefined}
			onClick={(e) => {
				e.stopPropagation();
			}}
			onKeyDown={isEditingValue ? handleKeyDown : undefined}
		>
			<Card className={isEditingValue ? "pointer-events-none" : "pointer-events-auto"}>
				<CardHeader className="flex flex-col items-start space-y-2">
					<div className="flex items-center justify-between w-full">
						<CardTitle className="text-sm font-medium">{title}</CardTitle>
						{icon}
					</div>
					{description && <CardDescription>{description}</CardDescription>}
				</CardHeader>
				<CardContent>
					{customContent ? (
						customContent
					) : (
						<div className="text-2xl font-bold">{content}</div>
					)}
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default Widget;
