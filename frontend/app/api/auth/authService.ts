import { setCookie, deleteCookie, getCookie } from "cookies-next";
import BackendApiClient from "../backendApiClient";

export interface AuthResponse {
	token: string;
	refreshToken: string;
	user: {
		userId: number;
		username: string;
		email: string;
	};
}

export interface LoginData {
	username: string;
	password: string;
	remember: boolean;
}

export interface RegisterData {
	username: string;
	email: string;
	password: string;
	remember: boolean;
}

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
	try {
		const response = await BackendApiClient.post<AuthResponse>("/api/auth/login", data);
		const { token, refreshToken, user } = response.data;
		setCookie("token", token);
		setCookie("refreshToken", refreshToken);
		if (user?.userId) {
			setCookie("userId", user.userId.toString());
			console.log("loginUser: userId set in cookie:", user.userId.toString());
		} else {
			console.error("loginUser: userId is undefined or null");
		}
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
	try {
		const response = await BackendApiClient.post<AuthResponse>("/api/auth/register", data);
		const { token, refreshToken, user } = response.data;
		setCookie("token", token);
		setCookie("refreshToken", refreshToken);
		if (user?.userId) {
			setCookie("userId", user.userId.toString());
			console.log("registerUser: userId set in cookie:", user.userId.toString());
		} else {
			console.error("registerUser: userId is undefined or null");
		}
		return response.data;
	} catch (error) {
		throw error;
	}
};

const userCache = new Map<number, any>();

export const getUserById = async (userId: number) => {
	if (userCache.has(userId)) {
		return userCache.get(userId);
	}
	try {
		const response = await BackendApiClient.get(`/api/users/${userId}`);
		userCache.set(userId, response.data);
		return response.data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
};

export const updateUser = async (userId: number, data: any) => {
	try {
		const response = await BackendApiClient.put(`/api/users/${userId}`, data);

		if (cachedUser && cachedUser.userId === userId) {
			cachedUser = response.data;
		}
		userCache.set(userId, response.data);
		return response.data;
	} catch (error) {
		console.error("Error updating user data:", error);
		throw error;
	}
};

let cachedUser: any = null;

export const refreshUser = async () => {
	const userId = getCookie("userId");
	console.log("refreshUser: userId from cookie:", userId);
	if (!userId) return null;

	if (cachedUser && cachedUser.userId === Number(userId)) {
		return cachedUser;
	}

	const user = await getUserById(Number(userId));
	cachedUser = user;
	return user;
};

export const refreshAuthToken = async () => {
	const refreshToken = getCookie("refreshToken");
	if (!refreshToken) throw new Error("No refresh token available");
	const response = await BackendApiClient.post("/api/auth/refresh-token", {
		token: refreshToken,
	});
	const { token, refreshToken: newRefreshToken } = response.data;
	setCookie("token", token);
	setCookie("refreshToken", newRefreshToken);
};

export const logoutUser = async (): Promise<void> => {
	const userId = getCookie("userId");
	if (userId) {
		try {
			await BackendApiClient.post("/api/auth/logout", { userId });
		} catch (error) {
			console.error("Failed to logout user from backend:", error);
		}
	}
	deleteCookie("token");
	deleteCookie("refreshToken");
	deleteCookie("userId");
};
