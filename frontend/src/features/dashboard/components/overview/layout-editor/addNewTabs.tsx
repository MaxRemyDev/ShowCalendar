import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { CopyPlus } from "lucide-react";
import { showAddNewTabError, showAddNewTabSuccess } from "./utils/toastMessages";

const addNewTabSchema = z.object({
	name: z
		.string()
		.min(1, "Tab name is required")
		.max(10, "Tab name must not be longer than 10 characters"),
});

type AddNewTabFormValues = z.infer<typeof addNewTabSchema>;

interface AddNewTabsProps {
	onAdd: (name: string) => void;
	disabled: boolean;
}

const AddNewTabs: React.FC<AddNewTabsProps> = ({ onAdd, disabled }) => {
	const form = useForm<AddNewTabFormValues>({
		resolver: zodResolver(addNewTabSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
		},
	});

	const handleAdd = (data: AddNewTabFormValues) => {
		try {
			onAdd(data.name.trim());
			form.reset();
			showAddNewTabSuccess();
		} catch (error) {
			showAddNewTabError();
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon" className="h-11" disabled={disabled}>
					<CopyPlus />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Tab</DialogTitle>
					<DialogDescription>Enter the name of the new tab below.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleAdd)} className="space-y-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tab Name</FormLabel>
									<FormControl>
										<Input placeholder="Tab name" {...field} />
									</FormControl>
									<FormDescription>
										The name of the new tab. Maximum 10 characters.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>
							<DialogClose asChild>
								<Button
									type="submit"
									disabled={disabled || !form.formState.isValid}
								>
									Add
								</Button>
							</DialogClose>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default AddNewTabs;
