export type JobOpening = {
  slug: string
  title: string
  department: string
  location: string
  employmentType: string
  experienceLevel: string
  summary: string
  responsibilities: string[]
  requirements: string[]
  active: boolean
}

/**
 * Current job openings. Add a new entry here (with active: true) to publish
 * a new opening on /careers — no other code changes needed.
 */
export const jobOpenings: JobOpening[] = [
  {
    slug: "software-engineer",
    title: "Software Engineer",
    department: "Engineering",
    location: "Lahore, Pakistan (On-site)",
    employmentType: "Full-time",
    experienceLevel: "1–2 years",
    summary:
      "We're hiring a Software Engineer to join our delivery team, building production software across web and backend stacks for our clients.",
    responsibilities: [
      "Build and ship features across the stack for client projects",
      "Write clean, tested, maintainable code and participate in code reviews",
      "Collaborate with designers, PMs, and other engineers on delivery timelines",
      "Debug and resolve issues across the application lifecycle",
    ],
    requirements: [
      "1–2 years of professional software development experience",
      "Solid fundamentals in at least one of: Ruby, MERN, .NET/Angular, or React/Next",
      "Comfortable working with Git and modern development workflows",
      "Good communication skills and a bias toward ownership",
    ],
    active: true,
  },
]

export function getActiveJobOpenings(): JobOpening[] {
  return jobOpenings.filter((job) => job.active)
}

export function getJobOpeningBySlug(slug: string): JobOpening | undefined {
  return jobOpenings.find((job) => job.slug === slug)
}

/** Tech stacks we ask every candidate to self-rate experience against. */
export const TECH_STACKS = [
  { key: "ruby", label: "Ruby (on Rails)" },
  { key: "mern", label: "MERN (MongoDB, Express, React, Node)" },
  { key: "dotnetAngular", label: ".NET / Angular" },
  { key: "reactNext", label: "React / Next.js" },
] as const

export type TechStackKey = (typeof TECH_STACKS)[number]["key"]

