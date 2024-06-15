import React from "react";
import { X } from "lucide-react";
import { isPastDate } from "../helpers/utils";

interface PastDateIndicatorProps {
	date: number;
	month: number;
	year: number;
}

const PastDateIndicator: React.FC<PastDateIndicatorProps> = ({ date, month, year }) => {
	return isPastDate(year, month, date) ? (
		<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
			<X
				className="text-background-500"
				opacity={0.75}
				size={200}
				strokeWidth={2}
				absoluteStrokeWidth
			/>
		</div>
	) : null;
};

export default PastDateIndicator;
