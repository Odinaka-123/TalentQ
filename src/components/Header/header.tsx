import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NavLink from "./NavLink";

const navItems = [
  { href: "/about", label: "About us" },
  { href: "/features", label: "Features" },
  { href: "/contact", label: "Contact us" },
];

export default function Header() {
  return (
    <header className="w-full flex justify-center pt-6 px-4 bg-[#F5F1E9]">
      <div className="w-full max-w-6xl flex items-center justify-between rounded-full border-[1.5] border-[#DE814A] bg-[#FBF3EA] px-6 py-3">
        <Link href="/">
          <Image
            src="/Icons/logo.png"
            alt="TalentQ"
            width={120}
            height={32}
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="rounded-md border border-[#1F3B33] px-4 py-2 text-sm font-medium text-[#1F3B33] hover:bg-[#F1E8DA] transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/join"
            className="flex items-center gap-1.5 rounded-md bg-[#A8531E] px-4 py-2 text-sm font-medium text-white hover:bg-[#B04A32] transition-colors"
          >
            Join us
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}
