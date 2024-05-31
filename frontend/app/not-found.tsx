import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-black text-white">
			<div className="text-center">
				<div className="flex items-center justify-center text-lg font-bold mb-4">
					<Image
						src="/ShowCalendarLogo.png"
						width={0}
						height={0}
						alt="ShowCalendar logo"
						style={{ width: "auto", height: "auto" }}
						className="dark:filter dark:invert"
					/>
					<div className="text-xl font-bold">/ ShowCalendar</div>
				</div>
				<h1 className="text-6xl font-bold">404</h1>
				<p className="mt-2 text-lg">This page could not be found.</p>
				<Link href="/">
					<Button variant="link" className="mt-4 text-white">
						Return Home
					</Button>
				</Link>
			</div>
		</div>
	);
}
