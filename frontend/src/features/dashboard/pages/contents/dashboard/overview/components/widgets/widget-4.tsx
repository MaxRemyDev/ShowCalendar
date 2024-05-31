"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function Widget4() {
	const [views, setViews] = useState([
		{ id: 1, type: "calendar" },
		{ id: 2, type: "calendar" },
		{ id: 3, type: "other" },
		{ id: 4, type: "calendar" },
		{ id: 5, type: "calendar" },
		{ id: 6, type: "calendar" },
	]);

	const calendarViewsCount = views.filter((view) => view.type === "calendar").length;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">
					New View On Your Calendar Card
				</CardTitle>
				<CreditCard className="text-background-500" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">+{calendarViewsCount}</div>
				<p className="text-xs text-muted-foreground">+201 since last month</p>
			</CardContent>
		</Card>
	);
}
