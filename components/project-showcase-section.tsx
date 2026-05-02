import Link from "next/link"
import { ArrowUpRight, Calendar } from "lucide-react"
import { caseStudies } from "@/components/case-studies-data"

export function ProjectShowcaseSection() {
  return (
    <section id="case-studies" className="relative z-10 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              Project Showcase
            </div>
            <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Delivery highlights across industries
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200/30 bg-emerald-500/15 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500/25"
          >
            View all case studies
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {caseStudies.map((study) => (
            <article
              key={study.slug}
              className="overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-emerald-200/30 hover:bg-emerald-500/10"
            >
              <img
                src={study.image}
                alt={study.title}
                loading="lazy"
                className="h-56 w-full object-cover"
              />

              <div className="p-6">
                <div className="mb-3 flex items-center gap-4 text-xs text-white/65">
                  <span className="rounded-full border border-white/20 px-2.5 py-1">{study.category}</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {study.timeframe}
                  </span>
                </div>

                <h3 className="mb-2 text-xl font-semibold text-white">{study.title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-white/75">{study.summary}</p>

                <Link
                  href={`/case-studies/${study.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-200 transition-colors hover:text-emerald-100"
                >
                  Read case study
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
