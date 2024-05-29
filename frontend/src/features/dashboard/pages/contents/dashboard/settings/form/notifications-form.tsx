"use client";

import Link from "next/link";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

const notificationsFormSchema = z.object({
	type: z
		.enum(["all", "mentions", "none"], {
			required_error: "You need to select a notification type.",
		})
		.default("all"),
	mobile: z.boolean().default(false).optional(),

	// EMAIL
	communication_emails: z.boolean().default(true).optional(),
	marketing_emails: z.boolean().default(true).optional(),
	security_emails: z.boolean(),

	// SMS
	communication_sms: z.boolean().default(false).optional(),
	marketing_sms: z.boolean().default(false).optional(),
	security_sms: z.boolean(),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

// COME FROM DATABASE OR API
const defaultValues: Partial<NotificationsFormValues> = {
	type: "all",
	communication_emails: true,
	marketing_emails: true,
	security_emails: true,
	communication_sms: true,
	marketing_sms: true,
	security_sms: true,
};

export function NotificationsForm() {
	const form = useForm<NotificationsFormValues>({
		resolver: zodResolver(notificationsFormSchema),
		defaultValues,
	});

	function onSubmit(data: NotificationsFormValues) {
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
					name="type"
					render={({ field }) => (
						<FormItem className="space-y-3">
							<FormLabel>Notify me about...</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									className="flex flex-col space-y-1"
								>
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="all" />
										</FormControl>
										<FormLabel className="font-normal">
											All new messages
										</FormLabel>
									</FormItem>
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="mentions" />
										</FormControl>
										<FormLabel className="font-normal">
											Direct messages and mentions
										</FormLabel>
									</FormItem>
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="none" />
										</FormControl>
										<FormLabel className="font-normal">Nothing</FormLabel>
									</FormItem>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* EMAIL NOTIFICATION */}
				<div>
					<h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="communication_emails"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Communication emails
										</FormLabel>
										<FormDescription>
											Receive emails about your account activity.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="marketing_emails"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Marketing emails
										</FormLabel>
										<FormDescription>
											Receive emails about new products, features, and more.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="security_emails"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">Security emails</FormLabel>
										<FormDescription>
											Receive emails about your account activity and security.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled
											aria-readonly
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>

				{/* SMS NOTIFICATION */}
				<div>
					<h3 className="mb-4 text-lg font-medium">SMS Notifications</h3>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="communication_sms"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											Communication SMS
										</FormLabel>
										<FormDescription>
											Receive SMS about your account activity.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="marketing_sms"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">Marketing SMS</FormLabel>
										<FormDescription>
											Receive SMS about new products, features, and more.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="security_sms"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">Security SMS</FormLabel>
										<FormDescription>
											Receive SMS about your account activity and security.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled
											aria-readonly
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>
				<FormField
					control={form.control}
					name="mobile"
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0">
							<FormControl>
								<Checkbox checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel>Use different settings for my mobile devices</FormLabel>
								<FormDescription>
									You can manage your mobile notifications in the{" "}
									<Link href="/examples/forms">mobile settings</Link> page.
								</FormDescription>
							</div>
						</FormItem>
					)}
				/>
				<Button type="submit">Update notifications</Button>
			</form>
		</Form>
	);
}
