import DashboardHeader from "@/features/dashboard/components/DashboardHeader";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-full relative">
			<main>
				<DashboardHeader />
				<div className="h-16 max-sm:h-12" />
				{children}
			</main>
		</div>
	);
};

export default DashboardLayout;
