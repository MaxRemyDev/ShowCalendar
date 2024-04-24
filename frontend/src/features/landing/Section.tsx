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
