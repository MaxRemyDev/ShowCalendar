"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DropDownMenuModeToggle() {
	const { setTheme, theme } = useTheme();
	const [selectedTheme, setSelectedTheme] = useState<string>(
		theme === "system" ? "system" : "light"
	);

	useEffect(() => {
		setSelectedTheme(theme === "system" ? "system" : theme || "light");
	}, [theme]);

	const handleSetTheme = (newTheme: string) => {
		setTheme(newTheme);
		setSelectedTheme(newTheme);
	};

	const variants = {
		enter: { scale: 1, opacity: 1, rotate: 0 },
		exit: { scale: 0, opacity: 0, rotate: 90 },
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm">
					<AnimatePresence mode="wait" initial={false}>
						<motion.div key={selectedTheme}>
							{selectedTheme === "dark" && (
								<motion.div
									variants={variants}
									initial="exit"
									animate="enter"
									exit="exit"
								>
									<Sun className="size-4" />
								</motion.div>
							)}
							{selectedTheme === "light" && (
								<motion.div
									variants={variants}
									initial="exit"
									animate="enter"
									exit="exit"
								>
									<Moon className="size-4" />
								</motion.div>
							)}
							{selectedTheme === "system" && (
								<motion.div
									variants={variants}
									initial="exit"
									animate="enter"
									exit="exit"
								>
									<Monitor className="size-4" />
								</motion.div>
							)}
						</motion.div>
					</AnimatePresence>
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" side="top">
				<DropdownMenuItem onClick={() => handleSetTheme("light")}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleSetTheme("dark")}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleSetTheme("system")}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
