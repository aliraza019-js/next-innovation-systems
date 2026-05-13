export type TestimonialSchemaAuthor = "person" | "organization"

export type ClientTestimonial = {
  id: string
  text: string
  name: string
  jobTitle: string
  companyName: string
  companyUrl?: string
  schemaAuthorType: TestimonialSchemaAuthor
}

/** Two-letter initials for avatar placeholder (person or team name). */
export function initialsFromDisplayName(name: string): string {
  const parts = name
    .split(/[\s&,]+/)
    .map((p) => p.trim())
    .filter(Boolean)

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  if (parts.length === 1) {
    const w = parts[0]
    return (w.length >= 2 ? w.slice(0, 2) : w).toUpperCase()
  }
  return "?"
}

export function testimonialAvatarToneIndex(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = (h + id.charCodeAt(i) * (i + 1)) % 720
  }
  return h % 6
}

export const CLIENT_TESTIMONIALS: ClientTestimonial[] = [
  {
    id: "ducorr",
    text: "The new website perfectly represents who we are as a company. It captures our technical depth, showcases our track record across the Middle East, and the integrated store has opened a new revenue channel we didn't have before.",
    name: "Hassan Sheikh",
    jobTitle: "CEO",
    companyName: "Ducorr",
    companyUrl: "https://www.ducorr.com",
    schemaAuthorType: "person",
  },
  {
    id: "sparkdoc",
    text: "SparkDoc completely transformed how our team handles documentation. The AI features are not gimmicks; they genuinely save us hours every week. The real-time collaboration feels instant.",
    name: "Lucas Hazen",
    jobTitle: "Product",
    companyName: "SparkDoc",
    companyUrl: "https://www.sparkdoc.com",
    schemaAuthorType: "person",
  },
  {
    id: "aladdin-catering",
    text: "He created a catering website in Vue.js for us from A-Z with incredible precision and attention to detail. His technical expertise, communication, and dedication were evident throughout the project. Not only did he deliver a sleek, functional, and user-friendly design, but he also ensured that every feature worked perfectly. If you're looking for a professional who can handle everything with perfection, you will not be disappointed.",
    name: "Ali Nehhas",
    jobTitle: "Founder",
    companyName: "Aladdin Catering",
    schemaAuthorType: "person",
  },
  {
    id: "autogather",
    text: "AutoGather completely changed our influencer workflow. What used to take our team days of manual research now happens in minutes. The AI assessment is remarkably accurate, and the real-time data means we are always working with fresh profiles.",
    name: "Ruban & Chanelle",
    jobTitle: "Co-founders",
    companyName: "AutoGather",
    companyUrl: "https://www.autogather.ai",
    schemaAuthorType: "person",
  },
  {
    id: "nft-builder",
    text: "The NFT Builder redefined how we think about digital identity. The 3D customization is incredibly smooth, and the marketplace makes trading assets effortless. It set a new standard for avatar platforms.",
    name: "NFT Builder Team",
    jobTitle: "Product team",
    companyName: "Digital product studio",
    schemaAuthorType: "organization",
  },
  {
    id: "campaign-builder",
    text: "They turned our complex vision into a polished, working product. The 3-module system flows exactly how we designed it, and the campaign wizard is intuitive even for non-technical marketers. Exceeded our expectations.",
    name: "Jake Berton",
    jobTitle: "Marketing technology lead",
    companyName: "Enterprise marketing organization",
    schemaAuthorType: "person",
  },
  {
    id: "enterprise-crm-ethos",
    text: "Ethos completely changed how we approach ESG compliance. The shared packages and dynamic forms saved us hundreds of hours, and the environmental reporting dashboard gives leadership the visibility they need.",
    name: "Ethos Team",
    jobTitle: "Compliance & ESG",
    companyName: "Enterprise CRM program",
    schemaAuthorType: "organization",
  },
  {
    id: "cardeye-gateway",
    text: "They built exactly what we envisioned: a payment system we fully own, with zero compromises on security or speed. Our merchants and customers both noticed the difference immediately.",
    name: "CardEye Team",
    jobTitle: "Payments",
    companyName: "CardEye",
    companyUrl: "https://cardeye.com",
    schemaAuthorType: "organization",
  },
  {
    id: "efxpro",
    text: "It was a great experience working with the team. They are highly professional, and their development skill set is truly impressive. Moreover, they are extremely responsive and communicative throughout the entire project. From start to finish, I didn't encounter any issues. I'm definitely looking forward to working with them again in the future and would 100% recommend them.",
    name: "Imran",
    jobTitle: "Client lead",
    companyName: "EFXPRO",
    companyUrl: "https://efxpro.com",
    schemaAuthorType: "person",
  },
]

export function getSiteOrigin(): string {
  const raw = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_SITE_URL : undefined
  if (raw && /^https?:\/\//i.test(raw)) {
    return raw.replace(/\/$/, "")
  }
  return "https://nextinnovation.systems"
}

export function buildTestimonialsReviewJsonLd(testimonials: ClientTestimonial[]) {
  const site = getSiteOrigin()
  const orgId = `${site}/#organization`

  const organization = {
    "@type": "Organization",
    "@id": orgId,
    name: "Next Innovation Systems",
    url: site,
  }

  const reviews = testimonials.map((t) => {
    const author =
      t.schemaAuthorType === "organization"
        ? {
            "@type": "Organization" as const,
            name: t.name,
            ...(t.companyUrl ? { url: t.companyUrl } : {}),
          }
        : {
            "@type": "Person" as const,
            name: t.name,
            ...(t.jobTitle ? { jobTitle: t.jobTitle } : {}),
            ...(t.companyName
              ? {
                  worksFor: {
                    "@type": "Organization",
                    name: t.companyName,
                    ...(t.companyUrl ? { url: t.companyUrl } : {}),
                  },
                }
              : {}),
          }

    return {
      "@type": "Review" as const,
      "@id": `${site}/#testimonial-${t.id}`,
      author,
      reviewBody: t.text,
      itemReviewed: { "@id": orgId },
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5,
      },
    }
  })

  return {
    "@context": "https://schema.org",
    "@graph": [organization, ...reviews],
  }
}
