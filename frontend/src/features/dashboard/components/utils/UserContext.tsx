"use client";

import React, {
	Suspense,
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from "react";
import { getUserById, updateUser as updateUserApi } from "@/api/auth/authService";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import Spinner from "@/components/decoration/spinner";

export interface UserDetails {
	fullName: string;
	avatar: string;
	dateOfBirth: string;
	language: string;
	font: string;
	bio: string;
	websites: string[];
	location: string;
	theme: string;
}

export interface UserStatus {
	isOnline: boolean;
	isEmailVerified: boolean;
	isPremium: boolean;
	isEnterprise: boolean;
	isBanned: boolean;
	isAdmin: boolean;
}

export interface User {
	userId: number;
	username: string;
	email: string;
	createdAt: string;
	updatedAt: string;
	lastLogin: string | null;
	lastLogout: string;
	details: UserDetails[];
	status: UserStatus[];
}

interface UserContextProps {
	user: User | null;
	loading: boolean;
	error: string | null;
	refreshUser: () => Promise<User | null>;
	updateUser: (data: Partial<User>) => Promise<User | null>;
	getUpdatedDetails: (
		data: Partial<UserDetails>,
		originalDetails: Partial<UserDetails>
	) => UserDetails;
	getUpdatedStatus: (
		data: Partial<UserStatus>,
		originalStatus: Partial<UserStatus>
	) => UserStatus;
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

	const updateUser = useCallback(
		async (data: Partial<User>): Promise<User | null> => {
			const userId = getCookie("userId");
			if (!userId) {
				setError("User ID not found in cookies");
				return null;
			}
			try {
				const updatedUser = await updateUserApi(Number(userId), {
					...data,
					status: user?.status ?? [],
				});
				setUser(updatedUser);
				return updatedUser;
			} catch (error: any) {
				setError(error.message || "Failed to update user data");
				return null;
			}
		},
		[user?.status]
	);

	const getUpdatedDetails = (
		data: Partial<UserDetails>,
		originalDetails: Partial<UserDetails>
	): UserDetails => {
		return {
			fullName: data.fullName ?? originalDetails.fullName ?? "",
			dateOfBirth: data.dateOfBirth ?? originalDetails.dateOfBirth ?? "",
			language: data.language ?? originalDetails.language ?? "en",
			avatar: data.avatar ?? originalDetails.avatar ?? "",
			font: data.font ?? originalDetails.font ?? "",
			bio: data.bio ?? originalDetails.bio ?? "",
			websites: data.websites ?? originalDetails.websites ?? [],
			location: data.location ?? originalDetails.location ?? "",
			theme: data.theme ?? originalDetails.theme ?? "",
		};
	};

	const getUpdatedStatus = (
		data: Partial<UserStatus>,
		originalStatus: Partial<UserStatus>
	): UserStatus => {
		return {
			isOnline: data.isOnline ?? originalStatus.isOnline ?? false,
			isEmailVerified: data.isEmailVerified ?? originalStatus.isEmailVerified ?? false,
			isPremium: data.isPremium ?? originalStatus.isPremium ?? false,
			isEnterprise: data.isEnterprise ?? originalStatus.isEnterprise ?? false,
			isBanned: data.isBanned ?? originalStatus.isBanned ?? false,
			isAdmin: data.isAdmin ?? originalStatus.isAdmin ?? false,
		};
	};

	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);

	return (
		<UserContext.Provider
			value={{
				user,
				loading,
				error,
				refreshUser: fetchUserData,
				updateUser,
				getUpdatedDetails,
				getUpdatedStatus,
			}}
		>
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
