import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const BackendApiClient = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},

	timeout: 10000, // 10 SECONDS TIMEOUT
});

BackendApiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		//* ADD DYNAMIC HEADER IF NEEDED
		return config;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

BackendApiClient.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},

	async (error: AxiosError) => {
		let errorMessage = "An error occurred";
		let statusCode = error.response?.status ?? 500;

		if (error.response) {
			console.error("Backend API response error:", {
				status: error.response.status,
				data: error.response.data,
			});

			errorMessage = error.response.data as string;
			statusCode = error.response.status;
		} else if (error.request) {
			console.error("No response received from Backend:", error.request);
			errorMessage = "No response received from server Backend API";
			statusCode = 503; // SERVICE UNAVAILABLE
		} else {
			console.log("Query error from Backend:", error.message);
			errorMessage = error.message;
		}

		// RETURN ERROR MESSAGE AND STATUS CODE
		const config = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
			_retryCount?: number;
		};

		// RETRY IF ERROR IS RETRIABLE
		if (!config._retry) {
			config._retry = true;
			config._retryCount = (config._retryCount ?? 0) + 1;

			// LIMIT TO 3 RETRY ATTEMPTS
			if (config._retryCount <= 3) {
				return BackendApiClient(config);
			}
		}

		return Promise.reject({ message: errorMessage, status: statusCode });
	}
);

export default BackendApiClient;
