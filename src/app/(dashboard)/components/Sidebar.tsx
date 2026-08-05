"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  User,
  BarChart2,
  CreditCard,
  ShieldCheck,
  Settings,
  HelpCircle,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/find-jobs", label: "Find Jobs", icon: Search },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/verification", label: "Verification", icon: ShieldCheck },
];

const bottomNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help-support", label: "Help & Support", icon: HelpCircle },
];

interface SidebarProps {
  /** Whether the mobile drawer is open. Ignored on md+ (sidebar is always visible there). */
  isOpen: boolean;
  onClose: () => void;
}

interface NavLinksProps {
  pathname: string;
  onNavigate: () => void;
}

/**
 * Hoisted outside Sidebar so it isn't recreated on every render
 * (react-hooks/static-components — components must be declared at module scope).
 */
function TopNav({ pathname, onNavigate }: NavLinksProps) {
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              isActive ?
                "bg-[#8CABA1] text-white"
              : "text-[#8CABA1] hover:bg-[#1B3A2F] hover:text-white"
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function BottomNav({ pathname, onNavigate }: NavLinksProps) {
  return (
    <div>
      <div className="border-t border-white mb-4" />
      <nav className="flex flex-col gap-1 mb-6">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          const isHelp = item.href === "/help-support";
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive ?
                  "bg-[#C6543A] text-white"
                : "text-[#8CABA1] hover:bg-[#1B3A2F] hover:text-white"
              }`}
            >
              <item.icon
                size={18}
                className={isHelp && !isActive ? "text-[#C6543A]" : ""}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/profile"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[#1B3A2F] transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-[#3E5C50] overflow-hidden shrink-0">
          <Image
            src="/Images/testimonials/felicia.png"
            alt="Henrieta Ebiuwa"
            width={36}
            height={36}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">
            Henrieta Ebiuwa
          </p>
          <p className="text-xs text-[#8CABA1]">Freelancer</p>
        </div>
      </Link>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar — static, always visible md+ */}
      <aside className="hidden md:flex flex-col justify-between w-60 shrink-0 h-screen sticky top-0 bg-[#0F2A20] px-4 py-6">
        <div>
          <Link href="/dashboard" className="flex items-center gap-2 px-2 mb-8">
            <Image
              src="/Icons/logo-light.png"
              alt="TalentQ"
              width={180}
              height={48}
              className="h-12 w-auto"
            />
          </Link>
          <TopNav pathname={pathname} onNavigate={onClose} />
        </div>

        <BottomNav pathname={pathname} onNavigate={onClose} />
      </aside>

      {/* Mobile overlay — dims the page behind the drawer, click to close */}
      <div
        aria-hidden={!isOpen}
        onClick={onClose}
        className={`md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          isOpen ?
            "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile drawer — slides in from the left, full-height, closes on link tap / overlay tap / X */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] flex flex-col justify-between bg-[#0F2A20] px-4 py-6 transform transition-transform duration-200 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between px-2 mb-8">
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <Image
                src="/Icons/logo.png"
                alt="TalentQ"
                width={180}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="text-[#8CABA1] hover:text-white p-1 -mr-1"
            >
              <X size={22} />
            </button>
          </div>
          <TopNav pathname={pathname} onNavigate={onClose} />
        </div>

        <BottomNav pathname={pathname} onNavigate={onClose} />
      </aside>
    </>
  );
}
