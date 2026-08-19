import Image from "next/image";

type PortfolioItem = {
  id: string;
  title: string;
  image_url: string | null;
  tags: string[] | null;
};

type PortfolioGridProps = {
  items: PortfolioItem[];
};

export default function PortfolioGrid({ items }: PortfolioGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-16 text-center text-sm text-[#8A8A7E]">
        No portfolio items yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-[#E5E0D6] bg-white overflow-hidden"
        >
          <div className="w-full h-36 bg-[#F5F1E9] relative">
            {item.image_url && (
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="px-4 py-3 border-t-2 border-[#DE814A]">
            <p className="text-sm font-semibold text-[#C6543A]">{item.title}</p>
            {item.tags && item.tags.length > 0 && (
              <p className="text-xs text-[#8A8A7E] mt-0.5">
                {item.tags.join(" . ")}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
