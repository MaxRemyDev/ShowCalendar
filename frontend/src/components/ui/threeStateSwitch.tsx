import { useState, useEffect } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { motion } from "framer-motion";

//TODO: NEED FIX SCRATCH CIRCLE TO RECTANGLE ANIMATION RIGHT TO LEFT

interface ThreeStateSwitchProps {
	id?: string;
	currentState: 0 | 1 | 2;
	onStateChange: (newState: 0 | 1 | 2) => void;
	icons: React.ReactNode[];
}

const ThreeStateSwitch: React.FC<ThreeStateSwitchProps> = ({
	id,
	currentState,
	onStateChange,
	icons,
}) => {
	const [position, setPosition] = useState<0 | 1 | 2>(currentState);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (currentState !== position) {
			setIsAnimating(true);
			setTimeout(() => {
				setPosition(currentState);
				setIsAnimating(false);
			}, 400);
		}
	}, [currentState, position]);

	const handleSwitch = (newPosition: 0 | 1 | 2) => {
		onStateChange(newPosition);
	};

	const positions: Record<0 | 1 | 2, string> = {
		0: "0px",
		1: "50px",
		2: "100px",
	};

	return (
		<SwitchPrimitive.Root
			id={id}
			className="cursor-pointer relative inline-flex items-center h-11 w-36 rounded-full select-none border-2 border-black overflow-hidden"
			checked={position === 1}
			onCheckedChange={() => {}}
		>
			<motion.div
				className="absolute bg-secondary shadow-md flex items-center justify-center"
				animate={{
					x: positions[position],
					width: isAnimating ? "80px" : "40px",
					height: "40px",
					borderRadius: isAnimating ? "25px" : "50%",
				}}
				transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.5 }}
			/>

			<div
				onClick={() => handleSwitch(0)}
				className="w-1/3 h-full flex justify-start items-center pl-2 z-10"
			>
				{icons[0]}
			</div>
			<div
				onClick={() => handleSwitch(1)}
				className="w-1/3 h-full flex justify-center items-center z-10"
			>
				{icons[1]}
			</div>
			<div
				onClick={() => handleSwitch(2)}
				className="w-1/3 h-full flex justify-end items-center pr-2 z-10"
			>
				{icons[2]}
			</div>
		</SwitchPrimitive.Root>
	);
};

export default ThreeStateSwitch;
