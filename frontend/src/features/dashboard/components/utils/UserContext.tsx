"use client";

import { getUserById } from "@/api/auth/authService";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { Suspense } from "react";
import Spinner from "@/components/decoration/spinner";

interface User {
	userId: number;
	username: string;
	email: string;

	fullName: string;
	avatar: string;
	bio: string;
	website: string;
	location: string;

	isOnline: boolean;
	isEmailVerified: boolean;
	isPremium: boolean;
	isEnterprise: boolean;
	isBanned: boolean;
	isAdmin: boolean;

	createdAt: string;
	updatedAt: string;

	lastLogin: string;
	lastLogout: string;
}

interface UserContextProps {
	user: User | null;
	loading: boolean;
	error: string | null;
	refreshUser: () => Promise<User | null>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const fetchUserData = useCallback(async (): Promise<User | null> => {
		setLoading(true);
		setError(null);
		try {
			const userId = getCookie("userId");
			const token = getCookie("token");
			console.log("userId from cookie:", userId);
			console.log("token from cookie:", token);

			if (userId) {
				const userData = await getUserById(Number(userId));
				console.log("Fetched user data:", userData);
				setUser(userData);
				return userData;
			} else {
				setError("User ID not found in cookies");
				return null;
			}
		} catch (error: any) {
			setError(error.message || "Failed to fetch user data");
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);

	return (
		<UserContext.Provider value={{ user, loading, error, refreshUser: fetchUserData }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};

// WRAPPER COMPONENT TO USE SUSPENSE FOR DATA FETCHING
const UserProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<Suspense
		fallback={
			<div className="min-h-screen h-full flex items-center justify-center">
				<Spinner />
			</div>
		}
	>
		<UserProvider>{children}</UserProvider>
	</Suspense>
);

export default UserProviderWrapper;
