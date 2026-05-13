"use client"

import { useState } from "react"
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, Calculator } from "lucide-react"

// ── Types ────────────────────────────────────────────────────────────────────
type ProjectType = "web" | "mobile" | "ai" | "devops" | ""
type Complexity = "simple" | "medium" | "complex" | ""
type TeamSize = "solo" | "small" | "medium-team" | "large" | ""
type Timeline = "rush" | "standard" | "flexible" | ""

interface FormState {
  projectType: ProjectType
  complexity: Complexity
  teamSize: TeamSize
  timeline: Timeline
  features: string[]
}

interface Estimate {
  costMin: number
  costMax: number
  weeksMin: number
  weeksMax: number
}

// ── Constants ─────────────────────────────────────────────────────────────────
const FEATURES = [
  { id: "auth",          label: "User Authentication",           cost: 50  },
  { id: "payments",      label: "Payment Integration",           cost: 200 },
  { id: "admin",         label: "Admin Dashboard",               cost: 400 },
  { id: "api",           label: "Third-party API Integration",   cost: 100 },
  { id: "ai_chat",       label: "AI Chatbot / Assistant",        cost: 250 },
  { id: "notifications", label: "Email / Push Notifications",    cost: 100 },
  { id: "analytics",     label: "Analytics & Reporting",         cost: 500 },
  { id: "mobile_app",    label: "Mobile App (iOS + Android)",    cost: 200 },
  { id: "realtime",      label: "Real-time Features (WebSocket)",cost: 100 },
  { id: "cms",           label: "Content Management System",     cost: 500 },
  { id: "multilang",     label: "Multi-language Support",        cost: 300 },
  { id: "file_upload",   label: "File Upload & Storage",         cost: 50  },
]

const BASE_COSTS: Record<string, { min: number; max: number }> = {
  web:    { min: 800,  max: 3500 },
  mobile: { min: 2000, max: 7000 },
  ai:     { min: 1500, max: 6000 },
  devops: { min: 1000, max: 4000 },
}

const COMPLEXITY_MULTIPLIER: Record<string, number> = {
  simple:  0.6,
  medium:  1.0,
  complex: 1.7,
}

const TEAM_MULTIPLIER: Record<string, number> = {
  solo:          0.6,
  small:         1.0,
  "medium-team": 1.5,
  large:         2.1,
}

const TIMELINE_MULTIPLIER: Record<string, number> = {
  rush:     1.25,
  standard: 1.0,
  flexible: 0.8,
}

const TEAM_WEEK_MULTIPLIER: Record<string, number> = {
  solo:          0.9,
  small:         1.0,
  "medium-team": 0.7,
  large:         0.5,
}

const TIMELINE_WEEK_MULTIPLIER: Record<string, number> = {
  rush:     0.65,
  standard: 1.0,
  flexible: 1.2,
}

const BASE_WEEKS: Record<string, { min: number; max: number }> = {
  web:    { min: 1, max: 5 },
  mobile: { min: 2, max: 8 },
  ai:     { min: 1, max: 6 },
  devops: { min: 1, max: 4 },
}

