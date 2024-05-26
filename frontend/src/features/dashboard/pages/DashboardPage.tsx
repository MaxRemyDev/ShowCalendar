import React from "react";
import DashboardSection from "../components/DashboardSection";
import AppointmentList from "../components/AppointmentList";
import CalendarView from "../components/CalendarView";
import NotificationList from "../components/NotificationList";

const DashboardPage = () => {
	return (
		<div className="dashboard-container">
			<DashboardSection
				sidebarContent={"Sidebar"}
				content={
					<div>
						<CalendarView />
						<AppointmentList />
						<NotificationList />
					</div>
				}
				sidebarSize={25}
				contentSize={75}
				direction="horizontal"
			/>
		</div>
	);
};

export default DashboardPage;
