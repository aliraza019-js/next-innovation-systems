"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    question: "How much does custom software development cost?",
    answer:
      "Custom software development costs vary based on complexity, team size, and timeline. A simple web application typically ranges from $5,000–$15,000, a medium-complexity SaaS platform from $15,000–$50,000, and enterprise-grade systems from $50,000+. We offer both fixed-price and hourly engagement models. Use our Project Cost Estimator for a tailored range based on your specific requirements.",
  },
  {
    question: "How long does it take to build a web or mobile app?",
    answer:
      "Timelines depend on scope and complexity. A simple landing site or MVP takes 2–4 weeks. A medium-complexity web or mobile app typically takes 6–12 weeks. A full-featured SaaS platform or enterprise solution can take 3–6 months. We work in sprints with clear milestones so you always know where you stand.",
  },
  {
    question: "Do you work with startups or only established companies?",
    answer:
      "We work with both. From early-stage startups building their first MVP to established enterprises modernizing legacy systems, our team adapts to your stage and budget. We've helped founders launch, scale, and exit — and we understand the constraints and speed requirements at each stage.",
  },
  {
    question: "What technologies do you specialize in?",
    answer:
      "Our core stack includes React.js, Next.js, Vue.js, Node.js, Python, TypeScript, and PostgreSQL for web and backend. For AI/ML, we work with LangChain, LangGraph, LlamaIndex, OpenAI APIs, and Hugging Face models. For DevOps, we use Docker, AWS, and CI/CD pipelines. We choose the best-fit technology for each project — not the trendiest.",
  },
  {
    question: "Do you offer post-launch support and maintenance?",
    answer:
      "Yes. Every project includes a 30-day post-launch support window. Beyond that, we offer flexible monthly retainers for ongoing maintenance, feature development, performance monitoring, and security updates. Long-term client relationships are central to how we operate.",
  },
  {
    question: "How do I get started with a project?",
    answer:
      "Start by filling out the contact form or using our Project Cost Estimator. After initial contact, we schedule a free 30-minute discovery call to understand your goals. We then produce a detailed proposal with scope, timeline, and pricing — typically within 48 hours. No commitment required until you approve the proposal.",
  },
  {
    question: "Do you sign NDAs?",
    answer:
      "Absolutely. We sign NDAs before any detailed technical discussions take place. Confidentiality is a non-negotiable part of how we operate. Your business logic, product ideas, and data are always protected.",
  },
  {
    question: "Can I hire a dedicated development team?",
    answer:
      "Yes. We offer dedicated team engagements where you get a fully managed team — developers, a designer, and a project manager — working exclusively on your product. This model works well for companies that need sustained product velocity without the overhead of in-house hiring.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  // FAQPage JSON-LD schema for Google Rich Results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <section id="faq" className="relative py-24 px-4 sm:px-6 lg:px-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium tracking-wider uppercase mb-4">
            <div className="w-6 h-px bg-emerald-500/60" />
            FAQ
            <div className="w-6 h-px bg-emerald-500/60" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Questions we get{" "}
            <span className="italic font-light text-emerald-400">all the time</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about working with Next Innovation Systems — pricing,
            timelines, process, and more.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <button
                  id={`faq-btn-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-2xl cursor-pointer"
                >
                  <span
                    className={`text-base sm:text-lg font-medium transition-colors duration-200 ${
                      isOpen ? "text-emerald-300" : "text-white"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                        : "border-white/20 text-white/50"
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-btn-${index}`}
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <p className="px-6 pb-6 text-white/65 leading-relaxed text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-white/50 text-sm mb-4">Still have questions?</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/15 text-white/80 text-sm font-medium hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-white transition-all duration-200"
          >
            Talk to our team →
          </a>
        </div>
      </div>
    </section>
  )
}
