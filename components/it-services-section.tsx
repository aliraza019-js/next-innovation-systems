"use client"

import { useState } from "react"
import { Code2, Cloud, Brain, Smartphone, Palette, ShieldCheck, Workflow, Users, ChevronDown } from "lucide-react"
import "./it-services-section.css"

const allServices = [
  {
    title: "Custom Software Development",
    description: "Tailored software solutions designed around your workflows and business goals.",
    icon: Code2,
  },
  {
    title: "Cloud Solutions",
    description: "Migration, modernization, and optimization for secure and scalable cloud operations.",
    icon: Cloud,
  },
  {
    title: "AI & Machine Learning",
    description: "Production-ready AI/ML systems that automate processes and improve decision-making.",
    icon: Brain,
  },
  {
    title: "Mobile App Development",
    description: "Native and cross-platform mobile apps focused on performance and user experience.",
    icon: Smartphone,
  },
  {
    title: "UI/UX Design",
    description: "Human-centered product design that improves usability, engagement, and conversions.",
    icon: Palette,
  },
  {
    title: "DevOps & SecOps",
    description: "Accelerated release cycles with secure CI/CD, observability, and infrastructure controls.",
    icon: ShieldCheck,
  },
  {
    title: "Digital Transformation",
    description: "Strategic modernization to align technology initiatives with business outcomes.",
    icon: Workflow,
  },
  {
    title: "Dedicated Team",
    description: "Skilled specialists embedded with your team for reliable delivery and execution speed.",
    icon: Users,
  },
]

const MOBILE_VISIBLE_COUNT = 2

function ServiceCard({ service }: { service: (typeof allServices)[number] }) {
  return (
    <div
      className="service-card-animated transition-all duration-500 ease-out hover:scale-[1.05] hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] cursor-pointer"
    >
      <div className="card-inner-content p-8 flex flex-col h-full">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-emerald-400 border border-white/10 transition-colors duration-300 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30">
          <service.icon className="h-6 w-6" />
        </div>
        <h3 className="mb-4 text-xl font-bold text-white transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-base leading-relaxed text-white/50">
          {service.description}
        </p>
      </div>
    </div>
  )
}

export function ITServicesSection() {
  const [expanded, setExpanded] = useState(false)

  const featuredService = allServices[0]
  const remainingServices = allServices.slice(1)

  // Mobile: first 2 always visible, rest toggle
  const mobileVisible = remainingServices.slice(0, MOBILE_VISIBLE_COUNT)
  const mobileHidden = remainingServices.slice(MOBILE_VISIBLE_COUNT)

  return (
    <section id="features" className="relative z-10 px-4 py-0 sm:py-24">
      <div className="mx-auto max-w-7xl">

        {/* Header Section */}
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

        {/* LARGE FEATURED CARD */}
        <div className="service-card-animated mb-6">
          <div className="card-inner-content p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-6">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <featuredService.icon className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-white">{featuredService.title}</h3>
              <p className="text-white/60 leading-relaxed text-lg max-w-xl">
                {featuredService.description}
              </p>
            </div>
            <div className="flex-1 w-full h-64 md:h-80 feature-image-container rounded-2xl relative overflow-hidden flex items-center justify-center border border-emerald-500/10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent"></div>
              <Code2 size={120} className="text-emerald-500/20" />
            </div>
          </div>
        </div>

        {/* ── DESKTOP: all remaining cards shown normally ── */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingServices.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>

        {/* ── MOBILE: first 2 always visible ── */}
        <div className="grid grid-cols-1 gap-6 md:hidden">
          {mobileVisible.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}

          {/* Collapsible hidden cards */}
          <div
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{
              maxHeight: expanded ? `${mobileHidden.length * 300}px` : "0px",
              opacity: expanded ? 1 : 0,
            }}
          >
            <div className="flex flex-col gap-6 pt-0">
              {mobileHidden.map((service) => (
                <ServiceCard key={service.title} service={service} />
              ))}
            </div>
          </div>

          {/* View More / View Less Button — mobile only */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:bg-emerald-500/15 hover:border-emerald-500/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95"
              aria-expanded={expanded}
            >
              <span>{expanded ? "View Less" : `View ${mobileHidden.length} More Services`}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : "rotate-0"}`}
              />
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mt-10 px-5 justify-center align-items-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 transition-all duration-1000 delay-600 opacity-100 mt-7">

            <div className="group text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-6 hover:bg-white/10 hover:border-emerald-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-default">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-emerald-500 transition-colors duration-300">
                150+
              </div>
              <p className="text-white/70 text-xs sm:text-sm">Projects Delivered</p>
            </div>

            <div className="group text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-6 hover:bg-white/10 hover:border-emerald-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-default">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-emerald-500 transition-colors duration-300">
                50+
              </div>
              <p className="text-white/70 text-xs sm:text-sm">Happy Clients</p>
            </div>

            <div className="group text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-6 hover:bg-white/10 hover:border-emerald-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-default">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-emerald-500 transition-colors duration-300">
                98%
              </div>
              <p className="text-white/70 text-xs sm:text-sm">Success Rate</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}