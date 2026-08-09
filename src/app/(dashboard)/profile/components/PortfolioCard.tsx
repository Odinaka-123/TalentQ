import Image from "next/image";

type PortfolioCardProps = {
  image: string;
  title: string;
  tags: string;
};

export default function PortfolioCard({
  image,
  title,
  tags,
}: PortfolioCardProps) {
  return (
    <div className="rounded-2xl bg-white overflow-hidden shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <div className="w-full h-36 bg-[#F5F1E9] relative">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-[#C6543A]">{title}</p>
        <p className="text-xs text-[#8A8A7E] mt-0.5">{tags}</p>
      </div>
    </div>
  );
}
