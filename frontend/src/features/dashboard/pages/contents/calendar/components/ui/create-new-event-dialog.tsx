"use client";

import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogClose,
	DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SelectColorCombobox } from "./select-color-combobox";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const eventSchema = z.object({
	eventTitle: z.string().min(1, "Event title is required"),
	eventTheme: z.string().min(1, "Event theme is required"),
});

interface CreateNewEventDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	addEvent: (eventTitle: string, eventDate: string, eventTheme: string) => void;
	eventDate: string;
}

const CreateNewEventDialog: React.FC<CreateNewEventDialogProps> = ({
	open,
	onOpenChange,
	eventDate,
	addEvent,
}) => {
	const methods = useForm({
		resolver: zodResolver(eventSchema),
		defaultValues: {
			eventTitle: "",
			eventTheme: "",
		},
	});

	const onSubmit = (data: any) => {
		addEvent(data.eventTitle, eventDate, data.eventTheme);
		methods.reset();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogOverlay />
			<DialogContent>
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle>Add Event Details</DialogTitle>
							<DialogClose onClick={() => onOpenChange(false)} />
						</DialogHeader>
						<div className="space-y-4">
							<Controller
								name="eventTitle"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel htmlFor="event-title">Event title</FormLabel>
										<FormControl>
											<Input id="event-title" type="text" {...field} />
										</FormControl>
										{fieldState.error && (
											<FormMessage>{fieldState.error.message}</FormMessage>
										)}
									</FormItem>
								)}
							/>
							<div>
								<FormLabel htmlFor="event-date">Event date</FormLabel>
								<Input id="event-date" type="text" value={eventDate} readOnly />
							</div>
							<Controller
								name="eventTheme"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel htmlFor="event-theme">Select a theme</FormLabel>
										<FormControl>
											<SelectColorCombobox
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										{fieldState.error && (
											<FormMessage>{fieldState.error.message}</FormMessage>
										)}
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="pt-10">
							<Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit" size="lg">
								Save Event
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
};

export default CreateNewEventDialog;
