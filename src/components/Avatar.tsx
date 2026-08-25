import Image from "next/image";
import { UserRound } from "lucide-react";

type AvatarProps = {
  src?: string | null;
  name?: string | null;
  size?: number;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ src, name, size = 64 }: AvatarProps) {
  if (src) {
    return (
      <div
        className="rounded-full overflow-hidden bg-[#3E5C50] shrink-0"
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={name ?? "Profile"}
          width={size}
          height={size}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const initials = name ? getInitials(name) : "";

  if (initials) {
    return (
      <div
        className="rounded-full bg-[#C36A34] flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <span
          className="font-semibold text-white"
          style={{ fontSize: size * 0.38 }}
        >
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div
      className="rounded-full bg-[#3E5C50] flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <UserRound size={size * 0.55} className="text-white/80" />
    </div>
  );
}