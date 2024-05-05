import { useState } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SwitchAnimateProps {
	id?: string;
	checked: boolean;
	onCheckedChange: (isChecked: boolean) => void;
}

const SwitchAnimate: React.FC<SwitchAnimateProps> = ({ id, checked, onCheckedChange }) => {
	return (
		<SwitchPrimitive.Root
			id={id}
			className={cn(
				"cursor-pointer relative inline-flex items-center h-6 w-11 rounded-full",
				checked ? "bg-primary" : "bg-secondary"
			)}
			checked={checked}
			onCheckedChange={onCheckedChange}
		>
			<motion.div
				className="absolute left-0.5 top-0.5"
				animate={{
					x: checked ? "1.25rem" : "0rem",
				}}
				transition={{ type: "spring", stiffness: 500, damping: 20 }}
			>
				<SwitchPrimitive.Thumb
					className={cn("block w-5 h-5 bg-white rounded-full shadow-md")}
				/>
			</motion.div>
		</SwitchPrimitive.Root>
	);
};

export default SwitchAnimate;
