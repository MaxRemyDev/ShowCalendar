"use client";

import * as React from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export const tailwindColors = [
	{ name: "blue", hex: "#3b82f6" },
	{ name: "red", hex: "#ef4444" },
	{ name: "yellow", hex: "#f59e0b" },
	{ name: "green", hex: "#10b981" },
	{ name: "purple", hex: "#8b5cf6" },
	{ name: "pink", hex: "#ec4899" },
	{ name: "indigo", hex: "#6366f1" },
	{ name: "gray", hex: "#6b7280" },
	{ name: "brown", hex: "#a78b64" },
	{ name: "cyan", hex: "#06b6d4" },
	{ name: "teal", hex: "#14b8a6" },
	{ name: "orange", hex: "#f97316" },
	{ name: "amber", hex: "#ffb300" },
	{ name: "lime", hex: "#84cc16" },
	{ name: "emerald", hex: "#34d399" },
	{ name: "sky", hex: "#0ea5e9" },
	{ name: "violet", hex: "#9333ea" },
	{ name: "fuchsia", hex: "#d946ef" },
	{ name: "rose", hex: "#f43f5e" },
];

export function SelectColorCombobox({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Select a theme" />
			</SelectTrigger>

			<SelectContent className="h-[200px]">
				<SelectGroup>
					{tailwindColors.map((color) => (
						<SelectItem key={color.name} value={color.name}>
							<div className="flex items-center">
								<span
									className="w-4 h-4 rounded-full mr-2"
									style={{ backgroundColor: color.hex }}
								></span>
								{color.name.charAt(0).toUpperCase() + color.name.slice(1)}
							</div>
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
