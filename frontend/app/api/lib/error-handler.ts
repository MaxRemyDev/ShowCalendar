import { AxiosError } from "axios";
import { AUTH_ERRORS } from "@/components/form/auth/auth-errors";
import { refreshAuthToken, logoutUser } from "@/api/auth/authService";
import BackendApiClient from "@/api/backendApiClient";
import { dismiss, toast } from "@/components/ui/use-toast";
import { getCookie, deleteCookie } from "cookies-next";

let noResponseToastId: string | null = null;

export async function handleError(error: AxiosError, config: any, router: any) {
	let errorMessage = AUTH_ERRORS.GENERIC_ERROR;
	let statusCode = error.response?.status ?? 500;

	if (error.response) {
		console.error("Backend API response error:", {
			status: error.response.status,
			data: error.response.data,
		});

		errorMessage = error.response.data as string;
		statusCode = error.response.status;

		if (noResponseToastId) {
			dismiss(noResponseToastId);
			noResponseToastId = null;
		}
	} else if (error.request) {
		console.error("No response received from Backend:", error.request);
		errorMessage = "No response received from server Backend API";
		statusCode = 503;

		if (!noResponseToastId) {
			const { id } = toast({
				title: "Server Error",
				description: errorMessage,
				variant: "destructive",
				duration: Infinity,
				showProgress: false,
			});
			noResponseToastId = id;
		}

		return Promise.reject({ message: errorMessage, status: statusCode });
	} else {
		console.log("Query error from Backend:", error.message);
		errorMessage = error.message;
	}

	config._retry = config._retry || false;
	config._retryCount = config._retryCount || 0;

	const isAuthError =
		errorMessage.includes(AUTH_ERRORS.INCORRECT_PASSWORD) ||
		errorMessage.includes(AUTH_ERRORS.USERNAME_DOES_NOT_EXIST) ||
		errorMessage.includes(AUTH_ERRORS.NO_REFRESH_TOKEN) ||
		errorMessage.includes("Token expired");

	if (!config._retry && statusCode === 401 && !isAuthError) {
		config._retry = true;
		config._retryCount += 1;

		if (config._retryCount <= 3) {
			try {
				await refreshAuthToken();
				const token = getCookie("token");
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return BackendApiClient(config);
			} catch (refreshError) {
				await handleTokenExpired(router);
				return Promise.reject(refreshError);
			}
		}
	}

	if (statusCode === 401 && errorMessage.includes("Token expired")) {
		await handleTokenExpired(router);
	}

	if (statusCode === 500 || statusCode === 503) {
		toast({
			title: "Error",
			description: errorMessage,
			variant: "destructive",
		});
	}

	return Promise.reject({ message: errorMessage, status: statusCode });
}

async function handleTokenExpired(router: any) {
	await logoutUser();
	deleteCookie("token");
	deleteCookie("refreshToken");
	deleteCookie("userId");
	router.push("/login");
}
