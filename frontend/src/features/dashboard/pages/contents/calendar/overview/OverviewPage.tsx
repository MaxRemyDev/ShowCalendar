import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
	title: "Calendar",
	description: "Calendar overview",
};

export default function OverviewPage() {
	return (
		<div className="flex-col md:flex">
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">Calendar Contents</h2>
			</div>
			<div className="py-5">
				<Separator />
			</div>
		</div>
	);
}
