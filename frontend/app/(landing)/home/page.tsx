import { AppDownloadSection } from "@/features/landing/AppDownloadSection";
import { BenefitsSection } from "@/features/landing/BenefitsSection";
import { CompatibleToolsSection } from "@/features/landing/CompatibleToolsSection";
import { FAQSection } from "@/features/landing/FAQSection";
import { FeaturesSection } from "@/features/landing/FeaturesSection";
import { HeroSection } from "@/features/landing/HeroSection";
import { LandingFooter } from "@/features/landing/LandingFooter";
import { LandingHeader } from "@/features/landing/LandingHeader";
import { PricingSection } from "@/features/landing/PricingSection";

export default function Home() {
	return (
		<div className="flex flex-col gap-4">
			<div className="h-16" />
			<LandingHeader />
			<HeroSection />
			<FeaturesSection />
			<CompatibleToolsSection />
			<BenefitsSection />
			<AppDownloadSection />
			<PricingSection />
			<FAQSection />
			<LandingFooter />
		</div>
	);
}
