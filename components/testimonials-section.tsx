"use client"

import { useEffect, useRef } from "react"
import { TestimonialsColumn } from "@/components/ui/testimonials-column"

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)

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

  const testimonials = [
    {
      text: "The 3D Generative NFT Builder gave our users a seamless way to generate, customize, and mint NFT assets with real-time previews.",
      name: "3D Generative NFT Builder",
      role: "Web3 / NFT Platform",
      image: "https://i.pravatar.cc/150?u=3d-generative-nft-builder"
    },
    {
      text: "EolasBio now has a modern digital presence that clearly communicates its biotechnology services and research capabilities.",
      name: "EolasBio",
      role: "Corporate Website / Biotechnology",
      image: "https://i.pravatar.cc/150?u=eolasbio"
    },
    {
      text: "The Aladdin Catering platform streamlined online bookings, menu browsing, and catering request management for customers.",
      name: "Aladdin Catering",
      role: "Restaurant / Catering Platform",
      image: "https://i.pravatar.cc/150?u=aladdin-catering"
    },
    {
      text: "AutoGather improved lead collection and automation workflows with a fast and scalable dashboard experience.",
      name: "AutoGather",
      role: "Automation Platform",
      image: "https://i.pravatar.cc/150?u=autogather"
    },
    {
      text: "Boxes by Swagify delivered a complete swag management solution with inventory tracking and global order fulfillment.",
      name: "Boxes by Swagify",
      role: "E-commerce / Swag Platform",
      image: "https://i.pravatar.cc/150?u=boxes-by-swagify"
    },
    {
      text: "The Campaign Builder platform enabled teams to create and launch marketing campaigns with better analytics and automation.",
      name: "Campaign Builder",
      role: "Marketing Automation",
      image: "https://i.pravatar.cc/150?u=campaign-builder"
    },
    {
      text: "Our Crypto Wallet solution introduced secure asset storage, transaction history, and a simplified crypto onboarding experience.",
      name: "Crypto Wallet",
      role: "FinTech / Blockchain",
      image: "https://i.pravatar.cc/150?u=crypto-wallet"
    },
    {
      text: "The Custom Enterprise CRM centralized sales pipelines, customer records, and operational reporting into a single platform.",
      name: "Custom Enterprise CRM",
      role: "CRM / Enterprise Software",
      image: "https://i.pravatar.cc/150?u=custom-enterprise-crm"
    },
    {
      text: "Ducorr’s website redesign improved brand identity, responsiveness, and customer engagement across all devices.",
      name: "Ducorr",
      role: "Corporate Website",
      image: "https://i.pravatar.cc/150?u=ducorr"
    },
    {
      text: "EFXPro received a scalable financial dashboard with improved user experience, reporting, and account management tools.",
      name: "EFXPro",
      role: "FinTech Dashboard",
      image: "https://i.pravatar.cc/150?u=efxpro"
    },
    {
      text: "ForBorga’s platform modernization enhanced usability, performance, and operational workflows for internal teams.",
      name: "ForBorga",
      role: "Business Platform",
      image: "https://i.pravatar.cc/150?u=forborga"
    },
    {
      text: "The Managed Hosting Dashboard simplified server monitoring, deployment management, and hosting analytics in one interface.",
      name: "Managed Hosting Dashboard",
      role: "Cloud / Hosting Platform",
      image: "https://i.pravatar.cc/150?u=managed-hosting-dashboard"
    },
    {
      text: "SparkDoc AI introduced intelligent document generation and AI-assisted workflows that significantly improved productivity.",
      name: "SparkDoc AI",
      role: "AI SaaS Platform",
      image: "https://i.pravatar.cc/150?u=sparkdoc-ai"
    }
  ]
  return (
    <section id="testimonials" ref={sectionRef} className="relative pt-16 pb-16 px-4 sm:px-6 lg:px-8">
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
            Explore how businesses scale with custom software, cloud, AI/ML, mobile, and DevOps solutions from Next Innovation Systems
          </p>
        </div>

        <div className="fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out relative flex justify-center items-center min-h-[600px] md:min-h-[800px] overflow-hidden">
          <div
            className="flex gap-8 max-w-6xl"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          >
            <TestimonialsColumn testimonials={testimonials.slice(0, 3)} duration={15} className="flex-1" />
            <TestimonialsColumn
              testimonials={testimonials.slice(2, 5)}
              duration={12}
              className="flex-1 hidden md:block"
            />
            <TestimonialsColumn
              testimonials={testimonials.slice(1, 4)}
              duration={18}
              className="flex-1 hidden lg:block"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
