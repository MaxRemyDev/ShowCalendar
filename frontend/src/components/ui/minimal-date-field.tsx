import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { FieldError, fieldGroupVariants, Label } from "./field";
import {
	DateField as AriaDateField,
	DateFieldProps as AriaDateFieldProps,
	DateInput as AriaDateInput,
	DateInputProps as AriaDateInputProps,
	DateSegment as AriaDateSegment,
	DateSegmentProps as AriaDateSegmentProps,
	DateValue as AriaDateValue,
	TimeField as AriaTimeField,
	TimeFieldProps as AriaTimeFieldProps,
	TimeValue as AriaTimeValue,
	ValidationResult as AriaValidationResult,
	composeRenderProps,
	Text,
} from "react-aria-components";

const DateField = AriaDateField;
const TimeField = AriaTimeField;

function DateSegment({ className, ...props }: AriaDateSegmentProps) {
	return (
		<AriaDateSegment
			className={composeRenderProps(className, (className) =>
				cn(
					"inline rounded p-0.5 caret-transparent outline outline-0",
					"data-[placeholder]:text-muted-foreground",
					"data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
					"data-[focused]:bg-background-200 data-[focused]:text-accent-foreground",
					"data-[invalid]:data-[focused]:bg-destructive data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive",
					className
				)
			)}
			{...props}
		/>
	);
}

interface CustomDateInputProps extends AriaDateInputProps, VariantProps<typeof fieldGroupVariants> {
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	children: (segment: any) => React.ReactElement;
}

function DateInput({ className, variant, children, ...props }: CustomDateInputProps) {
	return (
		<AriaDateInput
			className={composeRenderProps(className, (className) =>
				cn(fieldGroupVariants({ variant }), "text-sm", className)
			)}
			{...props}
		>
			{children}
		</AriaDateInput>
	);
}

interface MinimalDateFieldProps<T extends AriaDateValue> extends AriaDateFieldProps<T> {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: AriaValidationResult) => string);
}

function MinimalDateField<T extends AriaDateValue>({
	label,
	description,
	className,
	errorMessage,
	...props
}: MinimalDateFieldProps<T>) {
	return (
		<DateField
			className={composeRenderProps(className, (className) =>
				cn("group flex flex-col gap-2", className)
			)}
			{...props}
		>
			<Label>{label}</Label>
			<DateInput value="" onChange={() => {}}>
				{(segment) => <DateSegment segment={segment} />}
			</DateInput>
			{description && (
				<Text className="text-sm text-muted-foreground" slot="description">
					{description}
				</Text>
			)}
			<FieldError>{errorMessage}</FieldError>
		</DateField>
	);
}

interface MinimalTimeFieldProps<T extends AriaTimeValue> extends AriaTimeFieldProps<T> {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: AriaValidationResult) => string);
}

function MinimalTimeField<T extends AriaTimeValue>({
	label,
	description,
	errorMessage,
	className,
	...props
}: MinimalTimeFieldProps<T>) {
	return (
		<TimeField
			className={composeRenderProps(className, (className) =>
				cn("group flex flex-col gap-2", className)
			)}
			{...props}
		>
			<Label>{label}</Label>
			<DateInput value="" onChange={() => {}}>
				{(segment) => <DateSegment segment={segment} />}
			</DateInput>
			{description && <Text slot="description">{description}</Text>}
			<FieldError>{errorMessage}</FieldError>
		</TimeField>
	);
}

export { DateField, DateSegment, DateInput, TimeField, MinimalDateField, MinimalTimeField };
export type { CustomDateInputProps, MinimalDateFieldProps, MinimalTimeFieldProps };
