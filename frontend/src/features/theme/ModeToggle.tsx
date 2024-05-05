import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Monitor, Moon } from "lucide-react";
import ThreeStateSwitch from "@/components/ui/threeStateSwitch";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();
	const [switchPosition, setSwitchPosition] = useState<0 | 1 | 2>(0);

	useEffect(() => {
		switch (theme) {
			case "light":
				setSwitchPosition(0);
				break;
			case "system":
				setSwitchPosition(1);
				break;
			case "dark":
				setSwitchPosition(2);
				break;
		}
	}, [theme]);

	const handleSwitchChange = (position: 0 | 1 | 2) => {
		setSwitchPosition(position);
		switch (position) {
			case 0:
				setTheme("light");
				break;
			case 1:
				setTheme("system");
				break;
			case 2:
				setTheme("dark");
				break;
		}
	};

	const icons = [<Sun key="sun" />, <Monitor key="monitor" />, <Moon key="moon" />];

	return (
		<ThreeStateSwitch
			id="theme-mode-switch"
			currentState={switchPosition}
			onStateChange={handleSwitchChange}
			icons={icons}
		/>
	);
}
