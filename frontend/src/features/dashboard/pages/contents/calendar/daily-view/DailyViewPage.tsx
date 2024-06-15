import { Metadata } from "next";
import ContentsTitle from "@/features/dashboard/components/ContentsTitle";

export const metadata: Metadata = {
	title: "Calendar",
	description: "Calendar Daily View",
};

export default function DailyViewPage() {
	return (
		<div className="flex-col md:flex">
			<ContentsTitle
				title="Daily View Calendar Content"
				description="This is a Calendar DailyView page description."
				addons={<div>Calendar Addons</div>}
			/>
		</div>
	);
}
