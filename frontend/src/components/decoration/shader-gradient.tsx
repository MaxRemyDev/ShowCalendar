"use client";

import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ShaderGradient } from "shadergradient";

//TODO: FIX ERROR - TypeError: Cannot read properties of undefined (reading 'plane')
//INFO: THIS COMPONENT WORK BEFORE ADDED MORE INTERFACE PROPS

interface ShaderGradientProps {
	color1?: string;
	color2?: string;
	color3?: string;
	type?: "plane" | "sphere" | "waterPlane";
	animate?: "on" | "off";
	uTime?: number;
	uSpeed?: number;
	uStrength?: number;
	uDensity?: number;
	uFrequency?: number;
	positionX?: number;
	positionY?: number;
	positionZ?: number;
	rotationX?: number;
	rotationY?: number;
	rotationZ?: number;
	reflection?: number;
	wireframe?: boolean;
	shader?: string;
}

const ShaderGradientComponent: React.FC<ShaderGradientProps> = ({
	color1 = "#ff0000",
	color2 = "#00ff00",
	color3 = "#0000ff",
	type = "plane",
	animate = "on",
	uTime = 1.0,
	uSpeed = 0.4,
	uStrength = 4,
	uDensity = 1.3,
	uFrequency = 5.5,
	positionX = 0,
	positionY = 0,
	positionZ = 0,
	rotationX = 0,
	rotationY = 0,
	rotationZ = 0,
	reflection = 0.5,
	wireframe = false,
	shader = "default",
}) => {
	const [dimensions, setDimensions] = useState({ width: 500, height: 500 });

	useEffect(() => {
		if (typeof window !== "undefined") {
			setDimensions({ width: window.innerWidth, height: window.innerHeight });
		}
	}, []);

	return (
		<div style={{ width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0 }}>
			<Canvas>
				<ShaderGradient
					color1={color1}
					color2={color2}
					color3={color3}
					type={type}
					animate={animate}
					uTime={uTime}
					uSpeed={uSpeed}
					uStrength={uStrength}
					uDensity={uDensity}
					uFrequency={uFrequency}
					positionX={positionX}
					positionY={positionY}
					positionZ={positionZ}
					rotationX={rotationX}
					rotationY={rotationY}
					rotationZ={rotationZ}
					reflection={reflection}
					wireframe={wireframe}
					shader={shader}
				/>
			</Canvas>
		</div>
	);
};

export default ShaderGradientComponent;
