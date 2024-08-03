import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check, ChevronsUpDown, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, lowerCase } from "@/lib/utils";
import { useDropdownStore } from "./use-dropdown";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

interface StateProps {
	id: number;
	name: string;
	country_id: number;
	country_code: string;
	country_name: string;
	state_code: string;
	type: string | null;
	latitude: string;
	longitude: string;
}

interface StatesDropdownProps {
	className?: string;
	disabled?: boolean;
}

const StateDropdown = ({ disabled, className }: StatesDropdownProps) => {
	const { countryValue, stateValue, openStateDropdown, setOpenStateDropdown, setStateValue } =
		useDropdownStore();
	const [states, setStates] = useState<StateProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [noStatesAvailable, setNoStatesAvailable] = useState(false);

	useEffect(() => {
		const fetchStates = async () => {
			if (!countryValue) {
				setStateValue("");
				return;
			}

			setLoading(true);
			setNoStatesAvailable(false);
			setStateValue("");

			try {
				const countryIso2 = await axios
					.get(`https://api.countrystatecity.in/v1/countries`, {
						headers: {
							"X-CSCAPI-KEY": process.env.NEXT_PUBLIC_COUNTRY_STATE_CITY_API,
						},
					})
					.then((response) => {
						const country = response.data.find(
							(c: any) => lowerCase(c.name) === lowerCase(countryValue)
						);
						return country?.iso2;
					});

				if (countryIso2) {
					const response = await axios.get(
						`https://api.countrystatecity.in/v1/countries/${countryIso2}/states`,
						{
							headers: {
								"X-CSCAPI-KEY": process.env.NEXT_PUBLIC_COUNTRY_STATE_CITY_API,
							},
						}
					);
					if (response.data.length === 0) {
						setNoStatesAvailable(true);
					}
					setStates(response.data);
				} else {
					setStates([]);
				}
				setLoading(false);
			} catch (error) {
				console.error("Error fetching states:", error);
				setLoading(false);
				setStates([]);
			}
		};

		fetchStates();
	}, [countryValue, setStateValue]);

	const renderButtonContent = () => {
		if (loading) {
			return (
				<div className="flex justify-center items-center w-full">
					<Loader className="h-4 w-4 animate-spin" />
				</div>
			);
		}

		if (noStatesAvailable) {
			return <span className="truncate">No states available</span>;
		}

		if (states.length === 0) {
			return <span className="truncate">No data found</span>;
		}

		if (stateValue && states.find((state) => lowerCase(state.name) === stateValue)) {
			return (
				<div className="flex items-center gap-2 truncate">
					<span className="truncate">
						{states.find((state) => lowerCase(state.name) === stateValue)?.name}
					</span>
				</div>
			);
		}

		return <span>Select State...</span>;
	};

	return (
		<Popover open={openStateDropdown} onOpenChange={setOpenStateDropdown}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					aria-haspopup="listbox"
					aria-expanded={openStateDropdown}
					className={cn(
						"w-full sm:w-[calc(50%-1rem)] flex justify-between items-center rounded-md border !border-input !bg-background focus:!bg-background focus:!outline-none focus:!ring-2 focus:!ring-background focus:!ring-offset-2 focus:!ring-offset-background",
						className
					)}
					disabled={disabled || !countryValue || states.length === 0 || loading}
				>
					{renderButtonContent()}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] rounded-[6px] border border-input p-0">
				<Command>
					<CommandInput placeholder="Search state..." />
					<CommandEmpty>No state found.</CommandEmpty>
					<CommandGroup>
						<ScrollArea className="h-[300px] w-full">
							<CommandList>
								{states.map((state) => (
									<CommandItem
										key={state.id}
										value={state.name}
										onSelect={(currentValue) => {
											setStateValue(lowerCase(currentValue));
											setOpenStateDropdown(false);
										}}
										className="flex cursor-pointer items-center justify-between text-xs"
									>
										<div className="flex items-end gap-2">
											<span className="">{state.name}</span>
										</div>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												stateValue === lowerCase(state.name)
													? "opacity-100"
													: "opacity-0"
											)}
										/>
									</CommandItem>
								))}
							</CommandList>
							<ScrollBar orientation="vertical" />
						</ScrollArea>
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default StateDropdown;
