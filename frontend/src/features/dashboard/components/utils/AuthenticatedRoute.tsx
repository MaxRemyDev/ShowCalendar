import React, { useEffect, useState } from "react";
import { useUser } from "@/features/dashboard/components/utils/UserContext";
import Spinner from "@/components/decoration/spinner";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

let hasLoggedOut = false;

const AuthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, loading, refreshUser } = useUser();
	const router = useRouter();
	const [authChecked, setAuthChecked] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			if (hasLoggedOut) return;

			const token = getCookie("token");
			if (!token) {
				await handleTokenExpired(router);
				return;
			}
			const tokenExpired = isTokenExpired(token);
			if (tokenExpired) {
				await handleTokenExpired(router);
				return;
			}
			if (!user) {
				const refreshedUser = await refreshUser();
				if (!refreshedUser) {
					await handleTokenExpired(router);
					return;
				}
			}
			setAuthChecked(true);
		};

		if (!loading && !authChecked) {
			checkAuth();
		}

		const intervalId = setInterval(checkAuth, 60000); // 60 SECONDS

		return () => clearInterval(intervalId);
	}, [user, loading, router, refreshUser, authChecked]);

	if (loading || !authChecked) {
		return (
			<div className="min-h-screen h-full flex items-center justify-center">
				<Spinner />
			</div>
		);
	}

	return <>{children}</>;
};

const isTokenExpired = (token: string) => {
	const decodedToken = JSON.parse(atob(token.split(".")[1]));
	const expiry = decodedToken.exp;
	const now = Math.floor(Date.now() / 1000);
	return now > expiry;
};

const handleTokenExpired = async (router: ReturnType<typeof useRouter>) => {
	if (hasLoggedOut) return;

	hasLoggedOut = true;
	deleteCookie("token");
	deleteCookie("refreshToken");
	deleteCookie("userId");
	toast({
		title: "Session Expired",
		description: "Your session has expired. Please log in again.",
		variant: "destructive",
	});
	router.push("/login");
};

AuthenticatedRoute.displayName = "AuthenticatedRoute";

export default AuthenticatedRoute;
