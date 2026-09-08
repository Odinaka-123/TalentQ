"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Search,
  Users,
  Mail,
  BarChart2,
  CreditCard,
  ShieldCheck,
  Settings,
  HelpCircle,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Avatar from "@/components/Avatar";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavLinksProps {
  pathname: string;
  onNavigate: () => void;
}

const NAV_SCROLL_CLASSES =
  "flex-1 min-h-0 overflow-y-auto -mx-1 px-1 " +
  "[scrollbar-width:thin] [scrollbar-color:#1B3A2F_transparent] " +
  "[&::-webkit-scrollbar]:w-1.5 " +
  "[&::-webkit-scrollbar-track]:bg-transparent " +
  "[&::-webkit-scrollbar-thumb]:bg-[#1B3A2F] " +
  "[&::-webkit-scrollbar-thumb]:rounded-full";

function TopNav({ pathname, onNavigate }: NavLinksProps) {
  const { t } = useLanguage();

  const navItems = [
    { href: "/employer/dashboard", label: t("app_employer_components_sidebar.dashboard"), icon: LayoutDashboard },
    { href: "/employer/post-job", label: t("app_employer_components_sidebar.post_a_job"), icon: Briefcase },
    { href: "/employer/find-talent", label: t("app_employer_components_sidebar.find_talent"), icon: Search },
    { href: "/employer/candidates", label: t("app_employer_components_sidebar.candidates"), icon: Users },
    { href: "/employer/messages", label: t("app_employer_components_sidebar.messages"), icon: Mail },
    { href: "/employer/analytics", label: t("app_employer_components_sidebar.analytics"), icon: BarChart2 },
    { href: "/employer/payments", label: t("app_employer_components_sidebar.payments"), icon: CreditCard },
    { href: "/employer/verification", label: t("app_employer_components_sidebar.verification"), icon: ShieldCheck },
  ];

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

function BottomNav({
  pathname,
  onNavigate,
  name,
  avatarUrl,
}: NavLinksProps & { name: string; avatarUrl: string | null }) {
  const { t } = useLanguage();

  const bottomNavItems = [
    { href: "/employer/settings", label: t("app_employer_components_sidebar.settings"), icon: Settings },
    { href: "/employer/help-support", label: t("app_employer_components_sidebar.help_support"), icon: HelpCircle },
  ];

  return (
    <div>
      <div className="border-t border-white mb-4" />
      <nav className="flex flex-col gap-1 mb-6">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          const isHelp = item.href === "/employer/help-support";
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
        href="/employer/profile"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[#1B3A2F] transition-colors"
      >
        <Avatar src={avatarUrl} name={name} size={36} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{name}</p>
          <p className="text-xs text-[#DE814A]">{t("app_employer_components_sidebar.employer")}</p>
        </div>
      </Link>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      setName(profile?.full_name ?? "");
      setAvatarUrl(profile?.avatar_url ?? null);
    };

    loadUser();
  }, [supabase]);

  return (
    <>
      <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-[#0F2A20] px-4 py-6">
        <Link
          href="/employer/dashboard"
          className="flex items-center gap-2 px-2 mb-8 shrink-0"
        >
          <Image
            src="/Icons/logo-light.png"
            alt="TalentQ"
            width={180}
            height={48}
            className="h-12 w-auto"
          />
        </Link>

        <div className={NAV_SCROLL_CLASSES}>
          <TopNav pathname={pathname} onNavigate={onClose} />
        </div>

        <div className="mt-8 shrink-0">
          <BottomNav
            pathname={pathname}
            onNavigate={onClose}
            name={name}
            avatarUrl={avatarUrl}
          />
        </div>
      </aside>

      <div
        aria-hidden={!isOpen}
        onClick={onClose}
        className={`md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          isOpen ?
            "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] flex flex-col bg-[#0F2A20] px-4 py-6 transform transition-transform duration-200 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2 mb-8 shrink-0">
          <Link
            href="/employer/dashboard"
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

        <div className={NAV_SCROLL_CLASSES}>
          <TopNav pathname={pathname} onNavigate={onClose} />
        </div>

        <div className="mt-8 shrink-0">
          <BottomNav
            pathname={pathname}
            onNavigate={onClose}
            name={name}
            avatarUrl={avatarUrl}
          />
        </div>
      </aside>
    </>
  );
}
