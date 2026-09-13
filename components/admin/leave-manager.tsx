"use client"

import type React from "react"
import { useState } from "react"
import { Loader2, Plus, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LEAVE_TYPES, type LeaveRequest, type LeaveType, type RequestStatus } from "@/lib/types/leave-request"

const statusStyles: Record<RequestStatus, string> = {
  pending: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  approved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  rejected: "border-red-500/20 bg-red-500/10 text-red-400",
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

function leaveTypeLabel(value: string): string {
  return LEAVE_TYPES.find((t) => t.value === value)?.label || value
}

function RequestForm({ onCreated }: { onCreated: (r: LeaveRequest) => void }) {
  const [leaveType, setLeaveType] = useState<LeaveType>("annual")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/admin/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leaveType, startDate, endDate, reason }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to submit")

      onCreated({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        employee_id: "",
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason: reason.trim(),
        status: "pending",
        reviewed_by: null,
        reviewed_at: null,
      })
      setStartDate("")
      setEndDate("")
      setReason("")
      setLeaveType("annual")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-2"
    >
      <div>
        <Label className="mb-2 block text-white/80">Leave type</Label>
        <Select value={leaveType} onValueChange={(v) => setLeaveType(v as LeaveType)}>
          <SelectTrigger className="w-full border-white/15 bg-white/5 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LEAVE_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block text-white/80">Start date</Label>
          <Input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border-white/15 bg-white/5 text-white"
          />
        </div>
        <div>
          <Label className="mb-2 block text-white/80">End date</Label>
          <Input
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border-white/15 bg-white/5 text-white"
          />
        </div>
      </div>
      <div className="sm:col-span-2">
        <Label className="mb-2 block text-white/80">Reason</Label>
        <Textarea
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
        />
      </div>

      {error && <p className="text-sm text-red-400 sm:col-span-2">{error}</p>}

      <div className="sm:col-span-2">
        <Button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Submit request
        </Button>
      </div>
    </form>
  )
}

function ReviewButtons({ requestId, onReviewed }: { requestId: string; onReviewed: (status: RequestStatus) => void }) {
  const [loading, setLoading] = useState<"approved" | "rejected" | null>(null)

  const review = async (status: "approved" | "rejected") => {
    setLoading(status)
    try {
      const res = await fetch(`/api/admin/leave/${requestId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      onReviewed(status)
    } catch {
      // no-op — button just stays clickable to retry
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => review("approved")}
        disabled={loading !== null}
        className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50"
      >
        {loading === "approved" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
        Approve
      </button>
      <button
        onClick={() => review("rejected")}
        disabled={loading !== null}
        className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50"
      >
        {loading === "rejected" ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
        Reject
      </button>
    </div>
  )
}

export function LeaveManager({
  myRequests,
  teamRequests,
  canReview,
}: {
  myRequests: LeaveRequest[]
  teamRequests: (LeaveRequest & { employee: { full_name: string; email: string } | null })[]
  canReview: boolean
}) {
  const [tab, setTab] = useState<"mine" | "team">("mine")
  const [mine, setMine] = useState(myRequests)
  const [team, setTeam] = useState(teamRequests)
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      {canReview && (
        <div className="mb-6 flex items-center gap-1">
          <button
            onClick={() => setTab("mine")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === "mine" ? "bg-emerald-500/10 text-emerald-400" : "text-white/60 hover:text-white"
            }`}
          >
            My Requests
          </button>
          <button
            onClick={() => setTab("team")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === "team" ? "bg-emerald-500/10 text-emerald-400" : "text-white/60 hover:text-white"
            }`}
          >
            Team Requests
            {team.filter((r) => r.status === "pending").length > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-400">
                {team.filter((r) => r.status === "pending").length}
              </span>
            )}
          </button>
        </div>
      )}

      {tab === "mine" ? (
        <div>
          <div className="mb-6 flex justify-end">
            <Button
              onClick={() => setShowForm((v) => !v)}
              className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
            >
              <Plus className="h-4 w-4" />
              Request leave
            </Button>
          </div>

          {showForm && (
            <RequestForm
              onCreated={(r) => {
                setMine((prev) => [r, ...prev])
                setShowForm(false)
              }}
            />
          )}

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="py-3.5 text-white/60">Type</TableHead>
                  <TableHead className="py-3.5 text-white/60">Dates</TableHead>
                  <TableHead className="py-3.5 text-white/60">Reason</TableHead>
                  <TableHead className="py-3.5 text-white/60">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mine.map((r) => (
                  <TableRow key={r.id} className="border-white/10">
                    <TableCell className="py-3.5 capitalize text-white">{leaveTypeLabel(r.leave_type)}</TableCell>
                    <TableCell className="py-3.5 text-white/70">
                      {formatDate(r.start_date)} – {formatDate(r.end_date)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate py-3.5 text-white/50">{r.reason}</TableCell>
                    <TableCell className="py-3.5">
                      <Badge variant="outline" className={statusStyles[r.status]}>
                        {r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {mine.length === 0 && (
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableCell colSpan={4} className="py-12 text-center text-white/40">
                      No leave requests yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="py-3.5 text-white/60">Employee</TableHead>
                <TableHead className="py-3.5 text-white/60">Type</TableHead>
                <TableHead className="py-3.5 text-white/60">Dates</TableHead>
                <TableHead className="py-3.5 text-white/60">Reason</TableHead>
                <TableHead className="py-3.5 text-white/60">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((r) => (
                <TableRow key={r.id} className="border-white/10">
                  <TableCell className="py-3.5 font-medium text-white">{r.employee?.full_name || "—"}</TableCell>
                  <TableCell className="py-3.5 capitalize text-white/70">{leaveTypeLabel(r.leave_type)}</TableCell>
                  <TableCell className="py-3.5 text-white/70">
                    {formatDate(r.start_date)} – {formatDate(r.end_date)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate py-3.5 text-white/50">{r.reason}</TableCell>
                  <TableCell className="py-3.5">
                    {r.status === "pending" ? (
                      <ReviewButtons
                        requestId={r.id}
                        onReviewed={(status) =>
                          setTeam((prev) => prev.map((x) => (x.id === r.id ? { ...x, status } : x)))
                        }
                      />
                    ) : (
                      <Badge variant="outline" className={statusStyles[r.status]}>
                        {r.status}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {team.length === 0 && (
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableCell colSpan={5} className="py-12 text-center text-white/40">
                    No requests from your team.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
