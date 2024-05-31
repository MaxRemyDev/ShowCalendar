"use client";

import { useEffect } from "react";

export default function DashboardError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// LOG ERROR TO AN ERROR REPORTING SERVICE
		console.error(error);
	}, [error]);

	return (
		<div>
			<h2>Something went wrong with Dashboard!</h2>
			<button
				onClick={
					// ATTEMPT TO RECOVER BY TRYING TO RE-RENDER SEGMENT
					() => reset()
				}
			>
				Try again
			</button>
		</div>
	);
}
