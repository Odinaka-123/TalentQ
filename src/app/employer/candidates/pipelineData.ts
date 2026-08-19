export type PipelineStatus =
  | "Applied"
  | "Invited"
  | "Interviewing"
  | "Offer Sent"
  | "Hired";

export type PipelineCandidate = {
  slug: string;
  name: string;
  title: string;
  avatar: string;
  jobTitle: string;
  aiScore: number;
  status: PipelineStatus;
  lastActivity: string;
};

export const pipelineCandidates: PipelineCandidate[] = [
  {
    slug: "henrieta-ebiuwa",
    name: "Henrieta Ebiuwa",
    title: "Senior Frontend Engineer",
    avatar: "/images/testimonials/felicia.png",
    jobTitle: "Senior Frontend Developer",
    aiScore: 94,
    status: "Interviewing",
    lastActivity: "2 hours ago",
  },
  {
    slug: "chidi-okonkwo",
    name: "Chidi Okonkwo",
    title: "UX Consultant",
    avatar: "/images/avatar-placeholder.jpg",
    jobTitle: "Senior Frontend Developer",
    aiScore: 87,
    status: "Invited",
    lastActivity: "1 day ago",
  },
  {
    slug: "fatima-zahra",
    name: "Fatima Zahra",
    title: "Content Strategist",
    avatar: "/images/avatar-placeholder.jpg",
    jobTitle: "Content & SEO Lead",
    aiScore: 79,
    status: "Applied",
    lastActivity: "3 days ago",
  },
  {
    slug: "koffi-nassan",
    name: "Koffi Nassan",
    title: "Full Stack Developer",
    avatar: "/images/avatar-placeholder.jpg",
    jobTitle: "Senior Frontend Developer",
    aiScore: 91,
    status: "Offer Sent",
    lastActivity: "5 days ago",
  },
];
