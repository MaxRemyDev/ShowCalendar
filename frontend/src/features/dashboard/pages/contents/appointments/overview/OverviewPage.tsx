"use client";

import { Metadata } from "next";
import OverviewSection from "@/features/dashboard/components/overview/OverviewSection";
import { listWidgets } from "@/features/dashboard/components/overview/widget/utils/list-widgets";
import { WidgetManagerProvider } from "@/features/dashboard/components/overview/widget/WidgetManagerContext";

export const metadata: Metadata = {
	title: "Appointments",
	description: "Appointments overview.",
};

const calendarWidgets =
	listWidgets.find((category) => category.category === "Appointments-Overview")?.widgets || [];

export default function OverviewPage() {
	return (
		<WidgetManagerProvider>
			<OverviewSection
				title="Appointments"
				description="Here you can see the overview of your appointments."
				layoutsTabs={calendarWidgets}
				addons={""}
				enableEditButtons={true}
				category="Appointments"
			/>
		</WidgetManagerProvider>
	);
}
