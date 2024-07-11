"use client";

import React from "react";
import UserProviderWrapper from "@/features/dashboard/components/utils/UserContext";

const AuthLayout = ({ children }: { children?: React.ReactNode }) => {
	return (
		<div className="h-full relative overflow-hidden">
			<UserProviderWrapper>{children}</UserProviderWrapper>
		</div>
	);
};

export default AuthLayout;
