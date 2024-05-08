import React, { useState, useEffect } from "react";
import { useId } from "react";

interface DotPatternProps {
	dotSize?: number;
	hoverIncrease?: number;
	className?: string;
}

export function DotPattern({ dotSize = 1, hoverIncrease = 4, className }: DotPatternProps) {
	const id = useId();
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

	useEffect(() => {
		function handleResize() {
			setSize({ width: window.innerWidth, height: window.innerHeight });
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	function calculateRadius(dotX: number, dotY: number) {
		const distance = Math.sqrt(
			Math.pow(dotX - mousePosition.x, 2) + Math.pow(dotY - mousePosition.y, 2)
		);
		if (distance < 50) {
			return dotSize + hoverIncrease * (1 - distance / 50);
		}
		return dotSize;
	}

	function handleMouseMove(event: React.MouseEvent<SVGSVGElement>) {
		setMousePosition({
			x: event.nativeEvent.offsetX,
			y: event.nativeEvent.offsetY,
		});
	}

	const step = 40;
	const pattern = Array.from({
		length: (size.width / step) * (size.height / step),
	}).map((_, index) => {
		const x = (index % (size.width / step)) * step;
		const y = Math.floor(index / (size.width / step)) * step;
		return <circle key={index} cx={x} cy={y} r={calculateRadius(x, y)} fill="gray" />;
	});

	return (
		<svg
			onMouseMove={handleMouseMove}
			className={className}
			style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
		>
			<defs>
				<pattern
					id={id}
					width={size.width}
					height={size.height}
					patternUnits="userSpaceOnUse"
				>
					{pattern}
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill={`url(#${id})`} />
		</svg>
	);
}

export default DotPattern;
