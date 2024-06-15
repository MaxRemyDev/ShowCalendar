import { Metadata } from "next";
import ContentsTitle from "@/features/dashboard/components/ContentsTitle";

export const metadata: Metadata = {
	title: "Calendar",
	description: "Calendar Weekly View",
};

export default function WeeklyViewPage() {
	return (
		<div className="flex-col md:flex">
			<ContentsTitle
				title="Weekly View Calendar Content"
				description="This is a Calendar weekly view page description."
				addons={<div>Calendar Addons</div>}
			/>
		</div>
	);
}
