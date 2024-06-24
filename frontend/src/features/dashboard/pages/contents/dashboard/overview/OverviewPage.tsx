"use client";

import { Metadata } from "next";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { WidgetManagerProvider } from "@/features/dashboard/components/overview/widget/WidgetManagerContext";
import OverviewSection from "@/features/dashboard/components/overview/OverviewSection";
import { listWidgets } from "@/features/dashboard/components/overview/widget/utils/list-widgets";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Dashboard overview.",
};

const dashboardWidgets =
	listWidgets.find((category) => category.category === "Dashboard-Overview")?.widgets || [];

export default function OverviewPage() {
	return (
		<WidgetManagerProvider>
			<OverviewSection
				title="Dashboard"
				description="Here you can see the overview of your dashboard."
				layoutsTabs={dashboardWidgets}
				addons={<DateRangePicker />}
				enableEditButtons={true}
				category="Dashboard"
			/>
		</WidgetManagerProvider>
	);
}
