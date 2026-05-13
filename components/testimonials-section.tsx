"use client"

import { useEffect, useMemo, useRef } from "react"
import { TestimonialsColumn } from "@/components/ui/testimonials-column"
import {
  buildTestimonialsReviewJsonLd,
  CLIENT_TESTIMONIALS,
} from "@/lib/testimonials-data"

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  const testimonialCards = useMemo(
    () =>
      CLIENT_TESTIMONIALS.map((t) => ({
        id: t.id,
        text: t.text,
        name: t.name,
        jobTitle: t.jobTitle,
        companyName: t.companyName,
        companyUrl: t.companyUrl,
      })),
    [],
  )

  const reviewSchemaJson = useMemo(
    () => JSON.stringify(buildTestimonialsReviewJsonLd(CLIENT_TESTIMONIALS)),
    [],
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".fade-in-element")
            elements.forEach((element, index) => {
              setTimeout(() => {
                element.classList.add("animate-fade-in-up")
              }, index * 300)
            })
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="testimonials" ref={sectionRef} className="relative pt-16 pb-16 px-4 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: reviewSchemaJson }} />

      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-32">
          <div className="fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out inline-flex items-center gap-2 text-white/60 text-sm font-medium tracking-wider uppercase mb-6">
            <div className="w-8 h-px bg-white/30"></div>
            Success Stories
            <div className="w-8 h-px bg-white/30"></div>
          </div>
          <h2 className="fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8 tracking-tight text-balance">
            Projects that <span className="font-medium italic">drive impact</span>
          </h2>
          <p className="fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Explore how businesses scale with custom software, cloud, AI/ML, mobile, and DevOps solutions from Next
            Innovation Systems
          </p>
        </div>

        <div className="fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out relative flex justify-center items-center min-h-0 lg:min-h-[800px] overflow-hidden">
          <div
            className="flex w-full max-w-6xl flex-col items-center justify-center gap-8 pb-4 lg:pb-0 lg:hidden"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 82%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 82%, transparent 100%)",
            }}
          >
            <TestimonialsColumn
              testimonials={testimonialCards.slice(0, 3)}
              duration={15}
              fillHeightClass="h-[min(58vh,520px)] sm:h-[min(62vh,560px)]"
              className="w-full max-w-xs shrink-0"
            />
          </div>

          <div
            className="hidden w-full max-w-6xl flex-col gap-8 lg:flex lg:flex-row lg:justify-center"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          >
            <TestimonialsColumn
              testimonials={testimonialCards.slice(0, 3)}
              duration={15}
              className="w-full flex-1 lg:min-w-0"
            />
            <TestimonialsColumn
              testimonials={testimonialCards.slice(3, 6)}
              duration={14}
              className="w-full flex-1 lg:min-w-0"
            />
            <TestimonialsColumn
              testimonials={testimonialCards.slice(6, 9)}
              duration={16}
              className="w-full flex-1 lg:min-w-0"
            />
          </div>
        </div>
      </div>
    </section>
  )
}