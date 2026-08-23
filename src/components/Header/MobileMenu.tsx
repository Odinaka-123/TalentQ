"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import NavLink from "./NavLink";

type NavItem = { href: string; label: string };

export default function MobileMenu({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex items-center justify-center w-9 h-9 rounded-full border border-[#D9CFC0] text-[#1F2A22]"
      >
        <Menu size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-[#F5F1E9] flex flex-col px-6 py-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#1F2A22]">Menu</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-[#D9CFC0] text-[#1F2A22]"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex flex-col gap-6 mt-10">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex flex-col gap-3 mt-auto">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="w-full text-center rounded-full border border-[#D9CFC0] px-4 py-2.5 text-sm font-medium text-[#1F2A22]"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 rounded-full bg-[#C6543A] px-4 py-2.5 text-sm font-medium text-white"
            >
              Join us
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
