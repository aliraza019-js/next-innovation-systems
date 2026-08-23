import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Briefcase, MapPin, Clock, CheckCircle2 } from "lucide-react"
import { getJobOpeningBySlug, jobOpenings } from "@/lib/careers-data"
import { CareerApplicationForm } from "@/components/career-application-form"
import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Footer } from "@/components/footer"
import Aurora from "@/components/Aurora"
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld"
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME, SITE_URL } from "@/lib/site-config"

export function generateStaticParams() {
  return jobOpenings.map((job) => ({ slug: job.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const job = getJobOpeningBySlug(params.slug)
  if (!job) return {}

  const title = `${job.title} — Careers`
  const description = job.summary

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/careers/${job.slug}`,
      images: [
        {
          url: DEFAULT_OG_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${job.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE_PATH],
    },
  }
}

export default function JobOpeningPage({ params }: { params: { slug: string } }) {
  const job = getJobOpeningBySlug(params.slug)

  if (!job || !job.active) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
          { name: job.title, path: `/careers/${job.slug}` },
        ]}
      />
      <main className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <Aurora colorStops={["#00382d", "#006a54", "#0b3f35"]} amplitude={1.0} blend={0.5} speed={0.6} />
        </div>
        <div className="relative z-10">
          <GlassmorphismNav />

          <div className="mx-auto max-w-5xl px-4 pb-24 pt-32">
        <Link
          href="/careers"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to careers
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Job details */}
          <div className="lg:col-span-2">
            <p className="mb-2 text-xs text-white/60">{job.department}</p>
            <h1 className="mb-4 text-balance text-3xl font-bold text-white sm:text-4xl">{job.title}</h1>

            <div className="mb-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                {job.employmentType}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {job.experienceLevel} experience
              </span>
            </div>

            <p className="mb-8 text-white/70">{job.summary}</p>

            <div className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/50">
                What you&apos;ll do
              </h2>
              <ul className="space-y-2.5">
                {job.responsibilities.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/50">
                What we&apos;re looking for
              </h2>
              <ul className="space-y-2.5">
                {job.requirements.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Application form */}
          <div className="lg:col-span-3">
            <CareerApplicationForm jobSlug={job.slug} jobTitle={job.title} />
          </div>
        </div>
          </div>

          <Footer />
        </div>
      </main>
    </div>
  )
}
