import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { caseStudies } from "@/components/case-studies-data"
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld"
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME, SITE_URL } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Explore software, cloud, AI/ML, and product delivery case studies from Next Innovation Systems—Lahore, Pakistan. Real projects with measurable outcomes.",
  openGraph: {
    title: `Case Studies | ${SITE_NAME}`,
    description:
      "Selected project delivery across industries—software, cloud, AI/ML, and digital products.",
    url: `${SITE_URL}/case-studies`,
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Case studies`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Case Studies | ${SITE_NAME}`,
    description:
      "Selected project delivery across industries—software, cloud, AI/ML, and digital products.",
    images: [DEFAULT_OG_IMAGE_PATH],
  },
}

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", path: "/" },
            { name: "Case studies", path: "/case-studies" },
          ]}
        />
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <header className="mb-12">
          <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white">
            Case Studies
          </div>
          <h1 className="mb-4 text-balance text-4xl font-bold text-white sm:text-5xl">Project delivery in action</h1>
          <p className="max-w-3xl text-lg text-white/70">
            Explore selected work across software, cloud, AI/ML, and product delivery with measurable outcomes.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {caseStudies.map((study) => (
            <article key={study.slug} className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-md">
              <p className="mb-2 text-xs text-white/60">{study.category}</p>
              <h2 className="mb-2 text-2xl font-semibold text-white">{study.title}</h2>
              <p className="mb-5 text-sm text-white/70">{study.summary}</p>
              <Link
                href={`/case-studies/${study.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-200 transition-colors hover:text-emerald-100"
              >
                Open details
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
