// AuthShell.tsx
import Image from "next/image";
import Link from "next/link";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AuthShell({
  title,
  subtitle,
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[#F5F1E9] relative">
      <Link href="/" className="absolute top-6 left-4 sm:left-6 lg:left-8">
        <Image
          src="/Icons/logo.png"
          alt="TalentQ"
          width={160}
          height={42}
          className="h-8 sm:h-9 w-auto"
        />
      </Link>

      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1B3A2F]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[#6B7A73] mt-1">{subtitle}</p>
          )}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
