"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, KeyRound } from "lucide-react"
import { NisLogoDark } from "@/components/nis-logo-dark"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export default function AcceptInvitePage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Supabase's client SDK automatically reads the access/refresh tokens
    // out of the invite link's URL (a hash fragment the server never sees)
    // and turns them into a real session on load — that's what getSession()
    // picks up here.
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session)
      setEmail(session?.user?.email ?? "")
      setChecking(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    setSubmitting(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError

      router.replace("/admin/mail")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Something went wrong")
      setSubmitting(false)
    }
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </main>
    )
  }

  if (!hasSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/5 p-8 text-center">
          <h1 className="mb-2 text-xl font-semibold text-white">Invite link expired</h1>
          <p className="text-sm text-white/50">
            This invite link is no longer valid — invite links only work once and expire after a while. Ask your
            admin to send you a new one.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-24">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-md sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <NisLogoDark className="mb-6 h-9 w-auto" />
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold text-white">Welcome to Next Innovation Systems</h1>
            {email && (
              <p className="mt-1 text-sm text-white/50">
                Set a password for <span className="text-white/80">{email}</span>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">
                New password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white/80">
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-emerald-500 py-5 text-black hover:bg-emerald-400"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Setting password…
                </>
              ) : (
                "Set password & continue"
              )}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
