"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "lucide-react";

export default function Widget1() {
	const [appointments, setAppointments] = useState([
		{ id: 1, status: "pending" },
		{ id: 2, status: "completed" },
		{ id: 3, status: "pending" },
		{ id: 4, status: "pending" },
	]);

	const pendingAppointments = appointments.filter(
		(appointment) => appointment.status === "pending"
	).length;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Total Appointments Pending</CardTitle>
				<Timer className="text-background-500" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{pendingAppointments}</div>
				<p className="text-xs text-muted-foreground">+2% from last month</p>
			</CardContent>
		</Card>
	);
}
