import { Folder } from "lucide-react";
import Link from "next/link";

type GuideCardProps = {
  title: string;
  description: string;
  href: string;
};

export default function GuideCard({
  title,
  description,
  href,
}: GuideCardProps) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-[#E5E0D6] bg-white px-5 py-4 hover:border-[#DE814A] transition-colors"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F7DFEF] mb-3">
        <Folder size={16} className="text-[#C755A0]" />
      </div>
      <p className="text-sm font-semibold text-[#1F2A22] mb-1">{title}</p>
      <p className="text-xs text-[#8A8A7E]">{description}</p>
    </Link>
  );
}
