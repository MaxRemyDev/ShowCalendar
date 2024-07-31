"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, useWatch, useFieldArray, UseFormSetValue } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AtSign, Trash, Upload, User } from "lucide-react";
import { SelectScrollingLanguages } from "@/components/ui/SelectScrollingLanguages";
import { UserDetails, useUser } from "@/features/dashboard/components/utils/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StateDropdown from "@/components/ui/states";
import CountryDropdown from "@/components/ui/countries";
import { useDropdownStore } from "@/components/ui/use-dropdown";
import { MinimalDatePicker } from "@/components/ui/minimal-date-picker";
import { CalendarDate } from "@internationalized/date";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

type UserDetailsKeys = keyof UserDetails;

const MIN_DATE = new Date(1900, 0, 1);

const accountFormSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "Name must be at least 2 characters.",
		})
		.max(30, {
			message: "Name must not be longer than 30 characters.",
		})
		.optional(),
	dob: z
		.string({
			required_error: "A date of birth is required.",
		})
		.refine(
			(dateString) => {
				const date = new Date(dateString);
				return !isNaN(date.getTime()) && date >= MIN_DATE;
			},
			{
				message: "Date must be after January 1, 1900",
			}
		)
		.optional(),
	language: z.string({
		required_error: "Please select a language.",
	}),
	username: z
		.string()
		.min(2, {
			message: "Username must be at least 2 characters.",
		})
		.max(30, {
			message: "Username must not be longer than 30 characters.",
		})
		.optional(),
	email: z
		.string({
			required_error: "Please select an email to display.",
		})
		.email()
		.optional(),
	bio: z.string().max(160).min(4).optional(),
	urls: z
		.array(
			z.object({
				value: z.string().url({ message: "Please enter a valid URL." }),
			})
		)
		.optional(),
	location: z.string().max(100).min(1).optional(),
	countryValue: z.string().optional(),
	stateValue: z.string().optional(),
	avatar: z.string().url({ message: "Please enter a valid URL." }).optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const defaultValues: Partial<AccountFormValues> = {
	name: "",
	dob: undefined,
	language: "en",
	username: "",
	email: "",
	bio: "",
	urls: [{ value: "" }],
	location: "",
	countryValue: "",
	stateValue: "",
	avatar: "",
};

const CountryState = ({
	countryValue,
	stateValue,
	setValue,
	isDisabled,
}: {
	countryValue: string;
	stateValue: string;
	setValue: UseFormSetValue<AccountFormValues>;
	isDisabled: boolean;
}) => {
	const {
		countryValue: dropdownCountryValue,
		setCountryValue,
		stateValue: dropdownStateValue,
		setStateValue,
	} = useDropdownStore();

	useEffect(() => {
		if (countryValue) {
			setCountryValue(countryValue);
		}
		if (stateValue) {
			setStateValue(stateValue);
		}
	}, [countryValue, stateValue, setCountryValue, setStateValue]);

	useEffect(() => {
		setValue("countryValue", dropdownCountryValue);
		setValue("stateValue", dropdownStateValue);
	}, [dropdownCountryValue, dropdownStateValue, setValue]);

	return (
		<div className="flex flex-col sm:flex-row w-full max-w-[480px] items-center justify-start sm:space-x-3 space-y-3 sm:space-y-0">
			<CountryDropdown disabled={isDisabled} className="w-full sm:w-auto" />
			<span className="hidden sm:inline mx-2">-</span>
			<StateDropdown disabled={isDisabled} className="w-full sm:w-auto" />
		</div>
	);
};

