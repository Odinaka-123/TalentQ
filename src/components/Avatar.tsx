import Image from "next/image";
import { UserRound } from "lucide-react";

type AvatarProps = {
  src?: string | null;
  name?: string | null;
  size?: number;
};

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

  return (
    <div
      className="rounded-full bg-[#3E5C50] flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <UserRound size={size * 0.55} className="text-white/80" />
    </div>
  );
}
