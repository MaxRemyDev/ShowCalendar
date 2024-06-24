import React from "react";
import { Timer, CreditCard, Users, Calendar, Percent, ALargeSmall } from "lucide-react";
import { Overview } from "@/features/dashboard/pages/contents/dashboard/overview/components/overview";
import { RecentAppointments } from "@/features/dashboard/pages/contents/dashboard/overview/components/recent-appointments";
import { WidgetCategory, CustomLayout } from "../../OverviewTypes";

export const listWidgets: WidgetCategory[] = [
	{
		category: "Dashboard-Overview",
		widgets: [
			{
				key: "widget-1",
				title: "Total Appointments Pending",
				icon: <Timer className="text-background-500" />,
				customContent: (
					<>
						<div className="text-2xl font-bold">3</div>
						<p className="text-xs text-muted-foreground">+2% from last month</p>
					</>
				),
				dataGrid: { x: 0, y: 0, w: 3, h: 2.5 },
			},
			{
				key: "widget-2",
				title: "New View On Your Calendar Card",
				icon: <CreditCard className="text-background-500" />,
				customContent: (
					<>
						<div className="text-2xl font-bold">5</div>
						<p className="text-xs text-muted-foreground">+12% from last month</p>
					</>
				),
				dataGrid: { x: 3, y: 0, w: 3, h: 2.5 },
			},
			{
				key: "widget-3",
				title: "Quarter of Year",
				icon: <Percent className="text-background-500" />,
				customContent: (
					<>
						<div className="text-2xl font-bold">Q3</div>
						<p className="text-xs text-muted-foreground">January - July 2024</p>
					</>
				),
				dataGrid: { x: 6, y: 0, w: 3, h: 2.5 },
			},
			{
				key: "widget-4",
				title: "New Contacts",
				icon: <Users className="text-background-500" />,
				customContent: (
					<>
						<div className="text-2xl font-bold">50</div>
						<p className="text-xs text-muted-foreground">+201 since last month</p>
					</>
				),
				dataGrid: { x: 9, y: 0, w: 3, h: 2.5 },
			},
			{
				key: "widget-5",
				title: "Overview Appointments",
				description: "January - July 2024",
				customContent: <Overview />,
				dataGrid: { x: 0, y: 2, w: 7, h: 7.1 },
			},
			{
				key: "widget-6",
				title: "Recent Appointments",
				description: "You have 45 appointments pending this month.",
				customContent: <RecentAppointments />,
				dataGrid: { x: 7, y: 2, w: 5, h: 7.1 },
			},
		],
	},
	{
		category: "Calendar-Overview",
		widgets: [
			{
				key: "widget-7",
				title: "Upcoming Events",
				icon: <Calendar className="text-background-500" />,
				customContent: (
					<>
						<div className="text-2xl font-bold">3 Events</div>
						<p className="text-xs text-muted-foreground">Next: Conference at 3 PM</p>
					</>
				),
				dataGrid: { x: 0, y: 6, w: 6, h: 2 },
			},
		],
	},
	{
		category: "Appointments-Overview",
		widgets: [
			{
				key: "widget-8",
				title: "Title Widget Appointments Overview",
				description: "Description Widget Appointments Overview",
				icon: <ALargeSmall className="text-background-500" />,
				dataGrid: { x: 0, y: 6, w: 6, h: 2 },
			},
		],
	},
	{
		category: "Notifications-Overview",
		widgets: [
			{
				key: "widget-9",
				title: "Title Widget Notifications Overview",
				description: "Description Widget Notifications Overview",
				icon: <ALargeSmall className="text-background-500" />,
				dataGrid: { x: 0, y: 6, w: 6, h: 2 },
			},
		],
	},
];

export const defaultLayout: CustomLayout[] = listWidgets.flatMap((category) =>
	category.widgets.map((widget) => ({
		i: widget.key,
		x: widget.dataGrid?.x ?? 0,
		y: widget.dataGrid?.y ?? 0,
		w: widget.dataGrid?.w ?? 1,
		h: widget.dataGrid?.h ?? 1,
		minW: widget.dataGrid?.minW,
		minH: widget.dataGrid?.minH,
		maxW: widget.dataGrid?.maxW,
		maxH: widget.dataGrid?.maxH,
	}))
);
