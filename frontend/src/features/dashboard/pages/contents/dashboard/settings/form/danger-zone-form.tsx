"use client";

import React from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DangerZoneForm() {
	function handleDeleteAccount() {
		// Logic to handle account deletion
		toast({
			title: "Account Deletion Requested",
			variant: "success",
			persistent: true,
		});
	}

	function handleCookiePreferences() {
		// Logic to handle cookie preferences
		toast({
			title: "Cookie Preferences",
			variant: "success",
			persistent: true,
		});
	}

	return (
		<div className="space-y-8">
			<Separator />
			<div className="col-span-1 md:col-span-2 flex max-md:flex-col max-md:items-start justify-between items-center p-5 border-2 border-solid rounded-xl border-error-200 dark:border-error-600 bg-background-50">
				<Card className="w-full border-none bg-transparent shadow-none">
					<CardHeader>
						<CardTitle className="text-error-600">DANGER ZONE</CardTitle>
					</CardHeader>
					<CardContent>
						<Separator className="mb-4" />
						<CardDescription className="text-lg text-foreground font-semibold mb-2">
							Delete user account
						</CardDescription>
						<p className="text-sm text-foreground-400 mb-4">
							By deleting your account you will lose all your data and access to any
							workspaces that you are associated with.
						</p>
						<Button onClick={handleDeleteAccount} className="mb-6">
							Request account deletion
						</Button>
					</CardContent>
					<CardContent>
						<Separator className="mb-4" />
						<CardDescription className="text-lg text-foreground font-semibold mb-2">
							Cookie preferences
						</CardDescription>
						<p className="text-sm text-foreground-400 mb-4">
							By default, we use cookies to improve your experience. You can change
							your cookie preferences at any time.
						</p>
						<Button variant="outline" onClick={handleCookiePreferences}>
							Manage cookie preferences
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
