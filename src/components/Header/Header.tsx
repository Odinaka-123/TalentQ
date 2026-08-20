import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NavLink from "./NavLink";
import MobileMenu from "./MobileMenu";

const navItems = [
  { href: "/about", label: "About us" },
  { href: "/features", label: "Features" },
  { href: "/contact", label: "Contact us" },
];

export default function Header() {
  return (
    <header className="w-full flex justify-center pt-4 sm:pt-6 px-4 bg-[#F5F1E9]">
      <div className="w-full max-w-6xl flex items-center justify-between rounded-full border-[1.5] border-[#E8A47E] bg-[#FBF3EA] px-4 sm:px-6 py-2.5 sm:py-3">
        <Link href="/" className="shrink-0">
          <Image
            src="/Icons/logo.png"
            alt="TalentQ"
            width={120}
            height={32}
            priority
            className="h-7 sm:h-8 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-md border border-[#1F3B33] px-4 py-2 text-sm font-medium text-[#1F3B33] hover:bg-[#F1E8DA] transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-1.5 rounded-md bg-[#A8531E] px-4 py-2 text-sm font-medium text-white hover:bg-[#B04A32] transition-colors"
          >
            Join us
            <ArrowRight size={14} />
          </Link>
        </div>

        <MobileMenu navItems={navItems} />
      </div>
    </header>
  );
}