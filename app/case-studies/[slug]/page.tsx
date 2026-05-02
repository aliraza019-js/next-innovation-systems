import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { caseStudies } from "@/components/case-studies-data"

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }))
}

export default function CaseStudyDetailPage({ params }: Props) {
  const study = caseStudies.find((item) => item.slug === params.slug)

  if (!study) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-black px-4 py-24">
      <article className="mx-auto max-w-5xl">
        <Link
          href="/case-studies"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to case studies
        </Link>

        <header className="mb-10">
          <p className="mb-3 text-sm text-emerald-200">{study.category}</p>
          <h1 className="mb-3 text-balance text-4xl font-bold text-white sm:text-5xl">{study.title}</h1>
          <p className="text-white/70">{study.client}</p>
        </header>

        <img
          src={study.image}
          alt={study.title}
          className="mb-10 h-72 w-full rounded-3xl border border-white/15 object-cover sm:h-96"
        />

        <section className="mb-8 rounded-2xl border border-white/15 bg-white/5 p-6">
          <h2 className="mb-3 text-xl font-semibold text-white">Project Summary</h2>
          <p className="leading-relaxed text-white/75">{study.summary}</p>
        </section>

        <section className="mb-8 rounded-2xl border border-white/15 bg-white/5 p-6">
          <h2 className="mb-3 text-xl font-semibold text-white">Business Challenge</h2>
          <p className="leading-relaxed text-white/75">{study.challenge}</p>
        </section>

        <section className="mb-8 rounded-2xl border border-white/15 bg-white/5 p-6">
          <h2 className="mb-3 text-xl font-semibold text-white">Solution Delivered</h2>
          <ul className="space-y-2 text-white/75">
            {study.solution.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8 rounded-2xl border border-white/15 bg-white/5 p-6">
          <h2 className="mb-3 text-xl font-semibold text-white">Outcomes</h2>
          <ul className="space-y-2 text-white/75">
            {study.outcomes.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/15 bg-white/5 p-6">
          <h2 className="mb-3 text-xl font-semibold text-white">Technology Stack</h2>
          <div className="flex flex-wrap gap-2">
            {study.technologies.map((tech) => (
              <span key={tech} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white/80">
                {tech}
              </span>
            ))}
          </div>
        </section>
      </article>
    </main>
  )
}
