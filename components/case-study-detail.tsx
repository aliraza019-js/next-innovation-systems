"use client"

import { useEffect, useState, useCallback } from "react"
import { X, ArrowUpRight, Calendar, Tag, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { CaseStudy } from "@/components/case-studies-data"

interface CaseStudyDetailProps {
  study: CaseStudy
  onClose: () => void
}

export function CaseStudyDetail({ study, onClose }: CaseStudyDetailProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxIndex !== null) setLightboxIndex(null)
        else onClose()
      }
      if (lightboxIndex !== null) {
        if (e.key === "ArrowRight") nextLightbox()
        if (e.key === "ArrowLeft") prevLightbox()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose, lightboxIndex])

  const images = study.images ?? [study.image]

  const nextLightbox = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % images.length))
  }, [images.length])

  const prevLightbox = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + images.length) % images.length))
  }, [images.length])

  return (
    <>

      <div
        className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/90 backdrop-blur-md p-4 md:p-8"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="relative w-full max-w-7xl my-auto rounded-3xl overflow-hidden bg-black border border-white/10 shadow-[0_0_80px_-20px_rgba(16,185,129,0.15)]">


          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-black/70 hover:bg-black/90 border border-white/30 hover:border-white/60 text-white backdrop-blur-md shadow-[0_2px_16px_rgba(0,0,0,0.6)] transition-all duration-200"
          >
            <X size={18} />
          </button>

          <div className="relative w-full overflow-hidden bg-[#0a0a0a]">
            <img
              src={images[0]}
              alt={study.title}
              width={1200}
              height={675}
              decoding="async"
              className="h-64 md:h-[600px] w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c0c] via-transparent to-transparent opacity-80 pointer-events-none" />
          </div>


          <div className="px-8 md:px-12 pb-16 pt-10 bg-[#080c0c]">


            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              {study.category}
            </p>


            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
              {study.title}
            </h1>


            <div className="flex flex-wrap items-center gap-4 mb-10 text-sm text-white/45">
              <span className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-full px-4 py-1.5">
                <Calendar size={14} />
                {study.timeframe}
              </span>
              <span className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-full px-4 py-1.5">
                <Tag size={14} />
                {study.client}
              </span>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-10" />

            <div className="mb-12">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/30 font-semibold mb-4">Overview</p>
              <p className="text-white/75 leading-[1.8] text-base md:text-lg max-w-4xl">{study.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 rounded-full bg-emerald-500" />
                  <p className="text-md uppercase tracking-widest text-emerald-500 font-semibold">The Challenge</p>
                </div>
                <p className="text-white/65 text-sm leading-relaxed">{study.challenge}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 rounded-full bg-emerald-500" />
                  <p className="text-md uppercase tracking-widest text-emerald-500 font-semibold">The Solution</p>
                </div>
                <ul className="space-y-2">
                  {study.solution.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/65 leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500/60 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-center my-14">
              {/* Tech Stack */}
              <div>
                <p className="text-md uppercase tracking-widest text-white font-semibold mb-4">Technologies Used</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {study.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── IMAGE GALLERY ── */}
            {images.length > 1 && (
              <div className="mb-14">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[11px] uppercase tracking-widest text-white font-semibold">
                    Project Screenshots
                  </p>
                  <span className="text-[11px] text-white/25">{images.length} images — click to expand</span>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className="group relative overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] aspect-video cursor-zoom-in hover:border-emerald-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    >
                      <img
                        src={src}
                        alt={`${study.title} screenshot ${idx + 1}`}
                        width={640}
                        height={360}
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading={idx < 3 ? "eager" : "lazy"}
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/8 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-9 w-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center">
                          <ZoomIn size={15} className="text-white" />
                        </div>
                      </div>
                      {/* Index badge */}
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-[10px] text-white/60 bg-black/60 rounded px-1.5 py-0.5">
                          {idx + 1}/{images.length}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Key Outcomes */}
            <div className="mb-12">
              <p className="text-md uppercase tracking-widest text-white text-center font-semibold mb-6">Key Outcomes</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {study.outcomes.map((outcome, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-5 py-5 text-sm text-white/70 leading-[1.7]"
                  >
                    <ArrowUpRight size={14} className="text-emerald-400 mb-3" />
                    {outcome}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-lg"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="Close lightbox"
            className="absolute top-4 right-4 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-400/40 hover:border-emerald-400/80 text-emerald-300 hover:text-white backdrop-blur-md shadow-[0_0_16px_rgba(16,185,129,0.25)] hover:shadow-[0_0_24px_rgba(16,185,129,0.45)] transition-all duration-200"
          >
            <X size={20} />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevLightbox() }}
              aria-label="Previous image"
              className="absolute left-4 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Image */}
          <div className="max-w-6xl max-h-[85vh] px-20" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightboxIndex]}
              alt={`${study.title} screenshot ${lightboxIndex + 1}`}
              width={1920}
              height={1080}
              className="max-h-[80vh] max-w-full object-contain rounded-xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
            />
            {/* Caption */}
            <div className="mt-3 flex items-center justify-between text-white/40 text-xs px-1">
              <span>{study.title}</span>
              <span>{lightboxIndex + 1} / {images.length}</span>
            </div>
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextLightbox() }}
              aria-label="Next image"
              className="absolute right-4 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Dot indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-6 flex items-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === lightboxIndex
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