import { NextRequest, NextResponse } from "next/server";
import BackendApiClient from "../../backendApiClient";

export async function GET(req: NextRequest) {
	try {
		const response = await BackendApiClient.get("/api/test/notfound");

		return NextResponse.json({ message: response.data }, { status: response.status });
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.response || error.message },
			{ status: error.status || 500 }
		);
	}
}
