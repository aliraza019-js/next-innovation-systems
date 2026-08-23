"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/types/job-application"

export const statusStyles: Record<ApplicationStatus, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  reviewed: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  shortlisted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
}

export function StatusSelect({
  applicationId,
  initialStatus,
  size = "sm",
}: {
  applicationId: string
  initialStatus: ApplicationStatus
  size?: "sm" | "default"
}) {
  const [status, setStatus] = useState<ApplicationStatus>(initialStatus)
  const [saving, setSaving] = useState(false)

  const handleChange = async (value: string) => {
    const next = value as ApplicationStatus
    const prev = status
    setStatus(next)
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/resumes/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) throw new Error("Failed to update")
    } catch {
      setStatus(prev)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Select value={status} onValueChange={handleChange} disabled={saving}>
      <SelectTrigger
        size={size}
        className={`border capitalize ${size === "sm" ? "h-7 w-[130px]" : "w-[180px]"} ${statusStyles[status]} ${saving ? "opacity-60" : ""}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {APPLICATION_STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="capitalize">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
