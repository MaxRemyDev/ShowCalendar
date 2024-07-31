"use client";

import React, { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import languagesData from "@/components/data/languages";

interface SelectScrollingLanguagesProps {
	name: string;
	defaultValue: string;
	iconDisable?: boolean;
	onValueChange?: (value: string) => void;
	disabled?: boolean;
}

export function SelectScrollingLanguages({
	name,
	defaultValue,
	iconDisable = false,
	onValueChange,
	disabled,
}: SelectScrollingLanguagesProps) {
	const [selectedLanguage, setSelectedLanguage] = useState(defaultValue);

	useEffect(() => {
		setSelectedLanguage(defaultValue);
	}, [defaultValue]);

	const handleChange = (value: string) => {
		setSelectedLanguage(value);
		if (onValueChange) {
			onValueChange(value);
		}
	};

	return (
		<Select value={selectedLanguage} onValueChange={handleChange} disabled={disabled}>
			<SelectTrigger className="w-[150px] flex justify-between items-center">
				{!iconDisable && <Globe className="mr-2" />}
				<SelectValue placeholder="Select language" />
			</SelectTrigger>
			<SelectContent>
				{languagesData.map((language) => (
					<SelectItem key={language.code} value={language.code}>
						{language.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
