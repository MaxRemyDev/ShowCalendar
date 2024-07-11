import { create } from "zustand";

interface AuthState {
	isLoading: boolean;
	isLogin: boolean;
	setIsLoading: (isLoading: boolean) => void;
	setIsLogin: (isLogin: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	isLoading: false,
	isLogin: true,
	setIsLoading: (isLoading) => set({ isLoading }),
	setIsLogin: (isLogin) => set({ isLogin }),
}));
