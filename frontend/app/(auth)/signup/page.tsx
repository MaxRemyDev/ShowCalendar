import { SignUpSection } from "@/features/auth/SignUpSection";
import AuthGuard from "@/features/dashboard/components/utils/AuthGuard";

export default function SignUp() {
	return (
		<AuthGuard>
			<div className="flex flex-col gap-4">
				<SignUpSection />
			</div>
		</AuthGuard>
	);
}
