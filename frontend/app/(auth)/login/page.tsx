import { LoginSection } from "@/features/auth/LoginSection";
import AuthGuard from "@/features/dashboard/components/utils/AuthGuard";

export default function Login() {
	return (
		<AuthGuard>
			<div className="flex flex-col gap-4">
				<LoginSection />
			</div>
		</AuthGuard>
	);
}
