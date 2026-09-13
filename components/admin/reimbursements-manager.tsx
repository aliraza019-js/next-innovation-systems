"use client"

import type React from "react"
import { useState } from "react"
import { Loader2, Plus, Check, X, Receipt } from "lucide-react"
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
import { REIMBURSEMENT_CATEGORIES, type Reimbursement } from "@/lib/types/reimbursement"
import type { RequestStatus } from "@/lib/types/leave-request"

const statusStyles: Record<RequestStatus, string> = {
  pending: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  approved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  rejected: "border-red-500/20 bg-red-500/10 text-red-400",
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

function formatPkr(amount: number): string {
  return `PKR ${Math.round(amount).toLocaleString("en-PK")}`
}

function ReceiptButton({ reimbursementId }: { reimbursementId: string }) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/reimbursements/${reimbursementId}/receipt`)
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error()
      window.open(data.url, "_blank", "noopener,noreferrer")
    } catch {
      // no-op
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/70 hover:bg-white/10 disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Receipt className="h-3 w-3" />}
      Receipt
    </button>
  )
}

function RequestForm({ onCreated }: { onCreated: (r: Reimbursement) => void }) {
  const [category, setCategory] = useState(REIMBURSEMENT_CATEGORIES[0])
  const [amountPkr, setAmountPkr] = useState("")
  const [description, setDescription] = useState("")
  const [receipt, setReceipt] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("category", category)
      formData.append("amountPkr", amountPkr)
      formData.append("description", description)
      if (receipt) formData.append("receipt", receipt)

      const res = await fetch("/api/admin/reimbursements", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to submit")

      onCreated({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        employee_id: "",
        category,
        amount_pkr: Number(amountPkr),
        description: description.trim(),
        receipt_path: receipt ? "pending" : null,
        status: "pending",
        reviewed_by: null,
        reviewed_at: null,
      })
      setAmountPkr("")
      setDescription("")
      setReceipt(null)
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
        <Label className="mb-2 block text-white/80">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full border-white/15 bg-white/5 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REIMBURSEMENT_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="mb-2 block text-white/80">Amount (PKR)</Label>
        <Input
          type="number"
          min={0}
          step={100}
          required
          value={amountPkr}
          onChange={(e) => setAmountPkr(e.target.value)}
          className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
        />
      </div>
      <div className="sm:col-span-2">
        <Label className="mb-2 block text-white/80">Description</Label>
        <Textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
        />
      </div>
      <div className="sm:col-span-2">
        <Label className="mb-2 block text-white/80">Receipt (optional)</Label>
        <Input
          type="file"
          onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
          className="border-white/15 bg-white/5 text-white file:text-white"
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

function ReviewButtons({
  requestId,
  onReviewed,
}: {
  requestId: string
  onReviewed: (status: RequestStatus) => void
}) {
  const [loading, setLoading] = useState<"approved" | "rejected" | null>(null)

  const review = async (status: "approved" | "rejected") => {
    setLoading(status)
    try {
      const res = await fetch(`/api/admin/reimbursements/${requestId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      onReviewed(status)
    } catch {
      // no-op
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

export function ReimbursementsManager({
  myRequests,
  teamRequests,
  canReview,
}: {
  myRequests: Reimbursement[]
  teamRequests: (Reimbursement & { employee: { full_name: string; email: string } | null })[]
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
              Submit expense
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
                  <TableHead className="py-3.5 text-white/60">Category</TableHead>
                  <TableHead className="py-3.5 text-white/60">Amount</TableHead>
                  <TableHead className="py-3.5 text-white/60">Description</TableHead>
                  <TableHead className="py-3.5 text-white/60">Receipt</TableHead>
                  <TableHead className="py-3.5 text-white/60">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mine.map((r) => (
                  <TableRow key={r.id} className="border-white/10">
                    <TableCell className="py-3.5 text-white">{r.category}</TableCell>
                    <TableCell className="py-3.5 text-white/70">{formatPkr(r.amount_pkr)}</TableCell>
                    <TableCell className="max-w-xs truncate py-3.5 text-white/50">{r.description}</TableCell>
                    <TableCell className="py-3.5">
                      {r.receipt_path ? <ReceiptButton reimbursementId={r.id} /> : <span className="text-white/30">—</span>}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <Badge variant="outline" className={statusStyles[r.status]}>
                        {r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {mine.length === 0 && (
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableCell colSpan={5} className="py-12 text-center text-white/40">
                      No reimbursement requests yet.
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
                <TableHead className="py-3.5 text-white/60">Category</TableHead>
                <TableHead className="py-3.5 text-white/60">Amount</TableHead>
                <TableHead className="py-3.5 text-white/60">Receipt</TableHead>
                <TableHead className="py-3.5 text-white/60">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((r) => (
                <TableRow key={r.id} className="border-white/10">
                  <TableCell className="py-3.5 font-medium text-white">{r.employee?.full_name || "—"}</TableCell>
                  <TableCell className="py-3.5 text-white/70">{r.category}</TableCell>
                  <TableCell className="py-3.5 text-white/70">{formatPkr(r.amount_pkr)}</TableCell>
                  <TableCell className="py-3.5">
                    {r.receipt_path ? <ReceiptButton reimbursementId={r.id} /> : <span className="text-white/30">—</span>}
                  </TableCell>
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
