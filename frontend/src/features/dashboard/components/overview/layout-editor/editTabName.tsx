import React, { useState, useEffect } from "react";
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
import { Edit } from "lucide-react";
import { showEditTabError, showEditTabSuccess } from "./utils/toastMessages";

interface EditTabNameProps {
	tabValue: string | null;
	currentName: string;
	onEdit: (tabValue: string, newName: string) => void;
}

const EditTabName: React.FC<EditTabNameProps> = ({ tabValue, currentName, onEdit }) => {
	const [name, setName] = useState(currentName);

	useEffect(() => {
		setName(currentName);
	}, [currentName]);

	const handleEdit = () => {
		try {
			if (name.trim() && tabValue) {
				onEdit(tabValue, name.trim());
				setName("");
			}
			showEditTabSuccess();
		} catch (error) {
			showEditTabError();
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon" className="h-11" disabled={!tabValue}>
					<Edit />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Tab Name</DialogTitle>
					<DialogDescription>Enter the new name for the tab below.</DialogDescription>
				</DialogHeader>
				<Input
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Tab name"
				/>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button onClick={handleEdit} disabled={!name.trim() || !tabValue}>
							Save
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EditTabName;
