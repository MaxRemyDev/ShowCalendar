import React, { useState } from "react";
import { X, Edit, Trash, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { getColorHex } from "../helpers/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "../helpers/types";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	CardDescription,
} from "@/components/ui/card";

interface CollapsibleDayDetailsProps {
	date: Date | null;
	events: CalendarEvent[];
	onClose: () => void;
	onEditEvent: (eventId: string) => void;
	onDeleteEvent: (eventId: string) => void;
}

const CollapsibleDayDetails: React.FC<CollapsibleDayDetailsProps> = ({
	date,
	events,
	onClose,
	onEditEvent,
	onDeleteEvent,
}) => {
	const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({});

	const toggleDetails = (id: string) => {
		setShowDetails((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const hasContent = (event: CalendarEvent) => {
		return (
			event.event_notes ||
			event.event_location ||
			(event.participants && event.participants.length > 0)
		);
	};

	return (
		<Collapsible
			open={!!date}
			className="w-full h-[100%] mx-5 px-6 py-4 bg-background-100 dark:bg-background-50 border-4 rounded-xl"
		>
			<CollapsibleTrigger asChild>
				<Button className="hidden">Toggle Day Details</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="relative">
				<div className="flex justify-end">
					<Button
						size="icon"
						variant="ghost"
						onClick={onClose}
						aria-label="Close details"
					>
						<X />
					</Button>
				</div>
				{date ? (
					<>
						<h2 className="text-xl font-semibold mb-4">
							Details for {format(date ?? new Date(), "dd MMMM yyyy")}
						</h2>
						<ScrollArea className="h-[calc(75vh-8rem)]">
							{events.length > 0 ? (
								<ul>
									{events.map((event) => {
										const hexColor = getColorHex(event.event_theme);
										const detailsVisible = showDetails[event.id] ?? false;
										const contentExists = hasContent(event);
										return (
											<Card key={event.id} className="mb-4 shadow-sm">
												<CardHeader className="pb-0 flex justify-between items-start">
													<div className="flex items-center">
														<CardTitle className="text-md font-bold">
															{event.event_title}
														</CardTitle>
														<TooltipProvider delayDuration={1}>
															<Tooltip>
																<TooltipTrigger>
																	<Badge
																		style={{
																			backgroundColor: `${hexColor}33`,
																			color: `${hexColor}cc`,
																			borderColor: `${hexColor}66`,
																		}}
																		className="ml-2"
																	>
																		{event.event_theme[0].toUpperCase() +
																			event.event_theme.slice(
																				1
																			)}
																	</Badge>
																</TooltipTrigger>
																<TooltipContent>
																	{event.event_description ??
																		"No description"}
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													</div>
													<CardDescription>
														<p className="text-foreground-600">
															{event.start_time && event.end_time ? (
																<>
																	{event.start_time} -{" "}
																	{event.end_time}
																</>
															) : (
																format(
																	new Date(event.event_date),
																	"HH:mm"
																)
															)}
														</p>
													</CardDescription>
													{contentExists && (
														<Button
															size="sm"
															variant="ghost"
															onClick={() => toggleDetails(event.id)}
															className="-ml-4 hover:bg-transparent text-foreground-300"
															aria-label="Toggle details"
														>
															{detailsVisible ? (
																<>
																	<ChevronUp className="mr-2" />
																	Close details
																</>
															) : (
																<>
																	<ChevronDown className="mr-2" />
																	Show details
																</>
															)}
														</Button>
													)}
												</CardHeader>
												{detailsVisible && (
													<CardContent>
														{event.event_notes && (
															<div className="text-foreground-600">
																<p className="font-semibold text-foreground-300">
																	Note:
																</p>
																{event.event_notes}
															</div>
														)}
														{event.event_location && (
															<div className="mt-2 text-foreground-600">
																<p className="font-semibold text-foreground-300">
																	Location:
																</p>
																{event.event_location}
															</div>
														)}
														{event.event_description && (
															<div className="mt-2 text-foreground-600">
																<p className="font-semibold text-foreground-300">
																	Description:
																</p>
																{event.event_description}
															</div>
														)}
														{event.participants &&
															event.participants.length > 0 && (
																<div className="mt-2 text-foreground-600">
																	<p className="font-semibold text-foreground-300">
																		Participants:
																	</p>
																	<div className="flex flex-wrap gap-2">
																		{event.participants.map(
																			(participant) => (
																				<div
																					key={
																						participant.email ??
																						participant.name
																					}
																					className="flex items-center gap-2"
																				>
																					<Tooltip>
																						<TooltipTrigger>
																							{participant.avatarFallback ? (
																								<Avatar className="bg-background-50">
																									<AvatarImage
																										src={
																											participant.avatarImage
																										}
																										alt={
																											participant.name
																										}
																									/>
																									<AvatarFallback>
																										{
																											participant.avatarFallback
																										}
																									</AvatarFallback>
																								</Avatar>
																							) : (
																								<div className="flex items-center h-10 px-2 rounded-full bg-background-50">
																									{
																										participant.name
																									}
																								</div>
																							)}
																						</TooltipTrigger>
																						<TooltipContent className="z-[999] font-semibold">
																							{participant.email ||
																							participant.phone ||
																							participant.role ||
																							participant.notes ? (
																								<>
																									{participant.email && (
																										<div className="text-foreground-300 flex text-center">
																											<p className="font-semibold text-foreground-100 mr-1">
																												Email:
																											</p>
																											{
																												participant.email
																											}
																										</div>
																									)}
																									{participant.phone && (
																										<div className="text-foreground-300 flex text-center">
																											<p className="font-semibold text-foreground-100 mr-1">
																												Phone:
																											</p>
																											{
																												participant.phone
																											}
																										</div>
																									)}
																									{participant.role && (
																										<div className="text-foreground-300 flex text-center">
																											<p className="font-semibold text-foreground-100 mr-1">
																												Role:
																											</p>
																											{
																												participant.role
																											}
																										</div>
																									)}
																									{participant.notes && (
																										<div className="text-foreground-300 flex text-center">
																											<p className="font-semibold text-foreground-100 mr-1">
																												Note:
																											</p>
																											{
																												participant.notes
																											}
																										</div>
																									)}
																								</>
																							) : (
																								<p>
																									No
																									information
																									from
																									this
																									participant
																								</p>
																							)}
																						</TooltipContent>
																					</Tooltip>
																				</div>
																			)
																		)}
																	</div>
																</div>
															)}
													</CardContent>
												)}
												<CardFooter className="flex justify-end">
													<div className="space-x-1">
														<Button
															size="icon"
															variant="ghost"
															onClick={() => onEditEvent(event.id)}
															aria-label="Edit event"
														>
															<Edit />
														</Button>
														<Button
															size="icon"
															variant="ghost"
															onClick={() => onDeleteEvent(event.id)}
															aria-label="Delete event"
														>
															<Trash />
														</Button>
													</div>
												</CardFooter>
											</Card>
										);
									})}
								</ul>
							) : (
								<p className="text-foreground-600">No events on this day</p>
							)}
						</ScrollArea>
					</>
				) : (
					<p className="text-foreground-600">No day selected</p>
				)}
			</CollapsibleContent>
		</Collapsible>
	);
};

export default CollapsibleDayDetails;
