import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "./utils/UserContext";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
	DropdownMenuGroup,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
	User,
	CreditCard,
	Settings,
	Users,
	UserPlus,
	Mail,
	MessageSquare,
	PlusCircle,
	Plus,
	Cloud,
	LogOut,
	MessageCircleQuestion,
	Loader,
} from "lucide-react";

const fakeUserData = {
	name: "Name",
	email: "name@example.com",
	avatarUrl: "",
};

export default function DashboardDropMenuAccount() {
	const { user } = useUser();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{user ? (
					<Button variant="secondary" size="icon" className="rounded-full">
						<Avatar>
							<AvatarImage
								src={fakeUserData.avatarUrl}
								alt={`@${fakeUserData.name}`}
							/>
							<AvatarFallback>
								{user.username ? user.username.slice(0, 2).toUpperCase() : <User />}
							</AvatarFallback>
						</Avatar>
						<span className="sr-only">Toggle user menu</span>
					</Button>
				) : (
					<Loader className="mr-2 h-4 w-4 animate-spin" />
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56 p-4 rounded-xl">
				{user ? (
					<>
						<DropdownMenuLabel className="flex flex-col">
							<span>{user.username}</span>
							<span className="font-light">{user.email}</span>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuLabel>Account Management</DropdownMenuLabel>
							<Link href="/dashboard/account" passHref>
								<DropdownMenuItem>
									<User className="mr-2 h-4 w-4" />
									<span>Account</span>
								</DropdownMenuItem>
							</Link>
							<Link href="/dashboard/billing" passHref>
								<DropdownMenuItem>
									<CreditCard className="mr-2 h-4 w-4" />
									<span>Billing</span>
								</DropdownMenuItem>
							</Link>
							<Link href="/dashboard/settings" passHref>
								<DropdownMenuItem>
									<Settings className="mr-2 h-4 w-4" />
									<span>Settings</span>
								</DropdownMenuItem>
							</Link>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuLabel>Invitations</DropdownMenuLabel>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>
									<UserPlus className="mr-2 h-4 w-4" />
									<span>Invite users</span>
								</DropdownMenuSubTrigger>
								<DropdownMenuPortal>
									<DropdownMenuSubContent>
										<Link href="/dashboard/invite-email" passHref>
											<DropdownMenuItem>
												<Mail className="mr-2 h-4 w-4" />
												<span>Email</span>
											</DropdownMenuItem>
										</Link>
										<Link href="/dashboard/invite-message" passHref>
											<DropdownMenuItem>
												<MessageSquare className="mr-2 h-4 w-4" />
												<span>Message</span>
											</DropdownMenuItem>
										</Link>
										<DropdownMenuSeparator />
										<Link href="/dashboard/invite-more" passHref>
											<DropdownMenuItem>
												<PlusCircle className="mr-2 h-4 w-4" />
												<span>More...</span>
											</DropdownMenuItem>
										</Link>
									</DropdownMenuSubContent>
								</DropdownMenuPortal>
							</DropdownMenuSub>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuLabel>Team Management</DropdownMenuLabel>
							<DropdownMenuItem disabled>
								<Users className="mr-2 h-4 w-4" />
								<span>Team</span>
							</DropdownMenuItem>
							<DropdownMenuItem disabled>
								<Plus className="mr-2 h-4 w-4" />
								<span>New Team</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem disabled>
							<Cloud className="mr-2 h-4 w-4" />
							<span>API</span>
						</DropdownMenuItem>
						<Link href="/dashboard/support" passHref>
							<DropdownMenuItem>
								<MessageCircleQuestion className="mr-2 h-4 w-4" />
								<span>Support</span>
							</DropdownMenuItem>
						</Link>
						<DropdownMenuSeparator />
						<Link href="/logout" passHref>
							<DropdownMenuItem>
								<LogOut className="mr-2 h-4 w-4" />
								<span>Log out</span>
							</DropdownMenuItem>
						</Link>
						<DropdownMenuSeparator />
						<div className="text-center pt-3">
							<Button className="w-full" size="sm" asChild>
								<Link href="/dashboard/upgrade" passHref>
									Upgrade to Premium
								</Link>
							</Button>
						</div>
					</>
				) : (
					<DropdownMenuLabel>
						<Loader className="mr-2 h-4 w-4 animate-spin" />
					</DropdownMenuLabel>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
