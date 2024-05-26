import AppointmentList from "../components/AppointmentList";
import DashboardSection from "../components/DashboardSection";

const AppointmentsPage = () => {
	return (
		<div className="Appointment-container">
			<div className="main-content">
				<DashboardSection
					sidebarContent={"Sidebar"}
					content={<AppointmentList />}
					sidebarSize={25}
					contentSize={75}
					direction="horizontal"
				/>
			</div>
		</div>
	);
};

export default AppointmentsPage;
