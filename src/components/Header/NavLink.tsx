"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-sm transition-colors ${
        isActive ?
          "text-[#DE814A] font-medium"
        : "text-[#DE814A] hover:text-[#C6543A]"
      }`}
    >
      {children}
    </Link>
  );
}
