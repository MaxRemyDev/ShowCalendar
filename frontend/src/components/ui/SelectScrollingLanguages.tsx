"use client";

import React, { useState } from "react";
import { Globe } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import languagesData from "@/components/data/languages";

export function SelectScrollingLanguages({ iconDisable = false }) {
	const [selectedLanguage, setSelectedLanguage] = useState("en");

	return (
		<Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
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
