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

  // Close on Escape — also handles lightbox
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
      {/* ── Main Modal ── */}
      <div
        className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/90 backdrop-blur-md p-4 md:p-8"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="relative w-full max-w-7xl my-auto rounded-3xl overflow-hidden bg-[#080c0c] border border-white/10 shadow-[0_0_80px_-20px_rgba(16,185,129,0.15)]">

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-20 h-9 w-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
          >
            <X size={18} />
          </button>

          {/* ── Hero Image with Title Overlay ── */}
          <div className="relative h-64 md:h-96 w-full overflow-hidden">
            <img
              src={images[0]}
              alt={study.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c0c] via-black/50 to-transparent" />
            {/* Subtle green glow at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-500/5 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                {study.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {study.title}
              </h1>
            </div>
          </div>

          {/* ── Content Body ── */}
          <div className="px-6 md:px-10 pb-12 bg-[#080c0c]">

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
              {study.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-center"
                >
                  <p className="text-2xl md:text-3xl font-bold text-emerald-400 mb-1">{stat.value}</p>
                  <p className="text-[11px] uppercase tracking-widest text-white/40 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-white/50">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} />
                {study.timeframe}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Tag size={14} />
                {study.client}
              </span>
            </div>

            {/* Overview */}
            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-3">Overview</p>
              <p className="text-white/80 leading-relaxed text-base md:text-lg">{study.summary}</p>
            </div>

            {/* Challenge + Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 rounded-full bg-emerald-500" />
                  <p className="text-[11px] uppercase tracking-widest text-white/40 font-semibold">The Challenge</p>
                </div>
                <p className="text-white/65 text-sm leading-relaxed">{study.challenge}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 rounded-full bg-emerald-500" />
                  <p className="text-[11px] uppercase tracking-widest text-white/40 font-semibold">The Solution</p>
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

            {/* ── IMAGE GALLERY ── */}
            {images.length > 1 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold">
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
            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-4">Key Outcomes</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {study.outcomes.map((outcome, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-4 text-sm text-white/70 leading-relaxed"
                  >
                    <ArrowUpRight size={14} className="text-emerald-400 mb-2" />
                    {outcome}
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-4">Technologies Used</p>
              <div className="flex flex-wrap gap-2">
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
            className="absolute top-4 right-4 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
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