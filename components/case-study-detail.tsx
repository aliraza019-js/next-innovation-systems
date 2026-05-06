"use client"

import { useEffect } from "react"
import { X, ArrowUpRight, Calendar, Tag } from "lucide-react"
import { CaseStudy } from "@/components/case-studies-data"

interface CaseStudyDetailProps {
    study: CaseStudy
    onClose: () => void
}

export function CaseStudyDetail({ study, onClose }: CaseStudyDetailProps) {

    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = "" }
    }, [])

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [onClose])

    return (
        // Backdrop
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm p-4 md:p-8"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            {/* Modal Container */}
            <div className="relative w-full max-w-4xl my-auto rounded-3xl overflow-hidden bg-[#0e1117] border border-white/10 shadow-2xl">

                {/* ── Close Button ── */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 h-9 w-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
                >
                    <X size={18} />
                </button>

                {/* ── Hero Image with Title Overlay ── */}
                <div className="relative h-64 md:h-80 w-full overflow-hidden">
                    <img
                        src={study.image}
                        alt={study.title}
                        className="h-full w-full object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1117] via-[#0e1117]/60 to-transparent" />

                    {/* Title overlay on image */}
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
                <div className="px-6 md:px-10 pb-10">

                    {/* ── Stats Row ── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
                        {study.stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center"
                            >
                                <p className="text-2xl md:text-3xl font-bold text-emerald-400 mb-1">
                                    {stat.value}
                                </p>
                                <p className="text-[11px] uppercase tracking-widest text-white/40 font-medium">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* ── Meta row ── */}
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

                    {/* ── Overview ── */}
                    <div className="mb-8">
                        <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-3">
                            Overview
                        </p>
                        <p className="text-white/80 leading-relaxed text-base md:text-lg">
                            {study.summary}
                        </p>
                    </div>

                    {/* ── Challenge + Solution (2 col) ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Challenge */}
                        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-5 rounded-full bg-emerald-500" />
                                <p className="text-[11px] uppercase tracking-widest text-white/40 font-semibold">
                                    The Challenge
                                </p>
                            </div>
                            <p className="text-white/65 text-sm leading-relaxed">
                                {study.challenge}
                            </p>
                        </div>

                        {/* Solution */}
                        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-5 rounded-full bg-emerald-500" />
                                <p className="text-[11px] uppercase tracking-widest text-white/40 font-semibold">
                                    The Solution
                                </p>
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

                    {/* ── Key Outcomes ── */}
                    <div className="mb-8">
                        <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-4">
                            Key Outcomes
                        </p>
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

                    {/* ── Tech Stack ── */}
                    <div>
                        <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-4">
                            Technologies Used
                        </p>
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
    )
}