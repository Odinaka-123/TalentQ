import AboutHero from "./components/AboutHero";
import AboutContent from "./components/AboutContent";
import MissionVisionValues from "./components/MissionVisionValues";
import AboutCta from "./components/AboutCta";

export default function AboutPage() {
  return (
    <div className="bg-[#F5F1E9] min-h-screen">
      <AboutHero />
      <AboutContent />
      <MissionVisionValues />
      <AboutCta />
    </div>
  );
}
