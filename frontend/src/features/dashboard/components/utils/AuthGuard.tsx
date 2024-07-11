"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/dashboard/components/utils/UserContext";
import Spinner from "@/components/decoration/spinner";
import { getCookie } from "cookies-next";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, loading, refreshUser } = useUser();
	const router = useRouter();
	const [authChecked, setAuthChecked] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			const token = getCookie("token");
			if (token) {
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

export default AuthGuard;
