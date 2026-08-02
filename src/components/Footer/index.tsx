import Image from "next/image";
import Link from "next/link";
import { FaLinkedin, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const footerColumns = [
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "For freelancers", href: "/#freelancers" },
      { label: "For employers", href: "/#employers" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const socials = [
  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t-4 border-[#DE814A] bg-[#0F2A20] px-4 sm:px-10 pt-10 pb-6">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image
                src="/Icons/logo.png"
                alt="TalentQ"
                width={110}
                height={30}
                className="h-7 w-auto"
              />
            </Link>
            <p className="text-sm text-[#8CABA1] max-w-xs">
              A fair, verified marketplace for African freelancers and the
              businesses that hire them.
            </p>

            <div className="flex items-center gap-3 mt-6">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-[#3E5C50] text-white hover:bg-[#1B3A2F] transition-colors"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.heading}>
              <p className="text-sm font-semibold text-white mb-4">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#8CABA1] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#2A4A3D] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8CABA1]">
          <p>© 2026 All Rights Reserved TalentQ</p>
          <p>Verified by identity check · Protected by escrow</p>
        </div>
      </div>
    </footer>
  );
}