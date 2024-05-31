import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "../overview";

export default function Widget5() {
	return (
		<Card className="col-span-4">
			<CardHeader>
				<CardTitle>Overview Appointments</CardTitle>
				<CardDescription>January - July 2024</CardDescription>
			</CardHeader>
			<CardContent className="pl-2">
				<Overview />
			</CardContent>
		</Card>
	);
}
