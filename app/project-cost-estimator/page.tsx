import type { Metadata } from "next"
import { CostEstimatorTool } from "@/components/cost-estimator-tool"
import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Footer } from "@/components/footer"
import Aurora from "@/components/Aurora"
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld"
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME, SITE_URL } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Project Cost Estimator — How Much Does Software Development Cost? | Next Innovation Systems",
  description:
    "Use our free interactive calculator to estimate custom software development costs and timelines. Get an instant range for web apps, mobile apps, AI systems, and DevOps projects in Pakistan and globally.",
  keywords: [
    "software development cost calculator",
    "how much does custom software cost",
    "app development cost Pakistan",
    "web app development cost estimator",
    "IT project cost calculator Pakistan",
  ],
  openGraph: {
    type: "website",
    title: `Project Cost Estimator | ${SITE_NAME}`,
    description: "Estimate your software development cost and timeline instantly — free tool.",
    url: `${SITE_URL}/project-cost-estimator`,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Project cost estimator`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Project Cost Estimator | ${SITE_NAME}`,
    description: "Estimate your software development cost and timeline instantly — free tool.",
    images: [DEFAULT_OG_IMAGE_PATH],
  },
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Estimate Your Software Development Cost",
  description:
    "Use our interactive cost estimator to get a realistic price and timeline range for your custom software project.",
  step: [
    {
      "@type": "HowToStep",
      name: "Choose your project type",
      text: "Select whether you need a web app, mobile app, AI solution, or DevOps infrastructure.",
    },
    {
      "@type": "HowToStep",
      name: "Set complexity and team size",
      text: "Choose simple, medium, or complex complexity and your preferred team size.",
    },
    {
      "@type": "HowToStep",
      name: "Select required features",
      text: "Check off features like authentication, payments, admin dashboard, and APIs.",
    },
    {
      "@type": "HowToStep",
      name: "Get your estimate",
      text: "Receive an instant cost range and timeline estimate based on your inputs.",
    },
    {
      "@type": "HowToStep",
      name: "Book a free consultation",
      text: "Enter your email to receive a detailed breakdown and book a free 30-minute call.",
    },
  ],
}

export default function ProjectCostEstimatorPage() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Project cost estimator", path: "/project-cost-estimator" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <main className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <Aurora colorStops={["#00382d", "#006a54", "#0b3f35"]} amplitude={1.0} blend={0.5} speed={0.6} />
        </div>
        <div className="relative z-10">
          <GlassmorphismNav />

          {/* Hero */}
          <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium tracking-wider uppercase mb-6">
                <div className="w-6 h-px bg-emerald-500/60" />
                Free Tool
                <div className="w-6 h-px bg-emerald-500/60" />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                How Much Does{" "}
                <span className="text-emerald-400 italic font-light">
                  Software Development Cost?
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/65 leading-relaxed max-w-2xl mx-auto">
                Get an instant, realistic cost and timeline estimate for your custom software project.
                No sales calls required — just answer a few questions.
              </p>
            </div>
          </section>


          <CostEstimatorTool />
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                  Understanding Software Development Costs in 2026
                </h2>
                <div className="space-y-5 text-white/65 leading-relaxed text-base">
                  <p>
                    Custom software development costs vary widely based on your project's complexity,
                    team composition, and timeline. In Pakistan and South Asia, development rates are
                    significantly more competitive than Western markets — without sacrificing quality.
                    A typical web application from a skilled agency in Pakistan costs{" "}
                    <strong className="text-white/80">$1,000–$3,000</strong>, while the same project
                    in the US or UK might cost $5,000–$10,000.
                  </p>
                  <p>
                    The biggest cost drivers are <strong className="text-white/80">feature complexity</strong>,{" "}
                    <strong className="text-white/80">third-party integrations</strong> (payment gateways,
                    CRMs, APIs), and <strong className="text-white/80">team size</strong>. A two-person
                    team building an MVP moves fast and costs less; a dedicated five-person team building
                    an enterprise SaaS platform costs more but ships production-ready software at scale.
                  </p>
                  <p>
                    Timeline also affects cost. Aggressive deadlines require larger teams working in
                    parallel, which increases the budget. A 4-week timeline for a medium-complexity app
                    will cost more than a 10-week timeline for the same app — because more people need
                    to work simultaneously.
                  </p>
                  <p>
                    Our estimator uses real-world data from 50+ delivered projects to calculate ranges.
                    Every project is different, so we always recommend a free 30-minute consultation
                    after using the tool — this lets us refine the estimate based on your actual
                    requirements, existing tech stack, and business goals.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Simple App / MVP", range: "$500–$1000", timeline: "1–4 weeks" },
                    { label: "Medium SaaS / Platform", range: "$1000–$2000", timeline: "4–8 weeks" },
                    { label: "Enterprise System", range: "$4000+", timeline: "8–15 months" },
                  ].map((tier) => (
                    <div
                      key={tier.label}
                      className="p-4 rounded-xl border border-white/10 bg-white/5 text-center"
                    >
                      <p className="text-xs text-emerald-400 uppercase tracking-wider font-medium mb-2">
                        {tier.label}
                      </p>
                      <p className="text-white font-bold text-lg mb-1">{tier.range}</p>
                      <p className="text-white/40 text-sm">{tier.timeline}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </div>
      </main>
    </div>
  )
}
