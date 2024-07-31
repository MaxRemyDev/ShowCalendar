import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, lowerCase, sentenceCase } from "@/lib/utils";
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

const StateDropdown = ({ disabled }: StatesDropdownProps) => {
	const { countryValue, stateValue, openStateDropdown, setOpenStateDropdown, setStateValue } =
		useDropdownStore();

	const SD = (states as StateProps[]) || [];
	const S = SD.filter((state) => sentenceCase(state.country_name) === sentenceCase(countryValue));

	return (
		<Popover open={openStateDropdown} onOpenChange={setOpenStateDropdown}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={openStateDropdown}
					className="w-[300px] justify-between rounded-md border !border-input !bg-background focus:!bg-background focus:!outline-none focus:!ring-2 focus:!ring-background focus:!ring-offset-2 focus:!ring-offset-background disabled:!cursor-not-allowed disabled:!opacity-50"
					disabled={disabled || !countryValue || S.length === 0}
				>
					<span>
						{S.length > 0 ? (
							stateValue ? (
								<div className="flex items-end gap-2">
									<span>
										{
											S.find((state) => lowerCase(state.name) === stateValue)
												?.name
										}
									</span>
								</div>
							) : (
								<span>Select State...</span>
							)
						) : (
							<span>No data found</span>
						)}
					</span>
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
								{S.map((state) => (
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

const states: StateProps[] = [
	{
		id: 1,
		name: "Zurich",
		country_id: 1,
		country_code: "CH",
		country_name: "Switzerland",
		state_code: "ZH",
		type: null,
		latitude: "47.3686498",
		longitude: "8.5391825",
	},
	{
		id: 2,
		name: "Vaud",
		country_id: 1,
		country_code: "CH",
		country_name: "Switzerland",
		state_code: "VD",
		type: null,
		latitude: "46.603354",
		longitude: "6.692845",
	},
	{
		id: 3,
		name: "Île-de-France",
		country_id: 2,
		country_code: "FR",
		country_name: "France",
		state_code: "IDF",
		type: "Metropolitan region",
		latitude: "48.8499198",
		longitude: "2.6370411",
	},
	{
		id: 4,
		name: "Provence-Alpes-Côte d'Azur",
		country_id: 2,
		country_code: "FR",
		country_name: "France",
		state_code: "PACA",
		type: "Region",
		latitude: "43.9351691",
		longitude: "6.0679194",
	},
];
