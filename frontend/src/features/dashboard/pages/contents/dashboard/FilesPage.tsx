"use client";

import ContentsTitle from "@/features/dashboard/components/ContentsTitle";
import EmptyState from "@/features/dashboard/components/EmptyState";
import { Folder } from "lucide-react";
import { useState } from "react";

const FilesPage: React.FC = () => {
	const [loading, setLoading] = useState(false);

	// FAKE WAIT LOADING ACTION FUNCTION
	const handleActionClick = async () => {
		setLoading(true);

		try {
			console.log("Add file with button action");
			await new Promise((resolve) => setTimeout(resolve, 2000));
		} catch (error) {
			setLoading(false);
		}
	};

	const handleDropFiles = async () => {
		setLoading(true);

		try {
			console.log("Add file with drop files");
			await new Promise((resolve) => setTimeout(resolve, 2000));
		} catch (error) {
			setLoading(false);
		}
	};

	return (
		<div>
			<ContentsTitle title="Files" description="Manage your files and folders here." />
			<EmptyState
				icon={<Folder className="size-24" />}
				title="No files Available"
				description="You currently have no files in this section."
				actionText="Add file"
				onActionClick={handleActionClick}
				isDropFiles={true}
				onDropFiles={handleDropFiles}
				badges={[
					{
						text: "PDF",
						colors: "bg-blue-200 text-blue-800",
						acceptedFileTypes: ["application/pdf"],
						tooltip: "Only PDF files are allowed",
					},
					{
						text: "PNG",
						colors: "bg-red-200 text-red-800",
						acceptedFileTypes: ["image/png"],
						tooltip: "Only PNG files are allowed",
					},
				]}
			/>
		</div>
	);
};

export default FilesPage;
