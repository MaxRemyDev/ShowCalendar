"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema, signupSchema } from "@/components/form/auth/auth-validation";
import { useAuthStore } from "@/components/form/auth/auth-store";
import {
	Form,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faGoogle } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

/*
	INFO: REUSABLE COMPONENT FOR USER AUTHENTICATION FORM
	INFO: USES REACT HOOK FORM FOR STATE MANAGEMENT AND ZOD FOR VALIDATION
	INFO: HANDLES LOGIN AND SIGNUP VIA USEAUTHSTORE TO DETERMINE STATE
	INFO: FORM FIELDS: USERNAME (SIGNUP), EMAIL, PASSWORD, AND "REMEMBER ME" (LOGIN)
	INFO: FORM SUBMISSIONS VIA USEMUTATION FROM TANSTACK QUERY FOR API CALLS
	INFO: MANAGES LOADING, SUCCESS, AND ERROR STATES, WITH REDIRECTION TO /DASHBOARD
	INFO: OAUTH BUTTONS FOR GOOGLE AND APPLE WITH VISUAL LOADING STATES
	INFO: LINKS TO PRIVACY POLICY, TERMS OF SERVICE, AND PASSWORD RECOVERY

	TODO: FIX THIS ERROR WARNING SHOW AFTER PUT CHARACTER IN INPUT (client side console)
	!FIX:("Warning: A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component.")
*/

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {} // HTMLAttributes for form element props

// FORM VALIDATION SCHEMA
interface FormValues {
	username?: string;
	email: string;
	password: string;
	remember?: boolean;
}

// FUNCTION TO LOG IN USER VIA API CALL
const loginUser = async (data: FormValues): Promise<any> => {
	const response = await axios.post("/api/login", data);
	return response.data;
};

// FUNCTION TO SIGN UP USER VIA API CALL
const signupUser = async (data: FormValues): Promise<any> => {
	const response = await axios.post("/api/signup", data);
	return response.data;
};

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
	// USEAUTHSTORE FOR STATE MANAGEMENT
	const isLoading = useAuthStore((state) => state.isLoading);
	const isLogin = useAuthStore((state) => state.isLogin);
	const setIsLoading = useAuthStore((state) => state.setIsLoading);
	const setIsLogin = useAuthStore((state) => state.setIsLogin);

	// USEFORM HOOK FOR FORM MANAGEMENT
	const router = useRouter();
	const form = useForm<FormValues>({
		resolver: zodResolver(isLogin ? loginSchema : signupSchema),
	});

	// USEMUTATION FOR API CALLS
	const mutation = useMutation({
		mutationFn: isLogin ? loginUser : signupUser,
		onMutate: () => setIsLoading(true),
		onSuccess: () => {
			setIsLoading(false);
			router.push("/dashboard");
		},
		onError: () => setIsLoading(false),
	});

	// SUBMIT HANDLER FOR FORM SUBMISSION
	const onSubmit: SubmitHandler<FormValues> = (data) => {
		mutation.mutate(data);
	};

	// SET ISLOGIN STATE BASED ON ROUTE
	React.useEffect(() => {
		const pathname = window.location.pathname;
		setIsLogin(pathname === "/login");
	}, [setIsLogin]);

	return (
		<div className={cn("grid gap-6 z-30", className)} {...props}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
					<div className="grid gap-4">
						{/* TITLE WITH DESCRIPTION */}
						{isLogin ? (
							<div className="flex flex-col space-y-2 text-center">
								<h1 className="text-2xl font-semibold tracking-tight">
									Welcome Back <span className="lg:hidden">to ShowCalendar</span>
								</h1>
								<p className="text-sm text-muted-foreground">Log in to continue</p>
							</div>
						) : (
							<div className="flex flex-col space-y-2 text-center">
								<h1 className="text-2xl font-semibold tracking-tight">
									Create an account{" "}
									<span className="lg:hidden">on ShowCalendar</span>
								</h1>
								<p className="text-sm text-muted-foreground">
									Enter your username, email and password below to create your
									account
								</p>
							</div>
						)}

						{/* USERNAME INPUT (SIGN UP PAGE ONLY) */}
						{!isLogin && (
							<FormField
								name="username"
								control={form.control}
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel className="text-foreground">Username</FormLabel>
										<FormControl>
											<Input
												id="username"
												placeholder="Name"
												type="text"
												autoCapitalize="none"
												autoComplete="name"
												autoCorrect="off"
												disabled={isLoading}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{/* EMAIL INPUT */}
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-foreground">Email</FormLabel>
									<FormControl>
										<Input
											id="email"
											placeholder="name@example.com"
											type="email"
											autoCapitalize="none"
											autoComplete="email"
											autoCorrect="off"
											disabled={isLoading}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* PASSWORD INPUT */}
						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-foreground">Password</FormLabel>
									<FormControl>
										<Input
											id="password"
											type="password"
											autoComplete="current-password"
											disabled={isLoading}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* CHECKBOX REMEMBER ME AND FORGOT PASSWORD LINK (LOGIN PAGE ONLY) */}
						{isLogin && (
							<div className="flex items-center justify-between">
								<FormField
									name="remember"
									control={form.control}
									render={({ field }) => (
										<FormItem className="flex items-center space-x-2 space-y-0">
											<FormControl>
												<Checkbox
													id="remember"
													disabled={isLoading}
													checked={field.value || false}
													onCheckedChange={(checked) =>
														field.onChange(checked)
													}
												/>
											</FormControl>
											<label
												htmlFor="remember"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Remember me
											</label>
										</FormItem>
									)}
								/>
								<Link href="/forgot-password" className="text-sm underline">
									Forgot your password?
								</Link>
							</div>
						)}

						{/* LOGIN AND SIGN UP BUTTONS */}
						<Button disabled={isLoading} type="submit" className="w-full">
							{isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
							{isLogin ? "Log In with Email" : "Sign Up with Email"}
						</Button>
					</div>
				</form>
			</Form>

			{/* SEPARATION LINE BELOW FORM AND SOCIAL BUTTONS OPTIONS*/}
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t border-[2px]" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>

			{/* SOCIAL BUTTONS OPTIONS */}
			<div className="grid grid-cols-2 gap-4">
				<Button variant="outline" type="button" disabled={isLoading} className="w-full">
					{isLoading ? (
						<Loader className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<FontAwesomeIcon icon={faGoogle} className="mr-2 h-4 w-4" />
					)}
					Google
				</Button>
				<Button variant="outline" type="button" disabled={isLoading} className="w-full">
					{isLoading ? (
						<Loader className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<FontAwesomeIcon icon={faApple} className="mr-2 h-4 w-4" />
					)}
					Apple
				</Button>
			</div>

			{/* TERMS AND PRIVACY POLICY */}
			<p className="px-8 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our{" "}
				<Link href="/terms" className="underline underline-offset-4 hover:text-primary">
					Terms of Service
				</Link>{" "}
				and{" "}
				<Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
					Privacy Policy
				</Link>
				.
			</p>
		</div>
	);
}
