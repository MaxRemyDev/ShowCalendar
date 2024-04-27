import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "./Section";

const FAQS: { question: string; answer: string }[] = [
	{
		question: "Loren ipsum dolor amet sit ?",
		answer: "Loren ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nunc. Loren ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nunc.",
	},
	{
		question: "Loren ipsum dolor sit amet?",
		answer: "Loren ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nunc.",
	},
	{
		question: "Loren ipsum sit amet dolor?",
		answer: "Loren ipsum dolor sit amet, consectetur adipiscing Loren ipsum dolor sit amet, consectetur adipiscing elit. Nullam Loren ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies, nunc nunc.auctor, nunc nec ultricies ultricies, nunc nunc.elit. Nullam auctor, nunc nec ultricies ultricies, nunc nunc.",
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
					className="border border-neutral-400 rounded-2xl overflow-hidden shadow-xl"
				>
					{FAQS.map((faq, index) => (
						<AccordionItem
							value={faq.question}
							key={faq.question}
							className="px-4 py-1"
						>
							<AccordionTrigger>
								<span className="text-left font-bold px-4 py-1">
									{faq.question}
								</span>
							</AccordionTrigger>
							<AccordionContent className="px-4 py-1">{faq.answer}</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</Section>
	);
};
