import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const token = request.cookies.get("token");
	const userId = request.cookies.get("userId");
	console.log("Middleware: Token from cookie:", token);
	console.log("Middleware: userId from cookie:", userId);

	const protectedPaths = ["/dashboard"];

	if (!token && protectedPaths.includes(request.nextUrl.pathname)) {
		console.log("Middleware: No token found, redirecting to /login");
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard", "/login", "/signup"],
};
