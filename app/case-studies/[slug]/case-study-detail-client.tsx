"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Target,
  Lightbulb,
  TrendingUp,
} from "lucide-react"
import type { CaseStudy } from "@/components/case-studies-data"
import Aurora from "@/components/Aurora"
import "./case-study-detail.css"

export function CaseStudyDetailClient({ study }: { study: CaseStudy }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const images = study.images ?? [study.image]

  const nextLightbox = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % images.length))
  }, [images.length])

  const prevLightbox = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? 0 : (i - 1 + images.length) % images.length
    )
  }, [images.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === "Escape") setLightboxIndex(null)
        if (e.key === "ArrowRight") nextLightbox()
        if (e.key === "ArrowLeft") prevLightbox()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightboxIndex, nextLightbox, prevLightbox])

  return (
    <>
      <main className="min-h-screen bg-black relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-40">
          <Aurora
            colorStops={["#00382d", "#006a54", "#0b3f35"]}
            amplitude={0.8}
            blend={0.5}
            speed={0.5}
          />
        </div>

        <div className="relative z-10">
          <nav className="px-6 md:px-12 pt-8 pb-4">
            <Link
              href="/case-studies"
              className="group inline-flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors duration-300"
            >
              <span className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all duration-300">
                <ArrowLeft className="h-3.5 w-3.5" />
              </span>
              <span className="font-medium">Back to Projects</span>
            </Link>
          </nav>

          <section className="px-6 md:px-12 pb-14 pt-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-5">
                  <span className="inline-block text-emerald-400 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                    {study.category}
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.06] tracking-tight">
                    {study.title}
                  </h1>
                  <p className="mt-5 text-lg md:text-xl text-white/50 leading-relaxed font-light max-w-2xl">
                    {study.summary}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-white/40 bg-white/[0.04] border border-white/[0.06] rounded-full px-3.5 py-1.5">
                      {study.client}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-white/40 bg-white/[0.04] border border-white/[0.06] rounded-full px-3.5 py-1.5">
                      {study.timeframe}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/[0.06] shadow-[0_0_80px_-20px_rgba(16,185,129,0.08)] group">
                    <img
                      src={images[0]}
                      alt={study.title}
                      width={1200}
                      height={675}
                      decoding="async"
                      fetchPriority="high"
                      className="w-full h-64 sm:h-80 md:h-[460px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 md:px-12 pb-20">
            <div className="max-w-6xl mx-auto">
              <div className="csd-narrative">
                <div className="csd-narrative__row">
                  <div className="csd-narrative__icon csd-narrative__icon--challenge">
                    <Target size={18} />
                  </div>
                  <div className="csd-narrative__content">
                    <h2 className="csd-narrative__title">The Challenge</h2>
                    <p className="csd-narrative__text">{study.challenge}</p>
                  </div>
                </div>

                <div className="csd-narrative__divider" />

                <div className="csd-narrative__row">
                  <div className="csd-narrative__icon csd-narrative__icon--solution">
                    <Lightbulb size={18} />
                  </div>
                  <div className="csd-narrative__content">
                    <h2 className="csd-narrative__title">The Solution</h2>
                    <ul className="csd-narrative__list">
                      {study.solution.map((item, i) => (
                        <li key={i} className="csd-narrative__list-item">
                          <span className="csd-narrative__dot" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="csd-narrative__divider" />

                <div className="csd-narrative__row">
                  <div className="csd-narrative__icon csd-narrative__icon--outcome">
                    <TrendingUp size={18} />
                  </div>
                  <div className="csd-narrative__content">
                    <h2 className="csd-narrative__title">The Outcome</h2>
                    <ul className="csd-narrative__list">
                      {study.outcomes.map((item, i) => (
                        <li key={i} className="csd-narrative__list-item">
                          <span className="csd-narrative__dot" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {images.length > 1 && (
            <section className="px-6 md:px-12 pb-20">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/25">
                    Project Gallery
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-white/[0.06] to-transparent" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {images.map((src, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLightboxIndex(idx)}
                      className="group relative overflow-hidden rounded-xl md:rounded-2xl border border-white/[0.06] bg-white/[0.02] aspect-video cursor-zoom-in hover:border-emerald-500/20 transition-all duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.06)]"
                    >
                      <img
                        src={src}
                        alt={`${study.title} screenshot ${idx + 1}`}
                        width={640}
                        height={360}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading={idx < 3 ? "eager" : "lazy"}
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 flex items-center justify-center">
                          <ZoomIn size={16} className="text-white" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="px-6 md:px-12 pb-24">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/25">
                  Technology Stack
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-white/[0.06] to-transparent" />
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {study.technologies.map((tech) => (
                  <span key={tech} className="csd-tech-chip">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-lg"
          onClick={() => setLightboxIndex(null)}
          role="presentation"
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close lightbox"
            className="absolute top-4 right-4 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
          >
            <X size={20} />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                prevLightbox()
              }}
              aria-label="Previous image"
              className="absolute left-4 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          <div
            className="max-w-6xl max-h-[85vh] px-20"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <img
              src={images[lightboxIndex]}
              alt={`${study.title} screenshot ${lightboxIndex + 1}`}
              width={1920}
              height={1080}
              className="max-h-[80vh] max-w-full object-contain rounded-xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
            />
            <div className="mt-3 flex items-center justify-between text-white/40 text-xs px-1">
              <span>{study.title}</span>
              <span>
                {lightboxIndex + 1} / {images.length}
              </span>
            </div>
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                nextLightbox()
              }}
              aria-label="Next image"
              className="absolute right-4 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-6 flex items-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxIndex(i)
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === lightboxIndex
                      ? "w-6 bg-emerald-400"
                      : "w-1.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
