import DashboardSection from "../components/DashboardSection";
import NotificationList from "../components/NotificationList";

const NotificationsPage = () => {
	return (
		<div className="Notification-container">
			<div className="main-content">
				<DashboardSection
					sidebarContent={"Sidebar"}
					content={<NotificationList />}
					sidebarSize={25}
					contentSize={75}
					direction="horizontal"
				/>
			</div>
		</div>
	);
};

export default NotificationsPage;
