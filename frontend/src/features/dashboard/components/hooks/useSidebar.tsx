import { create } from "zustand";

interface SidebarStore {
	isOpen: boolean;
	toggle: () => void;
	setIsOpen: (isOpen: boolean) => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
	isOpen:
		typeof window !== "undefined"
			? JSON.parse(localStorage.getItem("fixed-layout:collapsed") || "true")
			: true,
	toggle: () =>
		set((state) => {
			const newIsOpen = !state.isOpen;
			localStorage.setItem("fixed-layout:collapsed", JSON.stringify(newIsOpen));
			return { isOpen: newIsOpen };
		}),
	setIsOpen: (isOpen: boolean) => {
		localStorage.setItem("fixed-layout:collapsed", JSON.stringify(isOpen));
		set({ isOpen });
	},
}));
