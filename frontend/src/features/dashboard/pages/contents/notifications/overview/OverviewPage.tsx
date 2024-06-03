import { Metadata } from "next";
import ContentsTitle from "@/features/dashboard/components/ContentsTitle";

export const metadata: Metadata = {
	title: "Notifications",
	description: "Notifications overview.",
};

export default function OverviewPage() {
	return (
		<div className="flex-col md:flex">
			<ContentsTitle
				title="Notifications Content"
				description="This is a Notifications overview page description."
				addons={<div>Notifications Addons</div>}
			/>
		</div>
	);
}
