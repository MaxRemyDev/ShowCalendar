import CalendarView from "../components/CalendarView";
import DashboardSection from "../components/DashboardSection";

const CalendarPage = () => {
	return (
		<div className="Calendar-container">
			<div className="main-content">
				<DashboardSection
					sidebarContent={"Sidebar"}
					content={<CalendarView />}
					sidebarSize={25}
					contentSize={75}
					direction="horizontal"
				/>
			</div>
		</div>
	);
};

export default CalendarPage;
