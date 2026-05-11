"use client"
import React, { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { NisLogoDark } from "@/components/nis-logo-dark"
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
  Mail,
  MapPin,
  Phone,
  ChevronRight,
  Loader2,
  CheckCircle2
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "query" }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setStatus("success")
      setEmail("")
      setTimeout(() => setStatus("idle"), 4000)
    } catch (err: any) {
      setStatus("error")
      setErrorMsg(err.message || "Failed to send")
      setTimeout(() => setStatus("idle"), 4000)
    }
  }

  return (
    <footer className="w-full bg-[#0a0a0a] text-white pt-20 pb-10 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/"
                aria-label="Next Innovation Systems home"
                className="inline-block mb-6"
              >
                <NisLogoDark className="h-9 w-auto md:h-10 block" />
              </Link>

              <form onSubmit={handleSubmit} className="relative max-w-md group">
                <div className="flex items-center bg-[#141414] border border-white/10 rounded-2xl overflow-hidden focus-within:border-emerald-500/50 transition-all duration-300 shadow-2xl">
                  <div className="pl-4 text-white/40">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "loading"}
                    className="w-full bg-transparent py-4 px-3 outline-none text-sm placeholder:text-white/20 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading" || !email}
                    className="bg-white hover:bg-white text-black px-6 py-4 font-bold text-sm flex items-center gap-2 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : status === "success" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <>
                        For Query
                        <ChevronRight size={18} />
                      </>
                    )}
                  </button>
                </div>
                {status === "success" && (
                  <p className="text-emerald-400 text-xs mt-2 ml-1">Query sent successfully! We'll get back to you soon.</p>
                )}
                {status === "error" && (
                  <p className="text-red-400 text-xs mt-2 ml-1">{errorMsg}</p>
                )}
              </form>
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>

              <ul className="flex flex-col gap-3 text-white/60">
                {["Services", "Projects", "About Us", "Contact", "Privacy"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-emerald-500 transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-semibold mb-6">Address</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 text-white/60">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <MapPin size={20} />
                  </div>
                  <p className="text-sm pt-1 leading-relaxed">Lahore, Punjab Pakistan</p>
                </div>
                <div className="flex items-center gap-4 text-white/60">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <Mail size={20} />
                  </div>
                  <p className="text-sm">contact@nextinnovation.systems</p>
                </div>
                <div className="flex items-center gap-4 text-white/60">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <Phone size={20} />
                  </div>
                  <p className="text-sm">+92 (300) 0000000</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-xs tracking-widest uppercase">
            © {currentYear} Next Innovation Systems. All rights reserved.
          </p>



          <p className="text-white/40 text-xs font-medium uppercase tracking-[0.2em]">
            Professional IT Solutions
          </p>


          <div className="flex items-center gap-6">
            {[FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon].map((Icon, i) => (
              <a key={i} href="#" className="text-white/40 hover:text-emerald-500 transition-colors">
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}