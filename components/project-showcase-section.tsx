"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { caseStudies, CaseStudy } from "@/components/case-studies-data";
import { CaseStudyDetail } from "@/components/case-study-detail";
import "./project-showcase-section.css";


const techStack = [
  {
    name: "React.js",
    category: "Frontend",
    icon: "/react.svg",
  },
  {
    name: "Next.js",
    category: "Framework",
    icon: "/next-js.svg",
  },
  {
    name: "Vue.js",
    category: "Frontend",
    icon: "/vue.svg",
  },
  {
    name: "Nuxt.js",
    category: "Framework",
    icon: "/nuxt-js.svg",
  },
  {
    name: "Node.js",
    category: "Runtime",
    icon: "/nodejs.svg",
  },
  {
    name: "TypeScript",
    category: "Language",
    icon: "/type-script.png",
  },
  {
    name: "Express.js",
    category: "Backend",
    icon: "/express.svg",
  },
  {
    name: "Nest.js",
    category: "Backend",
    icon: "/nest.svg",
  },
  {
    name: "JavaScript",
    category: "Language",
    icon: "/javascript.svg",
  },
  {
    name: "Three.js",
    category: "3D / WebGL",
    icon: "/three.svg",
  },
  {
    name: "Docker",
    category: "DevOps",
    icon: "/docker.svg",
  },


  {
    name: "Python",
    category: "AI / ML",
    icon: "/python.svg",
  },


  {
    name: "LangChain",
    category: "RAG",
    icon: "/langchain.png",
  },

  {
    name: "Hugging Face",
    category: "AI Models",
    icon: "/huggingface.svg",
  },
  {
    name: "LangGraph",
    category: "Agentic AI",
    icon: "/lang-graph.svg",
  },
  {
    name: "LlamaIndex",
    category: "RAG",
    icon: "/llama.png",
  },
];



const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

export function ProjectShowcaseSection() {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  const openStudy = (study: CaseStudy) => {
    setSelectedStudy(study);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("case-study", study.slug);
      window.history.pushState({}, "", url.toString());
    }
  };

  const closeStudy = () => {
    setSelectedStudy(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("case-study");
      window.history.pushState({}, "", url.toString());
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handlePopState = () => {
        const params = new URLSearchParams(window.location.search);
        const slug = params.get("case-study");
        if (slug) {
          const study = caseStudies.find((s) => s.slug === slug);
          setSelectedStudy(study || null);
        } else {
          setSelectedStudy(null);
        }
      };

      handlePopState(); 

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, []);

  const INITIAL_VISIBLE = 3;
  const LOAD_MORE_STEP = 9;
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);


  const [imgLoadingBySlug, setImgLoadingBySlug] = useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {};
    for (const s of caseStudies.slice(0, INITIAL_VISIBLE))
      initial[s.slug] = true;
    return initial;
  });

  const visibleStudies = useMemo(
    () => caseStudies.slice(0, visibleCount),
    [visibleCount],
  );
  const hasMore = visibleCount < caseStudies.length;

  const handleLoadMore = () => {
    const nextCount = Math.min(
      visibleCount + LOAD_MORE_STEP,
      caseStudies.length,
    );

    setImgLoadingBySlug((prev) => {
      const next = { ...prev };
      for (const s of caseStudies.slice(visibleCount, nextCount))
        next[s.slug] = true;
      return next;
    });
    setVisibleCount(nextCount);
  };
  const imgRefs = useRef<Record<string, HTMLImageElement | null>>({});

  useEffect(() => {

    setImgLoadingBySlug((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const [slug, el] of Object.entries(imgRefs.current)) {
        if (el && el.complete && next[slug]) {
          next[slug] = false;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, []);

  return (
    <>
      {/* ── Case Study Detail Modal ── */}
      {selectedStudy && (
        <CaseStudyDetail
          study={selectedStudy}
          onClose={closeStudy}
        />
      )}

      <section id="case-studies" className="relative z-10 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center sm:mb-14">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-5xl">
              Turn complex technology <br />
              challenges into{" "}
              <span className="text-emerald-500">measurable growth</span>
            </h2>
            <p className="mx-auto max-w-3xl text-balance text-base font-light leading-relaxed text-white/75 sm:text-lg">
              We combine consulting, engineering, and design expertise to
              deliver measurable business value from strategy through
              implementation.
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

          </div>

          {/* ── Cards Grid ── */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-24">
            {visibleStudies.map((study, index) => (
              <article
                key={study.slug}
                className="card-reveal overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-emerald-200/30 hover:bg-emerald-500/10 group cursor-pointer"
                onClick={() => openStudy(study)} // <-- card click pe modal open
                style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
              >
                <div className="relative overflow-hidden">
                  {imgLoadingBySlug[study.slug] && (
                    <div
                      className="skeleton-shimmer absolute inset-0"
                      aria-hidden="true"
                    />
                  )}
                  <img
                    ref={(el) => {
                      imgRefs.current[study.slug] = el;
                    }}
                    src={study.image}
                    alt={study.title}
                    width={960}
                    height={540}
                    decoding="async"
                    loading={index < 3 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : undefined}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{
                      opacity: imgLoadingBySlug[study.slug] ? 0 : 1,
                      transition: "opacity 400ms ease",
                    }}
                    onLoad={() =>
                      setImgLoadingBySlug((prev) => ({
                        ...prev,
                        [study.slug]: false,
                      }))
                    }
                    onError={() =>
                      setImgLoadingBySlug((prev) => ({
                        ...prev,
                        [study.slug]: false,
                      }))
                    }
                  />
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-4 text-xs text-white/65">
                    <span className="rounded-full border border-white/20 px-2.5 py-1">
                      {study.category}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {study.timeframe}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    {study.title}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-white/75">
                    {study.summary}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openStudy(study);
                    }}
                    className="inline-flex items-center gap-2 text-sm font-medium text-emerald-200 transition-colors hover:text-emerald-100"
                  >
                    Read case study
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200/30 bg-emerald-500/15 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-500/25"
              >
                Load more
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ── Tech Stack ── */}
          <div className="mt-20 border-t border-white/10 pt-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest text-sm ">
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
                        alt={`${tech.name} — ${tech.category} technology used by Next Innovation Systems`}
                        width={64}
                        height={64}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain tech-icon-img"
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
  );
}
