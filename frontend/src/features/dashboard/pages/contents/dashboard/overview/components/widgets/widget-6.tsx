import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentAppointments } from "../recent-appointments";

export default function Widget6() {
	return (
		<Card className="col-span-4 lg:col-span-3">
			<CardHeader>
				<CardTitle>Recent Appointments</CardTitle>
				<CardDescription>You have 45 appointments pending this month.</CardDescription>
			</CardHeader>
			<CardContent>
				<RecentAppointments />
			</CardContent>
		</Card>
	);
}
