"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/api/auth/authService";
import Spinner from "@/components/decoration/spinner";
import { useToast } from "@/components/ui/use-toast";

const LogoutPage = () => {
	const router = useRouter();
	const { toast } = useToast();
	const isLoggingOut = useRef(false);

	useEffect(() => {
		const performLogout = async () => {
			if (!isLoggingOut.current) {
				isLoggingOut.current = true;
				await logoutUser();

				toast({
					title: "Logout successful",
					description: "You have been logged out successfully.",
					variant: "success",
				});

				router.push("/");
			}
		};

		performLogout();
	}, [router, toast]);

	return (
		<div className="min-h-screen h-full flex items-center justify-center">
			<Spinner />
		</div>
	);
};

export default LogoutPage;
