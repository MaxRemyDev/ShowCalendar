import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			screens: {
				"lg-custom": "1096px", // 1024px + 72px
			},
			colors: {
				border: "var(--border)",
				input: "var(--input)",
				ring: "var(--ring)",
				background: {
					DEFAULT: "var(--background)",
					50: "var(--background-50)",
					100: "var(--background-100)",
					200: "var(--background-200)",
					300: "var(--background-300)",
					400: "var(--background-400)",
					500: "var(--background-500)",
					600: "var(--background-600)",
					700: "var(--background-700)",
					800: "var(--background-800)",
					900: "var(--background-900)",
				},
				foreground: {
					DEFAULT: "var(--foreground)",
					50: "var(--foreground-50)",
					100: "var(--foreground-100)",
					200: "var(--foreground-200)",
					300: "var(--foreground-300)",
					400: "var(--foreground-400)",
					500: "var(--foreground-500)",
					600: "var(--foreground-600)",
					700: "var(--foreground-700)",
					800: "var(--foreground-800)",
					900: "var(--foreground-900)",
				},
				primary: {
					DEFAULT: "var(--primary)",
					500: "var(--primary-500)",
					600: "var(--primary-600)",
					700: "var(--primary-700)",
					800: "var(--primary-800)",
					900: "var(--primary-900)",
					foreground: "var(--primary-foreground)",
				},
				secondary: {
					DEFAULT: "var(--secondary)",
					50: "var(--secondary-50)",
					100: "var(--secondary-100)",
					200: "var(--secondary-200)",
					300: "var(--secondary-300)",
					400: "var(--secondary-400)",
					foreground: "var(--secondary-foreground)",
				},
				destructive: {
					DEFAULT: "var(--destructive)",
					foreground: "var(--destructive-foreground)",
				},
				muted: {
					DEFAULT: "var(--muted)",
					foreground: "var(--muted-foreground)",
				},
				redColor: "var(--red-color)",
				orangeColor: "var(--orange-color)",
				greenColor: "var(--green-color)",
				accent: {
					DEFAULT: "var(--accent)",
					foreground: "var(--accent-foreground)",
				},
				popover: {
					DEFAULT: "var(--popover)",
					foreground: "var(--popover-foreground)",
				},
				card: {
					DEFAULT: "var(--card)",
					foreground: "var(--card-foreground)",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				shimmer: {
					"0%, 90%, 100%": {
						"background-position": "calc(-100% - var(--shimmer-width)) 0",
					},
					"30%, 60%": {
						"background-position": "calc(100% + var(--shimmer-width)) 0",
					},
				},
				gradient: {
					"0%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" },
					"100%": { backgroundPosition: "0% 50%" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				shimmer: "shimmer 8s infinite",
				gradient: "gradient 8s linear infinite",
			},
			dropShadow: {
				all: "0px 0px 50px rgba(0, 0, 0, 0.25)",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};

export default config;
