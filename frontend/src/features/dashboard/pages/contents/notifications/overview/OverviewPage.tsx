"use client";

import { Metadata } from "next";
import OverviewSection from "@/features/dashboard/components/overview/OverviewSection";
import { listWidgets } from "@/features/dashboard/components/overview/widget/utils/list-widgets";
import { WidgetManagerProvider } from "@/features/dashboard/components/overview/widget/WidgetManagerContext";

export const metadata: Metadata = {
	title: "Notifications",
	description: "Notifications overview.",
};

const calendarWidgets =
	listWidgets.find((category) => category.category === "Notifications-Overview")?.widgets || [];

export default function OverviewPage() {
	return (
		<WidgetManagerProvider>
			<OverviewSection
				title="Notifications"
				description="Here you can see the overview of your notifications."
				layoutsTabs={calendarWidgets}
				addons={""}
				enableEditButtons={true}
				category="Notifications"
			/>
		</WidgetManagerProvider>
	);
}
