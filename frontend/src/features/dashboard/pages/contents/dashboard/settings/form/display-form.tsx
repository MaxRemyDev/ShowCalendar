"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

const sidebarItems = [
	{ id: "messages", label: "Messages" },
	{ id: "tasks", label: "Tasks" },
	{ id: "files", label: "Files" },
] as const;

const calendarItems = [
	{ id: "events", label: "Events" },
	{ id: "reminders", label: "Reminders" },
	{ id: "tasks", label: "Tasks" },
] as const;

const displayFormSchema = z.object({
	sidebar: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: "You have to select at least one sidebar item.",
	}),
	calendar: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: "You have to select at least one calendar item.",
	}),
	other: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: "You have to select at least one other item.",
	}),
});

type DisplayFormValues = z.infer<typeof displayFormSchema>;

// COME FROM DATABASE OR API
const defaultValues: Partial<DisplayFormValues> = {
	sidebar: ["recents", "home"],
	calendar: ["events"],
	other: ["settings"],
};

export function DisplayForm() {
	const form = useForm<DisplayFormValues>({
		resolver: zodResolver(displayFormSchema),
		defaultValues,
	});

	function onSubmit(data: DisplayFormValues) {
		toast({
			title: "You submitted the following values:",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="sidebar"
					render={() => (
						<FormItem>
							<div className="mb-4">
								<FormLabel className="text-base">Sidebar</FormLabel>
								<FormDescription>
									Select the items you want to display in the sidebar.
								</FormDescription>
							</div>
							{sidebarItems.map((item) => (
								<FormField
									key={item.id}
									control={form.control}
									name="sidebar"
									render={({ field }) => {
										return (
											<FormItem
												key={item.id}
												className="flex flex-row items-start space-x-3 space-y-0"
											>
												<FormControl>
													<Checkbox
														checked={field.value?.includes(item.id)}
														onCheckedChange={(checked) => {
															return checked
																? field.onChange([
																		...field.value,
																		item.id,
																  ])
																: field.onChange(
																		field.value?.filter(
																			(value) =>
																				value !== item.id
																		)
																  );
														}}
													/>
												</FormControl>
												<FormLabel className="font-normal">
													{item.label}
												</FormLabel>
											</FormItem>
										);
									}}
								/>
							))}
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="calendar"
					render={() => (
						<FormItem>
							<div className="mb-4">
								<FormLabel className="text-base">Calendar</FormLabel>
								<FormDescription>
									Select the items you want to display in the calendar.
								</FormDescription>
							</div>
							{calendarItems.map((item) => (
								<FormField
									key={item.id}
									control={form.control}
									name="calendar"
									render={({ field }) => {
										return (
											<FormItem
												key={item.id}
												className="flex flex-row items-start space-x-3 space-y-0"
											>
												<FormControl>
													<Checkbox
														checked={field.value?.includes(item.id)}
														onCheckedChange={(checked) => {
															return checked
																? field.onChange([
																		...field.value,
																		item.id,
																  ])
																: field.onChange(
																		field.value?.filter(
																			(value) =>
																				value !== item.id
																		)
																  );
														}}
													/>
												</FormControl>
												<FormLabel className="font-normal">
													{item.label}
												</FormLabel>
											</FormItem>
										);
									}}
								/>
							))}
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Update display</Button>
			</form>
		</Form>
	);
}