function formatCurrency(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`
}

function computeEstimate(form: FormState): Estimate | null {
  if (!form.projectType || !form.complexity || !form.teamSize || !form.timeline) return null

  const base     = BASE_COSTS[form.projectType]
  const weekBase = BASE_WEEKS[form.projectType]

  const featureCost = form.features.reduce((sum, id) => {
    const f = FEATURES.find((f) => f.id === id)
    return sum + (f?.cost ?? 0)
  }, 0)

  const cm  = COMPLEXITY_MULTIPLIER[form.complexity]
  const tm  = TEAM_MULTIPLIER[form.teamSize]
  const tlm = TIMELINE_MULTIPLIER[form.timeline]
  const twm = TEAM_WEEK_MULTIPLIER[form.teamSize]
  const tlw = TIMELINE_WEEK_MULTIPLIER[form.timeline]

  const costMin = Math.round((base.min * cm * tm * tlm + featureCost * 0.8) / 50) * 50
  const costMax = Math.round((base.max * cm * tm * tlm + featureCost * 1.2) / 50) * 50

  const weekMin = Math.max(1, Math.round(weekBase.min * cm * twm * tlw))
  const weekMax = Math.max(1, Math.round(weekBase.max * cm * twm * tlw))

  return { costMin, costMax, weeksMin: weekMin, weeksMax: weekMax }
}

// ── Sub-components ────────────────────────────────────────────────────────────
function OptionCard({
  selected,
  onClick,
  label,
  description,
  emoji,
}: {
  selected: boolean
  onClick: () => void
  label: string
  description?: string
  emoji?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
        selected
          ? "border-emerald-500/60 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/8"
      }`}
    >
      <div className="flex items-start gap-3">
        {emoji && <span className="text-xl mt-0.5">{emoji}</span>}
        <div>
          <p className={`font-medium text-sm sm:text-base ${selected ? "text-emerald-300" : "text-white"}`}>
            {label}
          </p>
          {description && (
            <p className="text-white/45 text-xs sm:text-sm mt-1 leading-relaxed">{description}</p>
          )}
        </div>
        {selected && (
          <CheckCircle2 className="ml-auto w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        )}
      </div>
    </button>
  )
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
            i < current ? "bg-emerald-500" : i === current ? "bg-emerald-400/60" : "bg-white/15"
          }`}
        />
      ))}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export function CostEstimatorTool() {
  const [step, setStep]           = useState(0)
  const [attempted, setAttempted] = useState(false)
  const [form, setForm]           = useState<FormState>({
    projectType: "",
    complexity:  "",
    teamSize:    "",
    timeline:    "",
    features:    [],
  })
  const [email, setEmail]           = useState("")
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [showResult, setShowResult] = useState(false)

  const TOTAL_STEPS = 5
  const estimate    = computeEstimate(form)

  const isStepValid = () => {
    if (step === 0) return !!form.projectType
    if (step === 1) return !!form.complexity
    if (step === 2) return !!form.teamSize
    if (step === 3) return !!form.timeline
    return true 
  }

  const toggleFeature = (id: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(id)
        ? prev.features.filter((f) => f !== id)
        : [...prev.features, id],
    }))
  }

  const handleNext = () => {
    if (!isStepValid()) {
      setAttempted(true)
      return
    }
    setAttempted(false)
    if (step === 4) {
      setShowResult(true)
    } else {
      setStep((s) => s + 1)
    }
  }

  const handleBack = () => {
    setAttempted(false)
    setStep((s) => s - 1)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setEmailStatus("loading")
    try {
      const res = await fetch("/api/lead", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          page:      "Project Cost Estimator",
          timestamp: new Date().toISOString(),
          estimateDetails: {
            projectType: form.projectType,
            complexity:  form.complexity,
            teamSize:    form.teamSize,
            timeline:    form.timeline,
            features:    form.features,
            estimatedCost: estimate
              ? `${formatCurrency(estimate.costMin)} – ${formatCurrency(estimate.costMax)}`
              : "N/A",
          },
        }),
      })
      if (!res.ok) throw new Error("Failed")
      setEmailStatus("success")
    } catch {
      setEmailStatus("error")
    }
  }

  // ── Result View ──────────────────────────────────────────────────────────────
  if (showResult && estimate) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-xl p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-400 text-xs font-medium uppercase tracking-wider">Your Estimate</p>
                <h2 className="text-white font-bold text-lg">Project Cost & Timeline</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Estimated Cost</p>
                <p className="text-3xl sm:text-4xl font-bold text-white">
                  {formatCurrency(estimate.costMin)}
                </p>
                <p className="text-white/40 text-sm mt-1">to {formatCurrency(estimate.costMax)}</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Timeline</p>
                <p className="text-3xl sm:text-4xl font-bold text-white">{estimate.weeksMin}</p>
                <p className="text-white/40 text-sm mt-1">to {estimate.weeksMax} weeks</p>
              </div>
            </div>

            <div className="mb-8 space-y-2 text-sm text-white/60">
              <p><strong className="text-white/80">Project:</strong> {form.projectType} app · {form.complexity} complexity</p>
              <p><strong className="text-white/80">Team:</strong> {form.teamSize} team · {form.timeline} timeline</p>
              {form.features.length > 0 && (
                <p><strong className="text-white/80">Features:</strong> {form.features.length} selected</p>
              )}
            </div>

            {emailStatus === "success" ? (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-white font-medium">Check your inbox!</p>
                <p className="text-white/55 text-sm mt-1">We'll send a detailed breakdown shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <p className="text-white/70 text-sm font-medium">
                  Get a detailed PDF breakdown sent to your email:
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/25 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
                  />
                  <button
                    type="submit"
                    disabled={emailStatus === "loading"}
                    className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all text-sm disabled:opacity-60 flex items-center gap-2 justify-center cursor-pointer"
                  >
                    {emailStatus === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Breakdown"}
                  </button>
                </div>
                {emailStatus === "error" && (
                  <p className="text-red-400 text-xs">Something went wrong. Please try again.</p>
                )}
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <a
                href="#contact"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all text-sm"
              >
                Book Free Consultation <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  setStep(0)
                  setShowResult(false)
                  setAttempted(false)
                  setForm({ projectType: "", complexity: "", teamSize: "", timeline: "", features: [] })
                }}
                className="px-6 py-3 border border-white/20 text-white/70 rounded-full hover:border-white/40 transition-all text-sm cursor-pointer"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // ── Step Forms ───────────────────────────────────────────────────────────────
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-10">
          <StepIndicator current={step} total={TOTAL_STEPS} />

          {/* Step 0 — Project Type */}
          {step === 0 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">What are you building?</h2>
              <p className="text-white/50 text-sm mb-1">Select the primary type of your project.</p>
              {attempted && !form.projectType && (
                <p className="text-red-400 text-xs mb-4">⚠ Please select an option to continue.</p>
              )}
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${attempted && !form.projectType ? "" : "mt-6"}`}>
                {[
                  { value: "web",    label: "Web Application",       description: "SaaS, dashboards, portals, e-commerce",   },
                  { value: "mobile", label: "Mobile App",            description: "iOS, Android, or cross-platform",          },
                  { value: "ai",     label: "AI / ML Solution",      description: "Chatbots, RAG, automation, LLM apps",      },
                  { value: "devops", label: "DevOps / Infrastructure",description: "CI/CD, cloud setup, containerization",    },
                ].map((opt) => (
                  <OptionCard
                    key={opt.value}
                    selected={form.projectType === opt.value}
                    onClick={() => { setForm((p) => ({ ...p, projectType: opt.value as ProjectType })); setAttempted(false) }}
                    label={opt.label}
                    description={opt.description}
                    emoji={opt.emoji}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — Complexity */}
          {step === 1 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">How complex is your project?</h2>
              <p className="text-white/50 text-sm mb-1">This is the biggest driver of cost and timeline.</p>
              {attempted && !form.complexity && (
                <p className="text-red-400 text-xs mb-4">⚠ Please select an option to continue.</p>
              )}
              <div className={`space-y-3 ${attempted && !form.complexity ? "" : "mt-6"}`}>
                {[
                  { value: "simple",  label: "Simple / MVP",            description: "1–3 core features, minimal integrations, fast launch" },
                  { value: "medium",  label: "Medium",                  description: "Several features, some integrations, standard business logic" },
                  { value: "complex", label: "Complex / Enterprise",    description: "Many features, heavy integrations, advanced workflows or AI" },
                ].map((opt) => (
                  <OptionCard
                    key={opt.value}
                    selected={form.complexity === opt.value}
                    onClick={() => { setForm((p) => ({ ...p, complexity: opt.value as Complexity })); setAttempted(false) }}
                    label={opt.label}
                    description={opt.description}
                    emoji={opt.emoji}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Team Size */}
          {step === 2 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">What team size do you need?</h2>
              <p className="text-white/50 text-sm mb-1">Larger teams ship faster but cost more monthly.</p>
              {attempted && !form.teamSize && (
                <p className="text-red-400 text-xs mb-4">⚠ Please select an option to continue.</p>
              )}
              <div className={`space-y-3 ${attempted && !form.teamSize ? "" : "mt-6"}`}>
                {[
                  { value: "solo",         label: "Solo Developer",    description: "1 developer — best for very small projects or MVPs" },
                  { value: "small",        label: "Small Team (2–3)",  description: "Developer + designer — balanced speed and cost" },
                  { value: "medium-team",  label: "Medium Team (4–6)", description: "Full-stack team with PM — most common for SaaS" },
                  { value: "large",        label: "Large Team (7+)",   description: "Dedicated team — for enterprises or tight deadlines" },
                ].map((opt) => (
                  <OptionCard
                    key={opt.value}
                    selected={form.teamSize === opt.value}
                    onClick={() => { setForm((p) => ({ ...p, teamSize: opt.value as TeamSize })); setAttempted(false) }}
                    label={opt.label}
                    description={opt.description}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Timeline */}
          {step === 3 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">What's your timeline preference?</h2>
              <p className="text-white/50 text-sm mb-1">Rush projects require larger teams, which increases cost.</p>
              {attempted && !form.timeline && (
                <p className="text-red-400 text-xs mb-4">⚠ Please select an option to continue.</p>
              )}
              <div className={`space-y-3 ${attempted && !form.timeline ? "" : "mt-6"}`}>
                {[
                  { value: "rush",     label: "ASAP / Rush", emoji: "", description: "Need it fast — expect a 25% premium for priority resourcing" },
                  { value: "standard", label: "Standard",    emoji: "", description: "Normal paced delivery — best balance of speed and cost" },
                  { value: "flexible", label: "Flexible",    emoji: "", description: "No hard deadline — allows for cost optimization and iteration" },
                ].map((opt) => (
                  <OptionCard
                    key={opt.value}
                    selected={form.timeline === opt.value}
                    onClick={() => { setForm((p) => ({ ...p, timeline: opt.value as Timeline })); setAttempted(false) }}
                    label={opt.label}
                    description={opt.description}
                    emoji={opt.emoji}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Features */}
          {step === 4 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Which features do you need?</h2>
              <p className="text-white/50 text-sm mb-6">Select all that apply — or skip if you're not sure yet.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FEATURES.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => toggleFeature(feature.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      form.features.includes(feature.id)
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                        : "border-white/10 bg-white/5 text-white/70 hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-all ${
                        form.features.includes(feature.id)
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-white/30"
                      }`}
                    >
                      {form.features.includes(feature.id) && (
                        <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm">{feature.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-white/60 text-sm hover:border-white/30 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <span className="text-white/30 text-xs">
              Step {step + 1} of {TOTAL_STEPS}
            </span>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all cursor-pointer"
            >
              {step === 4 ? "Get My Estimate" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}