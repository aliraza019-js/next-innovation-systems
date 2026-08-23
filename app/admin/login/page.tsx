"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, Lock, ArrowLeft } from "lucide-react"
import { NisLogoDark } from "@/components/nis-logo-dark"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Aurora from "@/components/Aurora"

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Invalid email or password")
      }

      const from = searchParams.get("from")
      router.replace(from && from.startsWith("/admin") ? from : "/admin")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-24">
      <div className="fixed inset-0 z-0 h-full w-full pointer-events-none">
        <Aurora colorStops={["#00382d", "#006a54", "#0b3f35"]} amplitude={1.0} blend={0.5} speed={0.6} />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>

        <div className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-md sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <NisLogoDark className="mb-6 h-9 w-auto" />
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-white/50">Sign in to view job applications</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@nexinsystems.com"
                className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-emerald-500 py-5 text-black hover:bg-emerald-400"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  )
}
