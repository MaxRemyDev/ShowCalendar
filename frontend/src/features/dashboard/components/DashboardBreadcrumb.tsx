import React from "react";
import { usePathname } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface DashboardBreadcrumbProps {
	className?: string;
}

export function DashboardBreadcrumb({ className }: DashboardBreadcrumbProps) {
	const pathname = usePathname();
	const pathSegments = pathname.split("/").filter((segment) => segment);

	const breadcrumbItems = pathSegments.map((segment, index) => {
		const href = "/" + pathSegments.slice(0, index + 1).join("/");
		const isLast = index === pathSegments.length - 1;

		return (
			<React.Fragment key={href}>
				<BreadcrumbItem>
					{isLast ? (
						<BreadcrumbPage>{segment}</BreadcrumbPage>
					) : (
						<BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
					)}
				</BreadcrumbItem>
				{!isLast && <BreadcrumbSeparator />}
			</React.Fragment>
		);
	});

	return (
		<Breadcrumb className={className}>
			<BreadcrumbList className="capitalize">
				<BreadcrumbItem>
					<BreadcrumbLink href="/">Home</BreadcrumbLink>
				</BreadcrumbItem>
				{breadcrumbItems.length > 0 && <BreadcrumbSeparator />}
				{breadcrumbItems}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
