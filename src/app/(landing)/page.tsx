import CtaBanner from "./components/CtaBanner";
import FreelancerTiers from "./components/FreelancerTiers";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import HowItWorks from "./components/HowItWorks";
import TalentBanner from "./components/TalentBanner";
import Testimonials from "./components/Testimonials";
import TrustSafety from "./components/TrustSafety";

export default function LandingPage() {
  return (
    <div className="bg-[#F5F1E9] min-h-screen">
      <Hero />
      <Highlights />
      <HowItWorks />
      <TrustSafety />
      <CtaBanner />
      <FreelancerTiers />
      <TalentBanner />
      <Testimonials />
    </div>
  );
}
