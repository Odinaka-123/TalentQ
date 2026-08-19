import { Search, BadgeCheck, Sparkle, Shield, Wallet } from "lucide-react";

const highlights = [
  { icon: Search, label: "Discover Verified\nAfrican Talent" },
  { icon: BadgeCheck, label: "AI That Matches the\nRight Talent" },
  { icon: Sparkle, label: "Hire with\nConfidence" },
  { icon: Shield, label: "Hire with\nConfidence" },
  { icon: Wallet, label: "Hire with\nConfidence" },
];

export default function Highlights() {
  return (
    <section className="w-full flex justify-center px-4 -mt-10 sm:-mt-12">
      <div className="w-full max-w-5xl rounded-4xl border border-[#E8A47E] bg-white shadow-[0px_4px_10px_3px_#DE814A1A] px-6 sm:px-10 py-8 sm:py-10 flex flex-wrap justify-between gap-8">
        {highlights.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center flex-1 min-w-30"
          >
            <item.icon size={28} className="text-[#1B3A2F] mb-3" />
            <p className="text-sm font-medium text-[#1F2A22] whitespace-pre-line">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
