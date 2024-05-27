import DashboardHeader from "@/features/dashboard/components/DashboardHeader";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-full relative overflow-hidden">
			<main>
				<DashboardHeader />
				{children}
			</main>
		</div>
	);
};

export default DashboardLayout;
