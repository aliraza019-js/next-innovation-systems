import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { HeroSection } from "@/components/hero-section"
import { ProblemSolutionSection } from "@/components/problem-solution-section"
import Aurora from "@/components/Aurora"
import { ITServicesSection } from "@/components/it-services-section"
import { ProjectShowcaseSection } from "@/components/project-showcase-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <main className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full">
          <Aurora colorStops={["#00382d", "#006a54", "#0b3f35"]} amplitude={1.2} blend={0.6} speed={0.8} />
        </div>
        <div className="relative z-10">
          <GlassmorphismNav />
          <HeroSection />
          <ProblemSolutionSection />
          <ITServicesSection />
          <ProjectShowcaseSection />
          <TestimonialsSection />
          <CTASection />
          <Footer />
        </div>
      </main>
    </div>
  )
}
