import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ContentsTitleProps {
	title?: string;
	titleSize?: string;
	titleColor?: string;

	description?: string;
	descriptionSize?: string;
	descriptionColor?: string;

	classNameOfTitleDescription?: string;

	className?: string;
	separatorClassName?: string;
	addons?: React.ReactNode;
}

export default function ContentsTitle({
	title,
	titleSize = "text-3xl",
	titleColor = "",

	description,
	descriptionSize = "text-base",
	descriptionColor = "text-foreground-400",

	classNameOfTitleDescription = "space-y-2",

	separatorClassName,
	className,
	addons,
}: ContentsTitleProps) {
	return (
		<div className={cn("flex-col md:flex", className)}>
			<div className="flex items-center justify-between space-y-2">
				<div className={cn(classNameOfTitleDescription)}>
					{title && (
						<h2 className={cn("font-bold tracking-tight", titleSize, titleColor)}>
							{title}
						</h2>
					)}
					{description && (
						<p className={cn(descriptionSize, descriptionColor)}>{description}</p>
					)}
				</div>

				<div className="flex items-center space-x-2">{addons}</div>
			</div>
			<div className="py-5">
				<Separator className={separatorClassName} />
			</div>
		</div>
	);
}

/*

*EXAMPLE OF USE*

	<ContentsTitle
		title="Example Title"
		description="Example description."
		addons={<div>Example Addons</div>}
	/>

*/
