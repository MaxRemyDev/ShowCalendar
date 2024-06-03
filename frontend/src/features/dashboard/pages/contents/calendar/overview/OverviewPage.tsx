import { Metadata } from "next";
import ContentsTitle from "@/features/dashboard/components/ContentsTitle";

export const metadata: Metadata = {
	title: "Calendar",
	description: "Calendar overview",
};

export default function OverviewPage() {
	return (
		<div className="flex-col md:flex">
			<ContentsTitle
				title="Calendar Content"
				description="This is a Calendar overview page description."
				addons={<div>Calendar Addons</div>}
			/>
		</div>
	);
}
