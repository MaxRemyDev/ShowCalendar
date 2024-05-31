"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function Widget2() {
	const [contacts, setContacts] = useState([
		{ id: 1, name: "Alice" },
		{ id: 2, name: "Bob" },
		{ id: 3, name: "Charlie" },
		{ id: 4, name: "Diana" },
		{ id: 5, name: "Edward" },
	]);

	const newContactsCount = contacts.length;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">New Contacts</CardTitle>
				<Users className="text-background-500" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">+{newContactsCount}</div>
				<p className="text-xs text-muted-foreground">+12% from last month</p>
			</CardContent>
		</Card>
	);
}
