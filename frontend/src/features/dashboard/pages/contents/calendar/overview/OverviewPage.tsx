"use client";

import { Metadata } from "next";
import OverviewSection from "@/features/dashboard/components/overview/OverviewSection";
import { listWidgets } from "@/features/dashboard/components/overview/widget/utils/list-widgets";
import { WidgetManagerProvider } from "@/features/dashboard/components/overview/widget/WidgetManagerContext";

export const metadata: Metadata = {
	title: "Calendar",
	description: "Calendar overview.",
};

const calendarWidgets =
	listWidgets.find((category) => category.category === "Calendar-Overview")?.widgets || [];

export default function OverviewPage() {
	return (
		<WidgetManagerProvider>
			<OverviewSection
				title="Calendar"
				description="Here you can see the overview of your Calendar."
				layoutsTabs={calendarWidgets}
				addons={""}
				enableEditButtons={true}
				category="Calendar"
			/>
		</WidgetManagerProvider>
	);
}
