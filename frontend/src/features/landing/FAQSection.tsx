import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "./Section";

const FAQS: { question: string; answer: JSX.Element }[] = [
	{
		question: "What is Show Calendar?",
		answer: (
			<span>
				Show Calendar is an open-source solution for managing your personal and professional
				availabilities in one place. It seamlessly integrates with Google Calendar,
				Microsoft Outlook, and Apple Calendar, making your commitments clear and manageable
				on a single platform.
			</span>
		),
	},
	{
		question: "How can I sign up and start using Show Calendar?",
		answer: (
			<span>
				To start using Show Calendar, you can sign up in just a few clicks. Simply visit our
				website, click on <strong>`Sign Up`</strong>, and follow the instructions to create
				an account. Once registered, you can immediately start integrating your calendars
				and managing your appointments.
			</span>
		),
	},
	{
		question: "Is Show Calendar secure?",
		answer: (
			<span>
				Yes, security is a priority for Show Calendar. We use the latest security
				technologies, including Data Encryption and Authorization Protocol to protect your
				information. Additionally, all communications between your device and our servers
				are secured with SSL/TLS.
			</span>
		),
	},
	{
		question: "Can I use Show Calendar on my phone?",
		answer: (
			<span>
				Absolutely! Show Calendar is designed to work flawlessly on all devices, including
				smartphones and tablets. You can download our mobile app from the Apple App Store or
				Google Play Store to access your calendar wherever you are.
			</span>
		),
	},
	{
		question: "What are the main features of Show Calendar?",
		answer: (
			<span>
				Show Calendar offers numerous features to optimize your time management, including
				dynamic availability display, instant appointment booking, integration of
				communication tools for online meetings, smart reminders, and a Time Blocking
				feature for optimal time management. You also have access to a sophisticated
				dashboard for advanced appointment and notification management.
			</span>
		),
	},
	{
		question: "How does Show Calendar handle different time zones?",
		answer: (
			<span>
				Show Calendar supports time zone management, allowing you to schedule appointments
				with participants in different countries without any confusion. The application
				automatically adjusts times according to the respective time zones of each
				participant to facilitate planning.
			</span>
		),
	},
	{
		question: "Is there support available if I encounter problems?",
		answer: (
			<span>
				Yes, we offer full support to all our users. If you encounter any problems or have
				questions, you can contact us via our contact form on the site, or directly by email
				at
				<strong>
					<em> support@showcalendar.com</em>
				</strong>
				. Our support team is available to ensure that your experience with Show Calendar is
				hassle-free.
			</span>
		),
	},
];

export const FAQSection = () => {
	return (
		<Section className="flex flex-col items-center justify-center">
			<div className="flex-1 max-lg:text-center mb-5">
				<h2 className="text-4xl font-bold hidden sm:block">FREQUENTLY ASKED QUESTION</h2>
				<h2 className="text-4xl font-bold block sm:hidden">FAQ</h2>
			</div>
			<div className="w-full max-w-5xl flex-1 text-left">
				<Accordion
					type="multiple"
					className="border border-background-200 rounded-2xl overflow-hidden shadow-xl"
				>
					{FAQS.map((faq, index) => (
						<AccordionItem
							value={faq.question}
							key={faq.question}
							className="px-4 py-1 border-background-200"
						>
							<AccordionTrigger>
								<span className="text-left font-bold px-4 py-1 text-foreground-800 dark:text-foreground-300">
									{faq.question}
								</span>
							</AccordionTrigger>
							<AccordionContent className="px-4 py-1 pb-5 text-foreground-400">
								{faq.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</Section>
	);
};
