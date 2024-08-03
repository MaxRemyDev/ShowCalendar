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

interface CountryProps {
	id: number;
	name: string;
	iso3: string;
	iso2: string;
	numeric_code: string;
	phone_code: string;
	capital: string;
	currency: string;
	currency_name: string;
	currency_symbol: string;
	tld: string;
	native: string;
	region: string;
	region_id: string;
	subregion: string;
	subregion_id: string;
	nationality: string;
	timezones: Timezone[];
	translations: Record<string, string>;
	latitude: string;
	longitude: string;
	emoji: string;
	emojiU: string;
}

interface Timezone {
	zoneName: string;
	gmtOffset: number;
	gmtOffsetName: string;
	abbreviation: string;
	tzName: string;
}

interface CountryDropdownProps {
	className?: string;
	disabled?: boolean;
}

const CountryDropdown = ({ disabled, className }: CountryDropdownProps) => {
	const { countryValue, setCountryValue, openCountryDropdown, setOpenCountryDropdown } =
		useDropdownStore();
	const [countries, setCountries] = useState<CountryProps[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCountries = async () => {
			try {
				const response = await axios.get("https://api.countrystatecity.in/v1/countries", {
					headers: {
						"X-CSCAPI-KEY": process.env.NEXT_PUBLIC_COUNTRY_STATE_CITY_API,
					},
				});
				setCountries(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching countries:", error);
				setLoading(false);
			}
		};

		fetchCountries();
	}, []);

	const renderButtonContent = () => {
		if (loading) {
			return (
				<div className="flex justify-center items-center w-full">
					<Loader className="h-4 w-4 animate-spin" />
				</div>
			);
		}

		if (countries.length === 0) {
			return <span>No data found</span>;
		}

		if (countryValue) {
			const selectedCountry = countries.find(
				(country) => lowerCase(country.name) === countryValue
			);
			return (
				<div className="flex items-center gap-2 truncate">
					<span>{selectedCountry?.emoji}</span>
					<span className="truncate">{selectedCountry?.name}</span>
				</div>
			);
		}

		return <span>Select Country...</span>;
	};

	return (
		<Popover open={openCountryDropdown} onOpenChange={setOpenCountryDropdown}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					aria-haspopup="listbox"
					aria-expanded={openCountryDropdown}
					className={cn(
						"w-full sm:w-[calc(50%-1rem)] flex justify-between items-center rounded-md border !border-input !bg-background focus:!bg-background focus:!outline-none focus:!ring-2 focus:!ring-background focus:!ring-offset-2 focus:!ring-offset-background",
						className
					)}
					disabled={disabled || loading}
				>
					{renderButtonContent()}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] rounded-[6px] border border-input p-0">
				<Command>
					<CommandInput placeholder="Search country..." />
					<CommandEmpty>No country found.</CommandEmpty>
					<CommandGroup>
						<ScrollArea className="h-[300px] w-full">
							<CommandList>
								{countries.map((country) => (
									<CommandItem
										key={country.id}
										value={country.name}
										onSelect={(currentValue) => {
											setCountryValue(lowerCase(currentValue));
											setOpenCountryDropdown(false);
										}}
										className="flex cursor-pointer items-center justify-between text-xs"
									>
										<div className="flex items-end gap-2">
											<span>{country.emoji}</span>
											<span className="">{country.name}</span>
										</div>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												countryValue === lowerCase(country.name)
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

export default CountryDropdown;
