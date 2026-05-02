import { Code2, Cloud, Brain, Smartphone, Palette, ShieldCheck, Workflow, Users } from "lucide-react"

const services = [
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

export function ITServicesSection() {
  return (
    <section id="features" className="relative z-10 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-14">
          <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white">
            IT Services & Solutions
          </div>
          <h2 className="mb-4 text-balance text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Comprehensive services for modern enterprise teams
          </h2>
          <p className="mx-auto max-w-3xl text-balance text-base font-light leading-relaxed text-white/75 sm:text-lg">
            We combine consulting, engineering, and design expertise to deliver measurable business value from strategy
            through implementation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-emerald-200/30 hover:bg-emerald-500/10"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-200">
                <service.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">{service.title}</h3>
              <p className="text-sm leading-relaxed text-white/70">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
