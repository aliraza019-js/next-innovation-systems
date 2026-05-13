import dynamic from "next/dynamic"
import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { HeroSection } from "@/components/hero-section"
import Aurora from "@/components/Aurora"
import { HomeServicesJsonLd } from "@/components/home-services-jsonld"

const ITServicesSection = dynamic(() =>
  import("@/components/it-services-section").then((m) => ({ default: m.ITServicesSection })),
)
const ProjectShowcaseSection = dynamic(() =>
  import("@/components/project-showcase-section").then((m) => ({ default: m.ProjectShowcaseSection })),
)
const TestimonialsSection = dynamic(() =>
  import("@/components/testimonials-section").then((m) => ({ default: m.TestimonialsSection })),
)
const FAQSection = dynamic(() =>
  import("@/components/faq-section").then((m) => ({ default: m.FAQSection })),
)
const CTASection = dynamic(() =>
  import("@/components/cta-section").then((m) => ({ default: m.CTASection })),
)
const Footer = dynamic(() => import("@/components/footer").then((m) => ({ default: m.Footer })))

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <HomeServicesJsonLd />
      <main className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <Aurora colorStops={["#00382d", "#006a54", "#0b3f35"]} amplitude={1.2} blend={0.6} speed={0.8} />
        </div>
        <div className="relative z-10">
          <GlassmorphismNav />
          <HeroSection />
          <ITServicesSection />
          <ProjectShowcaseSection />
          <TestimonialsSection />
          <FAQSection />
          <CTASection />
          <Footer />
        </div>
      </main>
    </div>
  )
}
