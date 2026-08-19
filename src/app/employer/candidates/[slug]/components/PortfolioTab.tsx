import Image from "next/image";

type PortfolioItem = {
  image: string;
  title: string;
  tags: string;
};

const projects: PortfolioItem[] = [
  {
    image: "/images/portfolio/analytics-dashboard.jpg",
    title: "Analytics Dashboard",
    tags: "React . Typescript",
  },
  {
    image: "/images/portfolio/fintech-app.jpg",
    title: "Fintech App",
    tags: "React . Typescript",
  },
  {
    image: "/images/portfolio/ecommerce-platform.jpg",
    title: "E-commerce Platform",
    tags: "React . Typescript",
  },
];

export default function PortfolioTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div
          key={project.title}
          className="rounded-2xl border border-[#E5E0D6] bg-white overflow-hidden"
        >
          <div className="w-full h-36 bg-[#F5F1E9] relative">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="px-4 py-3 border-t-2 border-[#DE814A]">
            <p className="text-sm font-semibold text-[#C6543A]">
              {project.title}
            </p>
            <p className="text-xs text-[#8A8A7E] mt-0.5">{project.tags}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
