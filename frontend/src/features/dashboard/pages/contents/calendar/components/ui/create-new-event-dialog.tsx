import React, { useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SelectColorCombobox } from "./select-color-combobox";
import { useForm, FormProvider, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TimePicker } from "@/components/ui/time-picker";
import { Trash2 } from "lucide-react";

interface Participant {
	name: string;
	email: string;
}

interface EventFormValues {
	eventTitle: string;
	eventTheme: string;
	eventDescription: string;
	eventLocation: string;
	startTime: Date;
	endTime: Date;
	eventDate: string;
	participants: Participant[];
}

const eventSchema = z.object({
	eventTitle: z.string().min(1, "Event title is required"),
	eventTheme: z.string().min(1, "Event theme is required"),
	eventDescription: z.string().optional(),
	eventLocation: z.string().optional(),
	startTime: z.date().optional(),
	endTime: z.date().optional(),
	eventDate: z.string().min(1, "Event date is required"),
	participants: z
		.array(
			z.object({
				name: z.string().min(1, "Name is required"),
				email: z.string().email("Invalid email").optional(),
			})
		)
		.optional(),
});

interface CreateNewEventDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	addEvent: (
		title: string,
		date: string,
		theme: string,
		description: string,
		location: string,
		startTime: Date | undefined,
		endTime: Date | undefined,
		participants: any[],
		notes: string
	) => void;
	eventDate: string;
}

const CreateNewEventDialog: React.FC<CreateNewEventDialogProps> = ({
	open,
	onOpenChange,
	eventDate,
	addEvent,
}) => {
	const methods = useForm<EventFormValues>({
		resolver: zodResolver(eventSchema),
		defaultValues: {
			eventTitle: "New Event",
			eventTheme: "blue",
			eventDescription: "",
			eventLocation: "",
			startTime: new Date(new Date().setHours(8, 0, 0, 0)), // DEFAULT START TIME: 8 AM
			endTime: new Date(new Date().setHours(10, 0, 0, 0)), // DEFAULT END TIME: 10 AM
			eventDate,
			participants: [],
		},
	});

	useEffect(() => {
		methods.setValue("eventDate", eventDate);
	}, [eventDate, methods]);

	const { fields, append, remove } = useFieldArray({
		control: methods.control,
		name: "participants",
	});

	const onSubmit = (data: EventFormValues) => {
		addEvent(
			data.eventTitle,
			data.eventDate,
			data.eventTheme,
			data.eventDescription,
			data.eventLocation,
			data.startTime,
			data.endTime,
			data.participants,
			""
		);
		methods.reset();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle>Create Schedule</DialogTitle>
							<DialogClose onClick={() => onOpenChange(false)} />
						</DialogHeader>
						<div className="space-y-4">
							<Controller
								name="eventTitle"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel htmlFor="event-title">Title Schedule</FormLabel>
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
								<div className="space-y-2 flex flex-col">
									<FormLabel htmlFor="event-date">Date</FormLabel>
									<Controller
										name="eventDate"
										render={({ field }) => (
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														className={cn(
															"w-[200px] justify-start text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value
															? format(new Date(field.value), "PPP")
															: "Pick a date"}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0">
													<Calendar
														mode="single"
														selected={
															field.value
																? new Date(field.value)
																: undefined
														}
														onSelect={(date) =>
															field.onChange(date?.toISOString())
														}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
										)}
									/>
								</div>

								<div className="flex space-x-4 mt-4">
									<Controller
										name="startTime"
										render={({ field }) => (
											<FormItem>
												<FormLabel htmlFor="start-time">
													Start Time
												</FormLabel>
												<FormControl>
													<TimePicker
														date={
															field.value
																? new Date(field.value)
																: undefined
														}
														setDate={field.onChange}
														hideSeconds
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									<Controller
										name="endTime"
										render={({ field }) => (
											<FormItem>
												<FormLabel htmlFor="end-time">End Time</FormLabel>
												<FormControl>
													<TimePicker
														date={
															field.value
																? new Date(field.value)
																: undefined
														}
														setDate={field.onChange}
														hideSeconds
														hideClockIcon
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
							</div>
							<Controller
								name="eventTheme"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel htmlFor="event-theme">Mark Schedule</FormLabel>
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
							<Controller
								name="eventDescription"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel htmlFor="event-description">
											Description
										</FormLabel>
										<FormControl>
											<Textarea id="event-description" {...field} />
										</FormControl>
										{fieldState.error && (
											<FormMessage>{fieldState.error.message}</FormMessage>
										)}
									</FormItem>
								)}
							/>
							<Controller
								name="eventLocation"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel htmlFor="event-location">Location</FormLabel>
										<FormControl>
											<Input id="event-location" type="text" {...field} />
										</FormControl>
										{fieldState.error && (
											<FormMessage>{fieldState.error.message}</FormMessage>
										)}
									</FormItem>
								)}
							/>
							<div className="space-x-2">
								<FormLabel>Participants</FormLabel>
								{fields.map((item, index) => (
									<div key={item.id} className="flex space-x-2 my-2">
										<Controller
											name={`participants.${index}.name`}
											control={methods.control}
											render={({ field, fieldState }) => (
												<FormItem>
													<FormControl>
														<Input placeholder="Name" {...field} />
													</FormControl>
													{fieldState.error && (
														<FormMessage>
															{fieldState.error.message}
														</FormMessage>
													)}
												</FormItem>
											)}
										/>
										<Controller
											name={`participants.${index}.email`}
											control={methods.control}
											render={({ field, fieldState }) => (
												<FormItem>
													<FormControl>
														<Input placeholder="Email" {...field} />
													</FormControl>
													{fieldState.error && (
														<FormMessage>
															{fieldState.error.message}
														</FormMessage>
													)}
												</FormItem>
											)}
										/>
										<Button
											variant="outline"
											size="icon"
											onClick={() => remove(index)}
										>
											<Trash2 />
										</Button>
									</div>
								))}
								<Button
									variant="outline"
									onClick={() => append({ name: "", email: "" })}
								>
									Add Participant
								</Button>
							</div>
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
