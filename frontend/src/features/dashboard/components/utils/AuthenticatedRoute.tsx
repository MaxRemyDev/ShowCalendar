import React, { useEffect, useState } from "react";
import { useUser } from "@/features/dashboard/components/utils/UserContext";
import { useRouter } from "next/navigation";
import Spinner from "@/components/decoration/spinner";
import { getCookie } from "cookies-next";

const AuthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, loading, refreshUser } = useUser();
	const router = useRouter();
	const [authChecked, setAuthChecked] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			const token = getCookie("token");
			console.log("AuthenticatedRoute: Token from cookie:", token);
			if (!token) {
				router.push("/login");
				return;
			}
			if (!user) {
				const refreshedUser = await refreshUser();
				if (!refreshedUser) {
					router.push("/login");
					return;
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

export default AuthenticatedRoute;
