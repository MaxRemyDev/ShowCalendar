import Link from "next/link";
import Image from "next/image";
import { faGithub, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { SelectScrollingLanguages } from "@/components/ui/SelectScrollingLanguages";
import { Section } from "./Section";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const linkGroups = [
	{
		title: "Product",
		links: [
			{ name: "Link 1", href: "/link1" },
			{ name: "Link 2", href: "/link2" },
			{ name: "Link 3", href: "/link3" },
			{ name: "Link 4", href: "/link4" },
		],
	},

	{
		title: "Resources",
		links: [
			{ name: "Link 1", href: "/link1" },
			{ name: "Link 2", href: "/link2" },
			{ name: "Link 3", href: "/link3" },
			{ name: "Link 4", href: "/link4" },
		],
	},

	{
		title: "Company",
		links: [
			{ name: "Link 1", href: "/link1" },
			{ name: "Link 2", href: "/link2" },
			{ name: "Link 3", href: "/link3" },
			{ name: "Link 4", href: "/link4" },
		],
	},
];

export const LandingFooter = () => {
	const currentYear = new Date().getFullYear();

	return (
		<Section className="border-none">
			<footer>
				<div className="container mx-auto px-4">
					<div className="flex flex-col lg:flex-row justify-between items-center">
						{/* INFORMATION GROUP */}
						<div className="flex flex-col items-center lg:items-start mb-6 lg:mb-0">
							<div className="flex flex-row items-center gap-x-4 my-6">
								{/* LOGO */}
								<Link href="/" legacyBehavior>
									<a>
										<Image
											src="/ShowCalendarLogo.png"
											width={30}
											height={30}
											alt="ShowCalendar logo"
										/>
									</a>
								</Link>

								{/* COPYRIGHT */}
								<Link href="https://maxremy.dev/" legacyBehavior>
									<a className="text-gray-400 hover:text-gray-600">
										<div className="font-medium text-center lg:text-left">
											©{currentYear} MAX REMY DEV
											<br />
											ALL RIGHTS RESERVED
										</div>
									</a>
								</Link>
							</div>

							<div className="flex flex-row lg:flex-col justify-between my-6 py-6 md:py-1">
								{/* SERVICE STATUS */}
								<div className="flex flex-col lg:flex-row justify-between mr-6">
									<Link href="/" legacyBehavior>
										<a className="flex items-center">
											<Image
												src="assets/icons/Available.svg"
												alt="Available Item"
												width={20}
												height={20}
											/>
											<p className="text-sm text-green-500 hover:text-green-700 ml-2">
												All systems normal.
											</p>
										</a>
									</Link>
								</div>

								{/* SOCIAL LINKS */}
								<div className="flex lg:mt-12">
									<Link
										href="https://github.com/MaxRemyDev/ShowCalendar"
										legacyBehavior
									>
										<a className="text-gray-400 hover:text-gray-600">
											<FontAwesomeIcon icon={faGithub} className="size-5" />
										</a>
									</Link>
									<Link href="https://twitter.com/showcalendar" legacyBehavior>
										<a className="text-gray-400 hover:text-gray-600 mx-4">
											<FontAwesomeIcon icon={faXTwitter} className="size-5" />
										</a>
									</Link>
								</div>
							</div>
						</div>

						{/* LINKS */}
						<div className="flex-grow">
							<div className="flex justify-evenly space-x-8">
								{linkGroups.map((group, index) => (
									<div key={`${group.title}-${index}`}>
										<h2 className="mb-2 font-bold tracking-widest text-gray-600">
											{group.title}
										</h2>
										<ul className="space-y-2 text-sm list-none">
											{group.links.map((link, linkIndex) => (
												<li key={`${link.name}-${linkIndex}`}>
													<Link href={link.href} legacyBehavior>
														<a className="text-gray-400 hover:text-gray-600">
															{link.name}
														</a>
													</Link>
												</li>
											))}
										</ul>
									</div>
								))}
							</div>
						</div>

						{/* LANGUAGE SELECTOR */}
						<div className="w-full lg:w-auto lg:mt-0 mt-5">
							<SelectScrollingLanguages />
						</div>
					</div>
				</div>
			</footer>
		</Section>
	);
};
