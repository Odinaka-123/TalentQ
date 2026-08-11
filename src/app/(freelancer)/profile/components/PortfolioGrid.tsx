import PortfolioCard from "./PortfolioCard";

const projects = [
  {
    image: "/images/portfolio/analytics-dashboard.png",
    title: "Analytics Dashboard",
    tags: "React . Typescript",
  },
  {
    image: "/images/portfolio/fintech-app.png",
    title: "Fintech App",
    tags: "React . Typescript",
  },
  {
    image: "/images/portfolio/ecommerce-platform.png",
    title: "E-commerce Platform",
    tags: "React . Typescript",
  },
  {
    image: "/images/portfolio/hr-tools.png",
    title: "HR Tools",
    tags: "React . Typescript",
  },
  {
    image: "/images/portfolio/health-portal.png",
    title: "Health Portal",
    tags: "React . Typescript",
  },
  {
    image: "/images/portfolio/saas-landing-page.png",
    title: "SaaS Landing Page",
    tags: "React . Typescript",
  },
];

export default function PortfolioGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <PortfolioCard key={project.title} {...project} />
      ))}
    </div>
  );
}
