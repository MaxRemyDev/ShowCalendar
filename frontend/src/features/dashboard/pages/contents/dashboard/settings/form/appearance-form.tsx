"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const appearanceFormSchema = z.object({
	theme: z.enum(["light", "dark"], {
		required_error: "Please select a theme.",
	}),
	font: z
		.enum(["inter", "manrope", "system"], {
			invalid_type_error: "Select a font",
			required_error: "Please select a font.",
		})
		.optional(),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

// COME FROM DATABASE OR API
const defaultValues: Partial<AppearanceFormValues> = {
	theme: "light",
};

export function AppearanceForm() {
	const { setTheme } = useTheme();
	const form = useForm<AppearanceFormValues>({
		resolver: zodResolver(appearanceFormSchema),
		defaultValues,
	});
	const [isLoading, setIsLoading] = useState(false);

	function onSubmit(data: AppearanceFormValues) {
		console.log("Form submitted with data:", data);
		setTheme(data.theme); // Change the theme based on the form value
		toast({
			title: "You submitted the following values:",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		});
	}

	function handleCancel() {
		form.reset();
		console.log("Form reset");

		toast({
			title: "Changes cancelled",
			variant: "success",
			persistent: true,
		});
	}

	return (
		<div className="space-y-8">
			<Separator />
			<div>
				<h3 className="text-lg font-medium">Appearance</h3>
				<p className="text-sm text-muted-foreground">Manage your appearance settings</p>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 bg-background-50 border-2 border-background-100 rounded-xl p-5"
				>
					<FormField
						control={form.control}
						name="font"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Font</FormLabel>
								<div className="relative w-max">
									<FormControl>
										<select
											className={cn(
												buttonVariants({ variant: "outline" }),
												"w-[200px] appearance-none font-normal"
											)}
											{...field}
											onChange={(e) => {
												field.onChange(e);
												console.log("Font changed to:", e.target.value);
											}}
										>
											<option value="inter">Inter</option>
											<option value="manrope">Manrope</option>
											<option value="system">System</option>
										</select>
									</FormControl>
									<ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
								</div>
								<FormDescription>
									Set the font you want to use in the dashboard per default.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="theme"
						render={({ field }) => (
							<FormItem className="space-y-1">
								<FormLabel>Theme</FormLabel>
								<FormDescription>
									Select the theme for the dashboard per default.
								</FormDescription>
								<FormMessage />
								<RadioGroup
									onValueChange={(value) => {
										field.onChange(value);
										console.log("Theme changed to:", value);
									}}
									defaultValue={field.value}
									className="grid max-w-md grid-cols-2 gap-8 pt-2"
								>
									<FormItem>
										<FormLabel className="[&:has([data-state=checked])>div]:border-primary">
											<FormControl>
												<RadioGroupItem
													value="light"
													className="sr-only"
													onClick={() =>
														console.log("Light theme selected")
													}
												/>
											</FormControl>
											<div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
												<div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
													<div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
														<div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
														<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
													</div>
													<div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
														<div className="h-4 w-4 rounded-full bg-[#ecedef]" />
														<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
													</div>
													<div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
														<div className="h-4 w-4 rounded-full bg-[#ecedef]" />
														<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
													</div>
												</div>
											</div>
											<span className="block w-full p-2 text-center font-normal">
												Light
											</span>
										</FormLabel>
									</FormItem>
									<FormItem>
										<FormLabel className="[&:has([data-state=checked])>div]:border-primary">
											<FormControl>
												<RadioGroupItem
													value="dark"
													className="sr-only"
													onClick={() =>
														console.log("Dark theme selected")
													}
												/>
											</FormControl>
											<div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
												<div className="space-y-2 rounded-sm bg-slate-950 p-2">
													<div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
														<div className="h-2 w-[80px] rounded-lg bg-slate-400" />
														<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
													</div>
													<div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
														<div className="h-4 w-4 rounded-full bg-slate-400" />
														<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
													</div>
													<div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
														<div className="h-4 w-4 rounded-full bg-slate-400" />
														<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
													</div>
												</div>
											</div>
											<span className="block w-full p-2 text-center font-normal">
												Dark
											</span>
										</FormLabel>
									</FormItem>
								</RadioGroup>
							</FormItem>
						)}
					/>
				</form>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-4 justify-end">
					<Button
						variant="outline"
						type="reset"
						disabled={isLoading}
						onClick={handleCancel}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Updating..." : "Update preferences"}
					</Button>
				</form>
			</Form>
		</div>
	);
}
