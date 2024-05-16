import { Check, Hammer, Minus, X } from "lucide-react";

const getStatusIcon = (decorationType: "check" | "line" | "x" | "work") => {
	const decorations: { [key: string]: JSX.Element } = {
		check: <Check className="text-greenColor" />,
		line: <Minus className="text-orangeColor" />,
		x: <X className="text-redColor" />,
		work: <Hammer className="text-orangeColor" />,
	};
	return decorations[decorationType] || null;
};

export default getStatusIcon;
