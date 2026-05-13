import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { caseStudies } from "@/components/case-studies-data"
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld"
import { CaseStudyDetailClient } from "./case-study-detail-client"
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site-config"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return caseStudies.map((s) => ({ slug: s.slug }))
}

function truncateMeta(s: string, max: number): string {
  if (s.length <= max) return s
  const cut = s.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(" ")
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const study = caseStudies.find((item) => item.slug === slug)
  if (!study) {
    return { title: "Case study" }
  }

  const title = `${study.title} — Case Study`
  const description = truncateMeta(study.summary, 160)
  const pageUrl = `${SITE_URL}/case-studies/${slug}`

  return {
    title,
    description,
    openGraph: {
      title: `${study.title} | ${SITE_NAME}`,
      description,
      url: pageUrl,
      images: study.image
        ? [
            {
              url: absoluteUrl(study.image),
              alt: study.title,
            },
          ]
        : undefined,
    },
    twitter: {
      title: `${study.title} | ${SITE_NAME}`,
      description,
      images: study.image ? [absoluteUrl(study.image)] : undefined,
    },
  }
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params
  const study = caseStudies.find((item) => item.slug === slug)
  if (!study) notFound()

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Case studies", path: "/case-studies" },
          { name: study.title, path: `/case-studies/${study.slug}` },
        ]}
      />
      <CaseStudyDetailClient study={study} />
    </>
  )
}
