"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Calendar } from "lucide-react"
import { motion } from "motion/react"
import { caseStudies, CaseStudy } from "@/components/case-studies-data"
import { CaseStudyDetail } from "@/components/case-study-detail"

const techStack = [
  { name: "React.js", category: "Frontend", icon: "https://cdn.simpleicons.org/react/61DAFB" },
  { name: "Next.js", category: "Framework", icon: "https://cdn.simpleicons.org/nextdotjs/white" },
  { name: "Vue.js", category: "Frontend", icon: "https://cdn.simpleicons.org/vuedotjs/4FC08D" },
  { name: "Nuxt.js", category: "Framework", icon: "https://cdn.simpleicons.org/nestjs/E0234E" },
  { name: "Node.js", category: "Runtime", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
  { name: "TypeScript", category: "Language", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
  { name: "Express.js", category: "Backend", icon: "https://cdn.simpleicons.org/express/white" },
  { name: "Nest.js", category: "Backend", icon: "https://cdn.simpleicons.org/nestjs/E0234E" },
  { name: "JavaScript", category: "Language", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
  { name: "Three.js", category: "3D / WebGL", icon: "https://cdn.simpleicons.org/threedotjs/white" },
  { name: "Docker", category: "DevOps", icon: "https://cdn.simpleicons.org/docker/2496ED" },
  { name: "Git", category: "VCS", icon: "https://cdn.simpleicons.org/git/F05032" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
}

export function ProjectShowcaseSection() {

  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null)

  return (
    <>
      {/* ── Case Study Detail Modal ── */}
      {selectedStudy && (
        <CaseStudyDetail
          study={selectedStudy}
          onClose={() => setSelectedStudy(null)}
        />
      )}

      <section id="case-studies" className="relative z-10 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 text-center sm:mb-14">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-5xl">
              Turn complex technology <br />
              challenges into <span className="text-emerald-500">measurable growth</span>
            </h2>
            <p className="mx-auto max-w-3xl text-balance text-base font-light leading-relaxed text-white/75 sm:text-lg">
              We combine consulting, engineering, and design expertise to deliver measurable business value from strategy
              through implementation.
            </p>
          </div>

          <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between border-t border-white/10 pt-16">
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

          {/* ── Cards Grid ── */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-24">
            {caseStudies.map((study) => (
              <article
                key={study.slug}
                className="overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-emerald-200/30 hover:bg-emerald-500/10 group cursor-pointer"
                onClick={() => setSelectedStudy(study)} // <-- card click pe modal open
              >
                <div className="overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.title}
                    loading="lazy"
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
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
                  {/* Button — now triggers modal, not Link */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedStudy(study) }}
                    className="inline-flex items-center gap-2 text-sm font-medium text-emerald-200 transition-colors hover:text-emerald-100"
                  >
                    Read case study
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* ── Tech Stack ── */}
          <div className="mt-20 border-t border-white/10 pt-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest text-sm opacity-50">
                Our Technology Stack
              </h3>
            </div>

            <motion.div
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-y-10 gap-x-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center group cursor-grab active:cursor-grabbing"
                  variants={itemVariants}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.5}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center rounded-full bg-white/5 border border-white/10 p-4 transition-all duration-300 group-hover:border-emerald-500/50 group-hover:bg-white/10">
                      <img
                        src={tech.icon}
                        alt={tech.name}
                        className="h-full w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                  </div>
                  <span className="text-white font-medium text-sm sm:text-base group-hover:text-emerald-400 transition-colors">
                    {tech.name}
                  </span>
                  <span className="text-white/40 text-[10px] sm:text-xs uppercase tracking-tighter mt-1">
                    {tech.category}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </section>
    </>
  )
}