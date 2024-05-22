import {
	Check,
	CircleCheck,
	CircleCheckBig,
	CircleMinus,
	CircleX,
	Construction,
	Hammer,
	Minus,
	X,
} from "lucide-react";

const getStatusIcon = (
	decorationType:
		| "check"
		| "circleCheck"
		| "circleCheckBig"
		| "line"
		| "circleLine"
		| "x"
		| "circleX"
		| "work"
		| "work2"
) => {
	const decorations: { [key: string]: JSX.Element } = {
		check: <Check className="text-greenColor" />,
		circleCheck: <CircleCheck className="text-greenColor" />,
		circleCheckBig: <CircleCheckBig className="text-greenColor" />,

		line: <Minus className="text-orangeColor" />,
		circleLine: <CircleMinus className="text-orangeColor" />,

		x: <X className="text-redColor" />,
		circleX: <CircleX className="text-redColor" />,

		work: <Hammer className="text-orangeColor" />,
		work2: <Construction className="text-orangeColor" />,
	};
	return decorations[decorationType] || null;
};

export default getStatusIcon;
