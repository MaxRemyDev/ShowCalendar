import { Metadata } from "next";
import ContentsTitle from "@/features/dashboard/components/ContentsTitle";

export const metadata: Metadata = {
	title: "Appointments",
	description: "Appointments Overview.",
};

export default function OverviewPage() {
	return (
		<div className="flex-col md:flex">
			<ContentsTitle
				title="Appointments Content"
				description="This is a Appointments overview page description."
			/>
		</div>
	);
}
