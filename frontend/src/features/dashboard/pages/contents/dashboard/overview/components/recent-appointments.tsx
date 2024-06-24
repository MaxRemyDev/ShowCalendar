import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { recentAppointments } from "./data/recent-data";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RecentAppointments() {
	return (
		<ScrollArea className="h-[350px] w-full">
			<div className="space-y-8">
				{recentAppointments.map((appointment) => (
					<Link
						href={`/appointments/${appointment.id}`}
						key={appointment.id}
						className={cn(
							"flex items-center cursor-pointer hover:bg-background-200 p-2 rounded-md"
						)}
					>
						<Avatar className="h-9 w-9">
							<AvatarImage src={appointment.avatarImage} alt={appointment.name} />
							<AvatarFallback>{appointment.avatarFallback}</AvatarFallback>
						</Avatar>
						<div className="ml-4 space-y-1">
							<p className="text-sm font-medium leading-none">{appointment.name}</p>
							<p className="text-sm text-muted-foreground">{appointment.email}</p>
						</div>
						<div className="ml-auto font-medium">
							{recentAppointments.indexOf(appointment) < 2
								? formatDistanceToNow(appointment.time, { addSuffix: true })
								: format(appointment.time, "PPPpp")}
						</div>
					</Link>
				))}
			</div>
		</ScrollArea>
	);
}
