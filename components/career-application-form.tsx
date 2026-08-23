"use client"

import type React from "react"
import { useRef, useState } from "react"
import { z } from "zod"
import { Loader2, UploadCloud, CheckCircle2, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { TECH_STACKS, type TechStackKey } from "@/lib/careers-data"

const numericField = (message: string) =>
  z
    .string()
    .trim()
    .min(1, "This field is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, message)

const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  university: z.string().trim().min(2, "Enter your university name"),
  experienceYears: numericField("Enter a valid number"),
  currentSalaryPkr: numericField("Enter a valid amount"),
  expectedSalaryPkr: numericField("Enter a valid amount"),
  availableJoinDate: z.string().trim().min(1, "Select a date"),
})

type ApplicationValues = z.infer<typeof applicationSchema>
type FieldErrors = Partial<Record<keyof ApplicationValues, string>>

const STACKS_INITIAL: Record<TechStackKey, boolean> = {
  ruby: false,
  mern: false,
  dotnetAngular: false,
  reactNext: false,
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const inputClass = "border-white/15 bg-white/5 text-white placeholder:text-white/30"

export function CareerApplicationForm({ jobSlug, jobTitle }: { jobSlug: string; jobTitle: string }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [stacks, setStacks] = useState<Record<TechStackKey, boolean>>(STACKS_INITIAL)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileError("")
    if (!file) {
      setResumeFile(null)
      return
    }
    if (file.type !== "application/pdf") {
      setFileError("Please upload a PDF file")
      setResumeFile(null)
      e.target.value = ""
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File must be under 5MB")
      setResumeFile(null)
      e.target.value = ""
      return
    }
    setResumeFile(file)
  }

  // Read straight from the live DOM via FormData at submit time — this is
  // immune to any framework-state desync (browser/extension autofill,
  // fast programmatic filling, etc.) since it reflects exactly what's
  // visible on screen, not a separately tracked React value.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg("")

    const dom = new FormData(e.currentTarget)
    const raw = {
      fullName: String(dom.get("fullName") ?? ""),
      email: String(dom.get("email") ?? ""),
      phone: String(dom.get("phone") ?? ""),
      university: String(dom.get("university") ?? ""),
      experienceYears: String(dom.get("experienceYears") ?? ""),
      currentSalaryPkr: String(dom.get("currentSalaryPkr") ?? ""),
      expectedSalaryPkr: String(dom.get("expectedSalaryPkr") ?? ""),
      availableJoinDate: String(dom.get("availableJoinDate") ?? ""),
    }

    const parsed = applicationSchema.safeParse(raw)

    const missingResume = !resumeFile
    setFileError(missingResume ? "Please attach your resume (PDF)" : "")

    if (!parsed.success) {
      const nextErrors: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ApplicationValues
        if (!nextErrors[key]) nextErrors[key] = issue.message
      }
      setFieldErrors(nextErrors)
      return
    }
    setFieldErrors({})

    if (missingResume) return

    setStatus("loading")

    try {
      const payload = new FormData()
      payload.append("jobSlug", jobSlug)
      payload.append("jobTitle", jobTitle)
      payload.append("fullName", parsed.data.fullName)
      payload.append("email", parsed.data.email)
      payload.append("phone", parsed.data.phone)
      payload.append("university", parsed.data.university)
      payload.append("hasRuby", String(stacks.ruby))
      payload.append("hasMern", String(stacks.mern))
      payload.append("hasDotnetAngular", String(stacks.dotnetAngular))
      payload.append("hasReactNext", String(stacks.reactNext))
      payload.append("experienceYears", parsed.data.experienceYears)
      payload.append("currentSalaryPkr", parsed.data.currentSalaryPkr)
      payload.append("expectedSalaryPkr", parsed.data.expectedSalaryPkr)
      payload.append("availableJoinDate", parsed.data.availableJoinDate)
      payload.append("resume", resumeFile as File)

      const res = await fetch("/api/careers/apply", { method: "POST", body: payload })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")

      setStatus("success")
      formRef.current?.reset()
      setResumeFile(null)
      setStacks(STACKS_INITIAL)
    } catch (err: any) {
      setStatus("error")
      setErrorMsg(err.message || "Failed to submit application")
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-10 text-center">
        <CheckCircle2 className="mb-4 h-10 w-10 text-emerald-400" />
        <h3 className="mb-2 text-xl font-semibold text-white">Application received</h3>
        <p className="max-w-sm text-sm text-white/60">
          Thanks for applying for {jobTitle}. Our team will review your application and reach out if there&apos;s a
          fit.
        </p>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-md sm:p-8"
    >
      <h2 className="mb-6 text-lg font-semibold text-white">Apply for this role</h2>

      {/* Personal info */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full name" error={fieldErrors.fullName}>
          <Input name="fullName" placeholder="Jane Doe" className={inputClass} />
        </Field>
        <Field label="Email" error={fieldErrors.email}>
          <Input type="email" name="email" placeholder="jane@email.com" className={inputClass} />
        </Field>
        <Field label="Phone number" error={fieldErrors.phone}>
          <Input type="tel" name="phone" placeholder="+92 3xx xxxxxxx" className={inputClass} />
        </Field>
        <Field label="University" error={fieldErrors.university}>
          <Input name="university" placeholder="e.g. FAST-NUCES" className={inputClass} />
        </Field>
      </div>

      {/* Tech stacks */}
      <div className="mb-8">
        <Label className="mb-3 block text-white/80">Which stacks do you have work experience in?</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TECH_STACKS.map((stack) => (
            <label
              key={stack.key}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 transition-colors hover:border-white/20"
            >
              <Checkbox
                checked={stacks[stack.key]}
                onCheckedChange={(checked) =>
                  setStacks((prev) => ({ ...prev, [stack.key]: !!checked }))
                }
              />
              {stack.label}
            </label>
          ))}
        </div>
      </div>

      {/* Experience & compensation */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Years of experience" error={fieldErrors.experienceYears}>
          <Input type="number" min={0} step={0.5} name="experienceYears" placeholder="1.5" className={inputClass} />
        </Field>
        <Field label="Available join date" error={fieldErrors.availableJoinDate}>
          <Input type="date" name="availableJoinDate" className={inputClass} />
        </Field>
        <Field label="Current salary (PKR)" error={fieldErrors.currentSalaryPkr}>
          <Input
            type="number"
            min={0}
            step={1000}
            name="currentSalaryPkr"
            placeholder="80000"
            className={inputClass}
          />
        </Field>
        <Field label="Expected salary (PKR)" error={fieldErrors.expectedSalaryPkr}>
          <Input
            type="number"
            min={0}
            step={1000}
            name="expectedSalaryPkr"
            placeholder="120000"
            className={inputClass}
          />
        </Field>
      </div>

      {/* Resume upload */}
      <div className="mb-8">
        <Label className="mb-3 block text-white/80">Resume (PDF, max 5MB)</Label>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.03] px-4 py-8 text-center transition-colors hover:border-emerald-500/40">
          <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
          {resumeFile ? (
            <>
              <FileText className="h-6 w-6 text-emerald-400" />
              <span className="text-sm text-white/80">{resumeFile.name}</span>
              <span className="text-xs text-white/40">Click to replace</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-6 w-6 text-white/40" />
              <span className="text-sm text-white/60">Click to upload your resume</span>
            </>
          )}
        </label>
        {fileError && <p className="mt-2 text-sm text-red-400">{fileError}</p>}
      </div>

      {status === "error" && <p className="mb-4 text-sm text-red-400">{errorMsg}</p>}

      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-emerald-500 py-5 text-black hover:bg-emerald-400 sm:w-auto sm:px-10"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          "Submit application"
        )}
      </Button>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <Label className="mb-2 block text-white/80">{label}</Label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
}
