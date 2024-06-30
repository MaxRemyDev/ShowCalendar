import React from "react";
import { X } from "lucide-react";
import { isPastDate } from "../helpers/utils";

interface PastDateIndicatorProps {
	date: Date;
}

const PastDateIndicator: React.FC<PastDateIndicatorProps> = ({ date }) => {
	const isPast = isPastDate(date);
	return isPast ? (
		<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[999] bg-background opacity-50">
			<X
				className="text-background-500"
				opacity={0.5}
				size={200}
				strokeWidth={3}
				absoluteStrokeWidth
			/>
		</div>
	) : null;
};

export default PastDateIndicator;
