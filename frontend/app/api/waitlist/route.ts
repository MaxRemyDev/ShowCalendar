import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { format } from "date-fns";

// HANDLE POST REQUESTS
export async function POST(request: {
	json: () => PromiseLike<{ email: string }> | { email: string };
}) {
	const { email } = await request.json(); // EXTRACT EMAIL FROM REQUEST BODY

	// CHECK IF EMAIL IS PROVIDED
	if (!email) {
		return NextResponse.json({ message: "Email is required" }, { status: 400 }); // RETURN STATUS 400 IF EMAIL IS MISSING
	}

	const filePath = path.resolve("./app/api/waitlist/recovery-email.json");
	let currentData = []; // INITIALIZE EMPTY ARRAY

	// READ FILE CONTENT IF EXISTS
	try {
		const fileContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : "[]";

		if (fileContent.trim() === "") {
			currentData = [];
		} else {
			currentData = JSON.parse(fileContent);
		}
	} catch (error) {
		console.error("Error reading or parsing file:", error);
		return NextResponse.json({ message: "Error processing request" }, { status: 500 });
	}

	const formattedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss"); // FORMAT DATE
	currentData.push({ email, date: formattedDate }); // ADD NEW EMAIL ENTRY

	// WRITE UPDATED DATA BACK TO FILE
	try {
		fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));
	} catch (error) {
		console.error("Error writing to file:", error);
		return NextResponse.json({ message: "Error processing request" }, { status: 500 });
	}

	// RETURN STATUS 200 INDICATING SUCCESSFUL ADDITION OF EMAIL
	return NextResponse.json({ message: "Email added to waitlist" }, { status: 200 });
}
