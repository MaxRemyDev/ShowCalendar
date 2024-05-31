"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ALargeSmall } from "lucide-react";

export default function Widget3() {
	const [tasks, setTasks] = useState([
		{ id: 1, category: "lorem" },
		{ id: 2, category: "ipsum" },
		{ id: 3, category: "lorem" },
		{ id: 4, category: "lorem" },
	]);

	const loremTasksCount = tasks.filter((task) => task.category === "lorem").length;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">lorem ipsum</CardTitle>
				<ALargeSmall className="text-background-500" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">+{loremTasksCount}</div>
				<p className="text-xs text-muted-foreground">+19% from last month</p>
			</CardContent>
		</Card>
	);
}
