"use client";

import Spinner from "@/components/decoration/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import React, { useRef, useState } from "react";

type EmptyStateProps = {
	icon?: React.ReactNode;
	title: string;
	description?: string;
	badges?: {
		text: string;
		colors: string;
		acceptedFileTypes?: string[];
		tooltip?: string;
	}[];
	actionText?: string;
	onActionClick?: () => void;
	onDropFiles?: (files: FileList) => void;
	isDropFiles?: boolean;
};

const EmptyState: React.FC<EmptyStateProps> = ({
	icon,
	title,
	description,
	badges = [],
	actionText,
	onActionClick,
	onDropFiles,
	isDropFiles = false,
}) => {
	const [loading, setLoading] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const dragCounter = useRef(0);
	const { toast } = useToast();

	const acceptedFileTypes = badges.flatMap((badge) => badge.acceptedFileTypes || []); // GET ALL ACCEPTED FILE TYPES

	// INITIATES ACTION HANDLING WITH LOADING FEEDBACK AND ERROR MANAGEMENT
	const handleActionClick = async () => {
		try {
			if (onActionClick) {
				setLoading(true);
				await onActionClick();
				setLoading(false);
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Something went wrong",
				variant: "destructive",
			});
		}
	};

	// MANAGES DRAG ENTER EVENTS, INCREMENTS DRAG COUNTER
	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (!isDropFiles) return;
		dragCounter.current++;
		setIsDragging(true);
	};

	// MANAGES DRAG LEAVE EVENTS, DECREMENTS DRAG COUNTER, RESETS DRAGGING STATE
	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (!isDropFiles) return;
		dragCounter.current--;

		if (dragCounter.current === 0) {
			setIsDragging(false);
		}
	};

	// ENSURES DRAG OVER EVENT HANDLING FOR DROP FUNCTIONALITY
	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (!isDropFiles) return;
	};

	// PROCESSES FILE DROPS, VALIDATES TYPES, AND PROVIDES USER FEEDBACK
	const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (!isDropFiles) return;
		setIsDragging(false);
		dragCounter.current = 0;

		// TRY TO ADD FILES TO DROP AREA AND HANDLE ERROR
		try {
			if (onDropFiles && e.dataTransfer.files) {
				const files = e.dataTransfer.files;
				const incompatibleFiles = Array.from(files).filter(
					(file) => !acceptedFileTypes.includes(file.type)
				); // GET INCOMPATIBLE FILES WITH BADGE ACCEPTED LIST INFO

				if (incompatibleFiles.length > 0) {
					toast({
						title: "Error",
						description: `File type not supported: ${incompatibleFiles
							.map((file) => file.name)
							.join(", ")}`,
						variant: "destructive",
					});
				} else {
					setLoading(true);
					await onDropFiles(files);
					setLoading(false);

					if (files.length > 0) {
						toast({
							title: "Success",
							description: `File "${files[0].name}" has been added.`,
						});
					}
				}
			}
		} catch (error) {
			setLoading(false);

			toast({
				title: "Error",
				description: "An error occurred while adding the file.",
				variant: "destructive",
			});
		}
	};

	// IF LOADING STATE IS TRUE, RENDER LOADING STATE AND SHOW SPINNER
	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[70vh]">
				<Spinner />
			</div>
		);
	}

	return (
		<div
			className={cn(
				"relative flex flex-col items-center justify-center min-h-[70vh] p-8 border-4 border-background-200 border-dashed rounded-xl bg-background-100 dark:bg-background-50",
				isDragging ? "border-primary" : "border-background-200"
			)}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			{/* ICON, TITLE & DESCRIPTION SECTION*/}
			<div
				className="mb-4"
				style={{
					filter: "drop-shadow(0 0 1rem rgba(0, 0, 0, 0.5)",
				}}
			>
				{icon}
			</div>
			<h2 className="mb-2 text-3xl font-semibold">{title}</h2>
			<p className="mb-4 text-foreground-400">{description}</p>

			{/* BADGE SECTION */}
			{badges.length > 0 && (
				<TooltipProvider delayDuration={1}>
					<div className="flex flex-wrap justify-center gap-2 mb-4">
						{badges.map((badge, index) => (
							<Tooltip key={`${badge.text}-${index}`}>
								<TooltipTrigger>
									<Badge className={cn(badge.colors)}>{badge.text}</Badge>
								</TooltipTrigger>
								{badge.tooltip && <TooltipContent>{badge.tooltip}</TooltipContent>}
							</Tooltip>
						))}
					</div>
				</TooltipProvider>
			)}

			{/* ACTION SECTION */}
			{actionText && (
				<Button onClick={handleActionClick} disabled={loading} shadow="primary">
					<Plus className="mr-2" />
					{actionText}
				</Button>
			)}

			{/* DRAG AND DROP SECTION */}
			<AnimatePresence>
				{isDragging && isDropFiles && (
					<motion.div
						className="absolute inset-0 flex items-center justify-center bg-background-100 dark:bg-background-50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						//TODO: ADD MORE ANIMATE
					>
						<p className="font-semibold text-lg">Drop files here...</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default EmptyState;
