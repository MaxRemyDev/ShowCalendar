"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/dashboard/components/utils/UserContext";
import Spinner from "@/components/decoration/spinner";
import { getCookie, deleteCookie } from "cookies-next";

let hasLoggedOut = false;

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, loading, refreshUser } = useUser();
	const router = useRouter();
	const [authChecked, setAuthChecked] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			if (hasLoggedOut) return;

			const token = getCookie("token");
			if (token) {
				const tokenExpired = isTokenExpired(token);
				if (tokenExpired) {
					await handleTokenExpired(router);
					return;
				}
				const refreshedUser = await refreshUser();
				if (refreshedUser) {
					router.replace("/dashboard");
				}
			}
			setAuthChecked(true);
		};

		if (!loading && !authChecked) {
			checkAuth();
		}

		const intervalId = setInterval(checkAuth, 60000);

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
	router.push("/login");
};

AuthGuard.displayName = "AuthGuard";

export default AuthGuard;