export function AccountForm() {
	const { user, loading, error, refreshUser, updateUser, getUpdatedDetails } = useUser();
	const methods = useForm<AccountFormValues>({
		resolver: zodResolver(accountFormSchema),
		defaultValues,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [canUpdate, setCanUpdate] = useState(true);

	const [initialValues, setInitialValues] = useState<Partial<AccountFormValues>>(defaultValues);

	const { fields, append, remove } = useFieldArray({
		name: "urls",
		control: methods.control,
	});

	const name = useWatch({ control: methods.control, name: "name" });
	const dob = useWatch({ control: methods.control, name: "dob" });
	const language = useWatch({ control: methods.control, name: "language" });
	const username = useWatch({ control: methods.control, name: "username" });
	const email = useWatch({ control: methods.control, name: "email" });
	const bio = useWatch({ control: methods.control, name: "bio" });
	const location = useWatch({ control: methods.control, name: "location" });
	const avatar = useWatch({ control: methods.control, name: "avatar" });

	useEffect(() => {
		if (user && user.details.length > 0) {
			const userDetails = user.details[0];
			const [country, state] = (userDetails.location ?? "").split(", ");
			const values = {
				name: userDetails.fullName || "",
				dob: userDetails.dateOfBirth ? userDetails.dateOfBirth : undefined,
				language: userDetails.language || "en",
				username: user.username || "",
				email: user.email || "",
				bio: userDetails.bio || "",
				urls: userDetails.websites?.map((url) => ({ value: url })) || [{ value: "" }],
				location: userDetails.location || "",
				countryValue: country || "",
				stateValue: state || "",
				avatar: userDetails.avatar || "",
			};
			console.log("Initial Values:", values);
			methods.reset(values);
			setInitialValues(values);
		}
	}, [user, methods]);

	const getChangedFields = (original: Partial<UserDetails>, updated: UserDetails) => {
		const changedFields: { [key in UserDetailsKeys]?: any } = {};
		(Object.keys(updated) as UserDetailsKeys[]).forEach((key) => {
			if (original[key] !== updated[key]) {
				changedFields[key] = updated[key];
			}
		});
		return changedFields;
	};

	const startCooldown = () => {
		setCanUpdate(false);
		setTimeout(() => {
			setCanUpdate(true);
		}, 10000);
	};

	async function onSubmit(data: AccountFormValues) {
		if (!canUpdate) {
			toast({
				title: "Please wait",
				description: "You can only update your account every 10 seconds.",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);

		// Simulate a longer loading time and validation checks
		await new Promise((resolve) => setTimeout(resolve, 3000));

		// Combine country and state into location
		const location = `${data.countryValue ?? ""}, ${data.stateValue ?? ""}`;

		const originalDetails: Partial<UserDetails> = user?.details[0] || {};
		const updatedDetails: UserDetails = getUpdatedDetails(
			{
				fullName: data.name,
				dateOfBirth: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
				language: data.language,
				bio: data.bio ?? "",
				websites: data.urls?.map((url) => url.value).filter(Boolean) || [],
				location,
				avatar: data.avatar ?? "",
			},
			originalDetails
		);

		const validationResult = accountFormSchema.safeParse(data);
		if (!validationResult.success) {
			toast({
				title: "Validation error",
				description: "Please ensure all fields are correctly filled out.",
				variant: "destructive",
			});
			setIsLoading(false);
			return;
		}

		const changedFields = getChangedFields(originalDetails, updatedDetails);

		if (Object.keys(changedFields).length === 0) {
			toast({
				title: "No changes detected",
				description: "No fields were changed.",
				variant: "default",
			});
			setIsLoading(false);
			return;
		}

		try {
			const updatedUser = await updateUser({
				details: [updatedDetails],
				status: user?.status ?? [],
				username: data.username,
				email: data.email,
			});
			if (updatedUser) {
				const changesDescription = Object.keys(changedFields).map((key) => {
					const value = changedFields[key as UserDetailsKeys];
					return (
						<li key={key}>
							{key}: {value}
						</li>
					);
				});

				toast({
					title: "Account updated",
					description: (
						<ul className="p-3 w-[250px] rounded-md bg-background-200">
							{changesDescription}
						</ul>
					),
					variant: "success",
				});
				startCooldown();
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update account",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}

	function handleUploadAvatar() {
		// Logic to handle avatar upload
		toast({
			title: "Avatar Uploaded",
			variant: "success",
			persistent: true,
		});
	}

	function handleDeleteAvatar() {
		// Logic to handle avatar deletion
		toast({
			title: "Avatar Deleted",
			variant: "success",
			persistent: true,
		});
	}

	function handleCancel() {
		methods.reset(initialValues);

		toast({
			title: "Changes cancelled",
			variant: "success",
			persistent: true,
		});
	}

	return (
		<div className="space-y-8">
			<div>
				<h3 className="text-lg font-medium">Account Details</h3>
				<p className="text-sm text-muted-foreground">Manage your account details</p>
			</div>
			<FormProvider {...methods}>
				<Form {...methods}>
					<form
						onSubmit={methods.handleSubmit(onSubmit)}
						className="md:col-span-2 flex items-center bg-background-50 border-2 border-background-100 rounded-xl p-5"
					>
						<FormField
							control={methods.control}
							name="avatar"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Avatar
											{...field}
											className="size-16 ml-3 border-2 bg-secondary"
										>
											<AvatarImage src={avatar} alt={username} />
											<AvatarFallback>
												{user?.username ? (
													user.username.slice(0, 2).toUpperCase()
												) : (
													<User />
												)}
											</AvatarFallback>
										</Avatar>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="ml-4 flex space-x-2">
							<Button
								type="button"
								variant="outline"
								disabled={isLoading}
								onClick={handleUploadAvatar}
							>
								<Upload className="mr-2 size-4" /> Upload
							</Button>
							<Button
								type="button"
								variant="outline"
								disabled={isLoading}
								onClick={handleDeleteAvatar}
							>
								<Trash className="mr-2 size-4" />
								Remove
							</Button>
						</div>
					</form>
					<form
						onSubmit={methods.handleSubmit(onSubmit)}
						className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-background-50 border-2 border-background-100 rounded-xl p-5"
					>
						<FormField
							control={methods.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											icon={
												<>
													<AtSign className="size-5" />
												</>
											}
											placeholder="name"
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<FormDescription>
										This is your public display name. It can be your real name
										or a pseudonym. You can only change this once every 30 days.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={methods.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Your name"
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<FormDescription>
										This is the name that will be displayed on your profile and
										in emails.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={methods.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<Input placeholder="email" {...field} disabled={isLoading} />
									<FormDescription>
										You can manage verified email addresses in your {""}
										<Link href="/dashboard/settings/profile/email-setting">
											<Button
												variant="link"
												className="-mx-4 text-muted-foreground font-bold"
											>
												email settings
											</Button>
										</Link>
										.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={methods.control}
							name="location"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location</FormLabel>
									<FormControl>
										<CountryState
											countryValue={initialValues.countryValue ?? ""}
											stateValue={initialValues.stateValue ?? ""}
											setValue={methods.setValue}
											isDisabled={isLoading}
										/>
									</FormControl>
									<FormDescription>
										This is the location that will be displayed on your profile
										and in emails.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={methods.control}
							name="language"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Language</FormLabel>
									<SelectScrollingLanguages
										name={field.name}
										defaultValue={field.value}
										onValueChange={(value: string) => field.onChange(value)}
										iconDisable={true}
										disabled={isLoading}
									/>
									<FormDescription>
										This is the language that will be used in the dashboard and
										on your profile.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={methods.control}
							name="dob"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Date of birth</FormLabel>
									<MinimalDatePicker
										className="max-w-[225px]"
										value={
											field.value
												? new CalendarDate(
														new Date(field.value).getFullYear(),
														new Date(field.value).getMonth() + 1,
														new Date(field.value).getDate()
												  )
												: undefined
										}
										onChange={(date) => {
											const newDate = date
												? new Date(date.toString())
														.toISOString()
														.split("T")[0]
												: undefined;
											field.onChange(newDate);
										}}
										isDisabled={isLoading}
									/>
									<FormDescription>
										This is the date that will be displayed on your profile.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={methods.control}
							name="bio"
							render={({ field }) => (
								<FormItem className="md:col-span-2">
									<FormLabel>Bio</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Tell us a little bit about yourself"
											className="resize-none"
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<FormDescription>
										You can <strong>@mention</strong> other users and
										organizations to link to them.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="col-span-1 md:col-span-2">
							{fields.map((field, index) => (
								<FormField
									control={methods.control}
									key={field.id}
									name={`urls.${index}.value`}
									render={({ field }) => (
										<FormItem>
											<FormLabel className={cn(index !== 0 && "sr-only")}>
												URLs
											</FormLabel>
											<FormDescription
												className={cn(index !== 0 && "sr-only")}
											>
												Add links to your website, blog, or social media
												profiles.
											</FormDescription>
											<FormControl>
												<Input
													{...field}
													placeholder="https://"
													disabled={isLoading}
													actionButton={
														<>
															<Button
																type="button"
																variant="ghost"
																size="icon"
																onClick={() => remove(index)}
																disabled={isLoading}
																className="rounded-l-none"
															>
																<Trash className="size-4" />
															</Button>
														</>
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							))}
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="mt-2"
								onClick={() => append({ value: "" })}
								disabled={isLoading}
							>
								Add URL
							</Button>
						</div>
					</form>
					<form
						onSubmit={methods.handleSubmit(onSubmit)}
						className="flex space-x-4 justify-end"
					>
						<Button
							variant="outline"
							type="reset"
							disabled={isLoading}
							onClick={handleCancel}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Updating..." : "Update account"}
						</Button>
					</form>
				</Form>
			</FormProvider>
		</div>
	);
}
