import { z } from "zod";

export const loginSchema = z.object({
	username: z
		.string()
		.min(3, { message: "Username must be at least 3 characters long" })
		.max(100, { message: "Username must be less than 100 characters long" }),

	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" })
		.max(1000, {
			message: "Password must be less than 1000 characters long",
		}),
});

export const signupSchema = z.object({
	username: z
		.string()
		.min(2, { message: "Username must be at least 3 characters long" })
		.max(100, { message: "Username must be less than 100 characters long" }),

	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" })
		.max(1000, {
			message: "Password must be less than 1000 characters long",
		}),

	email: z.string().email({ message: "Invalid email address" }),
});
