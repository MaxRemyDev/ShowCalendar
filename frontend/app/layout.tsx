import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "ShowCalendar",
	description:
		"Merge personal and professional schedules seamlessly in a unified tool. Simplify your daily life, maximize productivity across all fronts.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={cn(inter.className, "h-full")}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
