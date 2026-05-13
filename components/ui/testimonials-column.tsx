"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { initialsFromDisplayName, testimonialAvatarToneIndex } from "@/lib/testimonials-data"

export interface TestimonialCardModel {
  id: string
  text: string
  name: string
  jobTitle: string
  companyName: string
  companyUrl?: string
}

const AVATAR_TONES = [
  "bg-white/12 text-white/95 border-white/25",
  "bg-sky-500/15 text-sky-50 border-sky-400/30",
  "bg-violet-500/15 text-violet-50 border-violet-400/30",
  "bg-amber-500/15 text-amber-50 border-amber-400/30",
  "bg-emerald-500/15 text-emerald-50 border-emerald-400/30",
  "bg-rose-500/15 text-rose-50 border-rose-400/30",
] as const

export const TestimonialsColumn = (props: {
  className?: string
  testimonials: TestimonialCardModel[]
  duration?: number
  /** Viewport height for the scrolling clip (default 700px; use shorter on mobile to avoid excess empty space). */
  fillHeightClass?: string
}) => {
  return (
    <div className={cn("relative overflow-hidden", props.fillHeightClass ?? "h-[700px]", props.className)}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, loopIndex) => (
            <React.Fragment key={loopIndex}>
              {props.testimonials.map((t) => {
                const credential = [t.jobTitle, t.companyName].filter(Boolean).join(" · ")
                const initials = initialsFromDisplayName(t.name)
                const tone = AVATAR_TONES[testimonialAvatarToneIndex(t.id)]

                return (
                  <div
                    className="p-10 rounded-3xl border border-white/20 shadow-lg bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/15%),theme(backgroundColor.white/5%))] backdrop-blur-sm max-w-xs w-full"
                    style={{
                      boxShadow:
                        "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(156, 163, 175, 0.1), 0 0 20px rgba(156, 163, 175, 0.05)",
                    }}
                    key={`${loopIndex}-${t.id}`}
                  >
                    <div className="text-gray-200 text-sm leading-relaxed">{t.text}</div>

                    <div className="mt-5 flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-[11px] font-semibold tracking-tight",
                          tone,
                        )}
                        role="img"
                        aria-label={`${t.name} initials`}
                      >
                        {initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="font-medium tracking-tight leading-5 text-gray-100 truncate">{t.name}</div>
                        <div className="text-xs leading-5 opacity-60 tracking-tight text-gray-300">
                          {t.companyUrl ? (
                            <>
                              {t.jobTitle ? (
                                <>
                                  {t.jobTitle}
                                  {" · "}
                                </>
                              ) : null}
                              <a
                                href={t.companyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline-offset-2 hover:underline text-gray-200/90"
                              >
                                {t.companyName}
                              </a>
                            </>
                          ) : (
                            credential
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  )
}
