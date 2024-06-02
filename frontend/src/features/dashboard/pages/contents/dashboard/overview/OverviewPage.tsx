import { Metadata } from "next";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import Widget1 from "./components/widgets/widget-1";
import Widget2 from "./components/widgets/widget-2";
import Widget3 from "./components/widgets/widget-3";
import Widget4 from "./components/widgets/widget-4";
import Widget5 from "./components/widgets/widget-5";
import Widget6 from "./components/widgets/widget-6";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Dashboard overview.",
};

export default function OverviewPage() {
	return (
		<div className="flex-col md:flex">
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
				<div className="flex items-center space-x-2">
					<DateRangePicker />
				</div>
			</div>
			<div className="py-5">
				<Separator />
			</div>

			<Tabs defaultValue="overview" className="space-y-4">
				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Widget1 />
						<Widget2 />
						<Widget3 />
						<Widget4 />
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
						<Widget5 />
						<Widget6 />
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
