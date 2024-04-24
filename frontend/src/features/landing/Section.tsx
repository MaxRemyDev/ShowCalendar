/*
	INFO: THIS FILE DEFINES 'SECTION' COMPONENT WHICH IS USED IN VARIOUS PARTS OF LANDING PAGE.
	INFO: IT PROVIDES A UNIFORM STRUCTURING OF SECTIONS WITH FLEXIBILITY THROUGH PROPS FOR CLASSES AND IDS,
	INFO: THUS FACILITATING CODE REUSE AND DESIGN UNIFORMITY ACROSS PAGE.
*/

import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export type SectionProps = PropsWithChildren<{
	className?: string;
	sectionClassName?: string;
	id?: string;
}>;

export const Section = (props: SectionProps) => {
	return (
		<section id={props.id} className={cn(props.sectionClassName)}>
			<div
				className={cn(
					"flex flex-col justify-center px-20 py-10 border-solid border-b-[3px] border-neutral-300 max-md:px-5 max-md:py-5",
					props.className
				)}
			>
				{props.children}
			</div>
		</section>
	);
};
