export type Candidate = {
  slug: string;
  name: string;
  title: string;
  avatar: string;
  location: string;
  experience: string;
  rate: string;
  aiScore: number;
  available: boolean;
  identityVerified: boolean;
  about: string;
  skills: string[];
  certifications: { title: string; issuer: string }[];
  quickStats: {
    hourlyRate: string;
    experience: string;
    aiMatchScore: string;
    reviews: string;
    overallRating: number;
  };
  ratingBreakdown: { label: string; value: number }[];
};

export const candidates: Record<string, Candidate> = {
  "henrieta-ebiuwa": {
    slug: "henrieta-ebiuwa",
    name: "Henrieta Ebiuwa",
    title: "Senior Frontend Engineer",
    avatar: "/images/testimonials/felicia.png",
    location: "Senegal, West Africa",
    experience: "6 years",
    rate: "$45/hr",
    aiScore: 94,
    available: true,
    identityVerified: true,
    about:
      "Senior frontend engineer specialising in React, TypeScript, and performant web applications. Led teams of 4-8 engineers shipping products used by 100k+ users. Thrive in remote-first environments with strong cross-functional collaboration.",
    skills: [
      "React",
      "Type Script",
      "GraphQL",
      "Next.js",
      "Tailwind CSS",
      "Jest",
      "REST APIs",
      "Figma",
    ],
    certifications: [
      { title: "AWS Certified Developer", issuer: "Amazon Web Service - 2023" },
      { title: "Meta Frontend Developer", issuer: "Meta/Coursera - 2022" },
    ],
    quickStats: {
      hourlyRate: "$45/hr",
      experience: "6 years",
      aiMatchScore: "94/100",
      reviews: "12 reviews",
      overallRating: 4.9,
    },
    ratingBreakdown: [
      { label: "Communication", value: 5 },
      { label: "Quality", value: 4.9 },
      { label: "Punctuality", value: 4.8 },
    ],
  },
};
