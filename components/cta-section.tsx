"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".fade-in-element")
            elements.forEach((element, index) => {
              setTimeout(() => {
                element.classList.add("animate-fade-in-up")
              }, index * 150)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return

    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: "contact" }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setStatus("success")
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => setStatus("idle"), 5000)
    } catch (err: any) {
      setStatus("error")
      setErrorMsg(err.message || "Failed to send")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 px-4 sm:px-6 lg:px-8 mb-32">
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Content */}
          <div className="space-y-8">
            <div className="fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out">
              <span className="text-emerald-500 font-medium tracking-wider uppercase text-sm">Start a Conversation</span>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6 leading-[1.1]">
                Ready to transform? <br />
                <span className="italic font-light text-emerald-500">Let's Get Started.</span>
              </h3>
              <p className="text-lg text-white/70 max-w-lg leading-relaxed">
                Connect with our experts to discuss custom software, cloud, AI/ML, mobile, and DevOps goals. We'll get back to you within 24 hours.
              </p>
            </div>

            <ul className="space-y-4 fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-200">
              {["Free project consultation", "Transparent fixed-price or hourly", "Dedicated communication channel", "Post-launch support included"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side: Form */}
          <div className="fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-300">
            <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">Message Sent!</h4>
                  <p className="text-white/60 max-w-sm">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 ml-1">Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={status === "loading"}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 ml-1">Email Address *</label>
                    <input 
                      type="email" 
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={status === "loading"}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-white/60 ml-1">Message *</label>
                    <textarea 
                      rows={4}
                      placeholder="Tell me about your project, timeline, and budget..."
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      disabled={status === "loading"}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none disabled:opacity-50"
                    />
                  </div>
                  
                  <div className="md:col-span-2 pt-2 space-y-3">
                    <button 
                      type="submit"
                      disabled={status === "loading" || !formData.name || !formData.email || !formData.message}
                      className="group w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-base hover:bg-white transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Let's Talk!
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                    {status === "error" && (
                      <p className="text-red-400 text-sm">{errorMsg}</p>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}