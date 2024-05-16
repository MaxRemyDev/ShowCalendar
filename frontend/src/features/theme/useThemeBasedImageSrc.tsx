import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export const useThemeBasedImageSrc = (imagesLight: string[], imagesDark: string[]) => {
	const { theme, systemTheme, resolvedTheme } = useTheme();
	const [imageUrl, setImageUrl] = useState(imagesLight);

	useEffect(() => {
		const currentTheme = resolvedTheme || theme;
		if (currentTheme === "dark") {
			setImageUrl(imagesDark);
		} else {
			setImageUrl(imagesLight);
		}
	}, [theme, systemTheme, resolvedTheme, imagesDark, imagesLight]);

	return imageUrl;
};
