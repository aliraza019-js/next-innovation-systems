import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Briefcase, MapPin, Clock } from "lucide-react"
import { getActiveJobOpenings } from "@/lib/careers-data"
import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Footer } from "@/components/footer"
import Aurora from "@/components/Aurora"
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld"
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME, SITE_URL } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Next Innovation Systems in Lahore, Pakistan. Explore current openings and apply directly online.",
  openGraph: {
    title: `Careers | ${SITE_NAME}`,
    description: "Current openings at Next Innovation Systems — apply directly online.",
    url: `${SITE_URL}/careers`,
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Careers`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Careers | ${SITE_NAME}`,
    description: "Current openings at Next Innovation Systems — apply directly online.",
    images: [DEFAULT_OG_IMAGE_PATH],
  },
}

export default function CareersPage() {
  const openings = getActiveJobOpenings()

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
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
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <header className="mb-12">
          <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white">
            Careers
          </div>
          <h1 className="mb-4 text-balance text-4xl font-bold text-white sm:text-5xl">Join our team</h1>
          <p className="max-w-3xl text-lg text-white/70">
            We&apos;re a Lahore-based software & AI studio building real products for clients worldwide.
            Here&apos;s what we&apos;re hiring for right now.
          </p>
        </header>

        {openings.length === 0 ? (
          <div className="rounded-3xl border border-white/15 bg-white/5 p-10 text-center text-white/60">
            We don&apos;t have any open roles right now — check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {openings.map((job) => (
              <Link
                key={job.slug}
                href={`/careers/${job.slug}`}
                className="group rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-md transition-colors hover:border-emerald-500/30 hover:bg-white/[0.07] sm:p-8"
              >
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                  <div>
                    <p className="mb-2 text-xs text-white/60">{job.department}</p>
                    <h2 className="mb-3 text-2xl font-semibold text-white">{job.title}</h2>
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60">
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
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition-transform group-hover:scale-105">
                    Apply now
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
          </div>

          <Footer />
        </div>
      </main>
    </div>
  )
}
