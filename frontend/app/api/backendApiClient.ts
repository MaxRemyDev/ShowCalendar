import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getCookie } from "cookies-next";
import { handleError } from "./lib/error-handler";
import { useRouter } from "next/navigation";

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
		const token = getCookie("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
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
		const config = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
			_retryCount?: number;
		};
		const router = useRouter();

		return handleError(error, config, router);
	}
);

export default BackendApiClient;
