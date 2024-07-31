import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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

const CountryDropdown = ({ disabled }: CountryDropdownProps) => {
	const { countryValue, setCountryValue, openCountryDropdown, setOpenCountryDropdown } =
		useDropdownStore();
	const C = (countries as CountryProps[]) || [];

	return (
		<Popover open={openCountryDropdown} onOpenChange={setOpenCountryDropdown}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={openCountryDropdown}
					className="w-[300px] h-10 justify-between rounded-md border !border-input !bg-background focus:!bg-background focus:!outline-none focus:!ring-2 focus:!ring-background focus:!ring-offset-2 focus:!ring-offset-background"
					disabled={disabled}
				>
					<span>
						{C.length > 0 ? (
							countryValue ? (
								<div className="flex items-end gap-2">
									<span>
										{
											C.find(
												(country) =>
													lowerCase(country.name) === countryValue
											)?.emoji
										}
									</span>
									<span>
										{
											C.find(
												(country) =>
													lowerCase(country.name) === countryValue
											)?.name
										}
									</span>
								</div>
							) : (
								<span>Select Country...</span>
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
					<CommandInput placeholder="Search country..." />
					<CommandEmpty>No country found.</CommandEmpty>
					<CommandGroup>
						<ScrollArea className="h-[300px] w-full">
							<CommandList>
								{C.map((country) => (
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

const countries: CountryProps[] = [
	{
		id: 1,
		name: "Switzerland",
		iso3: "CHE",
		iso2: "CH",
		numeric_code: "756",
		phone_code: "41",
		capital: "Bern",
		currency: "CHF",
		currency_name: "Swiss Franc",
		currency_symbol: "CHF",
		tld: ".ch",
		native: "Schweiz",
		region: "Europe",
		region_id: "150",
		subregion: "Western Europe",
		subregion_id: "155",
		nationality: "Swiss",
		timezones: [
			{
				zoneName: "Europe/Zurich",
				gmtOffset: 3600,
				gmtOffsetName: "UTC+01:00",
				abbreviation: "CET",
				tzName: "Central European Time",
			},
		],
		translations: {
			en: "Switzerland",
			fr: "Suisse",
			de: "Schweiz",
			it: "Svizzera",
			es: "Suiza",
		},
		latitude: "46.818188",
		longitude: "8.227512",
		emoji: "🇨🇭",
		emojiU: "U+1F1E8 U+1F1ED",
	},
	{
		id: 2,
		name: "France",
		iso3: "FRA",
		iso2: "FR",
		numeric_code: "250",
		phone_code: "33",
		capital: "Paris",
		currency: "EUR",
		currency_name: "Euro",
		currency_symbol: "€",
		tld: ".fr",
		native: "France",
		region: "Europe",
		region_id: "150",
		subregion: "Western Europe",
		subregion_id: "155",
		nationality: "French",
		timezones: [
			{
				zoneName: "Europe/Paris",
				gmtOffset: 3600,
				gmtOffsetName: "UTC+01:00",
				abbreviation: "CET",
				tzName: "Central European Time",
			},
		],
		translations: {
			en: "France",
			fr: "France",
			de: "Frankreich",
			it: "Francia",
			es: "Francia",
		},
		latitude: "46.603354",
		longitude: "1.888334",
		emoji: "🇫🇷",
		emojiU: "U+1F1EB U+1F1F7",
	},
];
