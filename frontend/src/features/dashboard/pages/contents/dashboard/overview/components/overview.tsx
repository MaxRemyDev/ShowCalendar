"use client";

import React, { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { monthlyData } from "./data/monthlyData";
import { Button } from "@/components/ui/button";

interface CustomTooltipProps {
	active?: boolean;
	payload?: { value: number; payload: { fullName: string } }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-white text-black p-2 border border-gray-300 rounded-lg shadow-lg">
				<p className="font-semibold">{`${payload[0].payload.fullName}`}</p>
				<p>{`Number of appointments: ${payload[0].value}`}</p>
			</div>
		);
	}

	return null;
};

export function Overview() {
	const [data, setData] = useState<any>(monthlyData);
	const [zoomLevel, setZoomLevel] = useState(0);
	const [previousData, setPreviousData] = useState<any[]>([]);

	const handleBarClick = (data: any) => {
		if (zoomLevel === 0) {
			setPreviousData([data]);
			setData(data.weeklyData);
			setZoomLevel(1);
		} else if (zoomLevel === 1) {
			setPreviousData((prev) => [...prev, data]);
			setData(data.dailyData);
			setZoomLevel(2);
		}
	};

	const resetZoom = () => {
		setData(monthlyData);
		setZoomLevel(0);
		setPreviousData([]);
	};

	const zoomOut = () => {
		if (zoomLevel === 2) {
			const [monthData] = previousData;
			setData(monthData.weeklyData);
			setZoomLevel(1);
			setPreviousData([monthData]);
		} else if (zoomLevel === 1) {
			setData(monthlyData);
			setZoomLevel(0);
			setPreviousData([]);
		}
	};

	return (
		<div>
			{zoomLevel > 0 && (
				<div className="text-end mb-4 space-x-5">
					<Button variant="outline" onClick={zoomOut}>
						Zoom Out
					</Button>
					<Button variant="outline" onClick={resetZoom}>
						Reset Zoom
					</Button>
				</div>
			)}
			<ResponsiveContainer width="100%" height={350}>
				<BarChart data={data}>
					<XAxis
						dataKey="name"
						stroke="#888888"
						fontSize={12}
						tickLine={false}
						axisLine={false}
					/>
					<YAxis
						stroke="#888888"
						fontSize={12}
						tickLine={false}
						axisLine={false}
						tickFormatter={(value) => `${value}`}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Bar
						dataKey="appointments"
						fill="currentColor"
						radius={[8, 8, 0, 0]}
						className="fill-primary"
						onClick={(e) => handleBarClick(e)}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
