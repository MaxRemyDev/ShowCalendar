import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			<DashboardPage contents={children} />
		</div>
	);
};

export default Layout;
