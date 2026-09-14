"use client"

import type React from "react"
import { useState } from "react"
import { Loader2, UserPlus, Copy, Check, X, Mail, Link2, AlertTriangle, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
import type { Employee } from "@/lib/types/employee"
import type { EmployeeRole } from "@/lib/auth/current-employee"

type DeliveryMethod = "email" | "link" | "password"

type Result = {
  email: string
  method: DeliveryMethod
  password: string | null
  magicLink: string | null
  emailFailed?: boolean
}

function RoleSelect({ employeeId, initialRole }: { employeeId: string; initialRole: EmployeeRole }) {
  const [role, setRole] = useState<EmployeeRole>(initialRole)
  const [saving, setSaving] = useState(false)

  const handleChange = async (value: string) => {
    const next = value as EmployeeRole
    const prev = role
    setRole(next)
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/employees/${employeeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: next }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setRole(prev)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Select value={role} onValueChange={handleChange} disabled={saving}>
      <SelectTrigger size="sm" className="h-7 w-[110px] border-white/15 bg-white/5 text-white capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="employee">Employee</SelectItem>
        <SelectItem value="manager">Manager</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  )
}

function ManagerSelect({
  employeeId,
  initialManagerId,
  options,
}: {
  employeeId: string
  initialManagerId: string | null
  options: Employee[]
}) {
  const [managerId, setManagerId] = useState(initialManagerId ?? "none")
  const [saving, setSaving] = useState(false)

  const handleChange = async (value: string) => {
    const prev = managerId
    setManagerId(value)
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/employees/${employeeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ managerId: value === "none" ? "" : value }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setManagerId(prev)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Select value={managerId} onValueChange={handleChange} disabled={saving}>
      <SelectTrigger size="sm" className="h-7 w-[150px] border-white/15 bg-white/5 text-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">No manager</SelectItem>
        {options
          .filter((e) => e.id !== employeeId && (e.role === "manager" || e.role === "admin"))
          .map((e) => (
            <SelectItem key={e.id} value={e.id}>
              {e.full_name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}

function ActiveToggle({ employeeId, initialActive }: { employeeId: string; initialActive: boolean }) {
  const [active, setActive] = useState(initialActive)
  const [saving, setSaving] = useState(false)

  const handleToggle = async () => {
    const next = !active
    setActive(next)
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/employees/${employeeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: next }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setActive(!next)
    } finally {
      setSaving(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={saving}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
        active
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          : "border-white/15 bg-white/5 text-white/50"
      }`}
    >
      {active ? "Active" : "Deactivated"}
    </button>
  )
}

function DeleteButton({ employeeId, onDeleted }: { employeeId: string; onDeleted: () => void }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setDeleting(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/employees/${employeeId}`, { method: "DELETE" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Failed to delete")
      onDeleted()
    } catch (err: any) {
      setError(err.message || "Failed to delete")
      setDeleting(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50"
        >
          {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
          Confirm
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="rounded-full px-2.5 py-1 text-xs font-medium text-white/50 hover:text-white disabled:opacity-50"
        >
          Cancel
        </button>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-full p-1.5 text-white/40 hover:bg-red-500/10 hover:text-red-400"
      aria-label="Delete employee"
      title="Delete employee"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}

export function EmployeesManager({ initialEmployees }: { initialEmployees: Employee[] }) {
  const [employees, setEmployees] = useState(initialEmployees)
  const [showForm, setShowForm] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<EmployeeRole>("employee")
  const [department, setDepartment] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [phone, setPhone] = useState("")
  const [managerId, setManagerId] = useState<string>("none")
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("email")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    const normalizedEmail = email.trim().toLowerCase()

    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          role,
          department,
          jobTitle,
          phone,
          managerId: managerId === "none" ? null : managerId,
          deliveryMethod,
        }),
      })
      const data = await res.json()

      // The account can be created even when the email invite itself fails
      // to send (Resend hiccup, etc.) — the API still hands back the magic
      // link in that case so the admin isn't stuck without any way in.
      if (!res.ok && !data.magicLink) {
        throw new Error(data.error || "Failed to create employee")
      }

      setResult({
        email: normalizedEmail,
        method: deliveryMethod,
        password: data.tempPassword ?? null,
        magicLink: data.magicLink ?? null,
        emailFailed: !res.ok && !!data.magicLink,
      })
      setEmployees((prev) => [
        {
          id: crypto.randomUUID(),
          full_name: fullName.trim(),
          email: normalizedEmail,
          role,
          department: department.trim() || null,
          manager_id: managerId === "none" ? null : managerId,
          job_title: jobTitle.trim() || null,
          phone: phone.trim() || null,
          start_date: null,
          avatar_url: null,
          active: true,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ])
      setFullName("")
      setEmail("")
      setDepartment("")
      setJobTitle("")
      setPhone("")
      setManagerId("none")
      setRole("employee")
      setDeliveryMethod("email")
      setShowForm(false)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      {result && (
        <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="min-w-0">
            {result.emailFailed ? (
              <>
                <p className="mb-1 flex items-center gap-2 text-sm font-medium text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  Account created, but the invite email failed to send
                </p>
                <p className="mb-2 text-sm text-white/70">Share this link with {result.email} directly instead:</p>
                <code className="block break-all rounded bg-black/40 px-2 py-1.5 font-mono text-xs text-white">
                  {result.magicLink}
                </code>
              </>
            ) : result.password ? (
              <>
                <p className="mb-1 text-sm font-medium text-emerald-400">Account created for {result.email}</p>
                <p className="text-sm text-white/70">
                  Temporary password:{" "}
                  <code className="rounded bg-black/40 px-2 py-0.5 font-mono text-white">{result.password}</code>
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Share this with them directly — it's only shown once. They can log in at /admin/login.
                </p>
              </>
            ) : result.magicLink ? (
              <>
                <p className="mb-1 flex items-center gap-2 text-sm font-medium text-emerald-400">
                  <Link2 className="h-4 w-4" />
                  Magic link ready for {result.email}
                </p>
                <p className="mb-2 text-sm text-white/70">
                  Share this link with them however you like (WhatsApp, chat, etc.) — it lets them set their own
                  password. Single-use, expires after a while.
                </p>
                <code className="block break-all rounded bg-black/40 px-2 py-1.5 font-mono text-xs text-white">
                  {result.magicLink}
                </code>
              </>
            ) : (
              <>
                <p className="mb-1 flex items-center gap-2 text-sm font-medium text-emerald-400">
                  <Mail className="h-4 w-4" />
                  Invite sent to {result.email}
                </p>
                <p className="text-sm text-white/70">
                  They'll get an email with a link to set their own password and log in.
                </p>
              </>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {(result.password || result.magicLink) && (
              <button
                onClick={() => copyToClipboard((result.password || result.magicLink) as string)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
            <button
              onClick={() => setResult(null)}
              className="shrink-0 rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-white/50">
          {employees.length} employee{employees.length === 1 ? "" : "s"}
        </p>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
        >
          <UserPlus className="h-4 w-4" />
          Add employee
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-2"
        >
          <div>
            <Label className="mb-2 block text-white/80">Full name</Label>
            <Input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Meerub Fatima"
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <div>
            <Label className="mb-2 block text-white/80">Email</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="meerub@nextinnovationsystems.com"
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <div>
            <Label className="mb-2 block text-white/80">Job title (optional)</Label>
            <Input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Software Engineer"
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <div>
            <Label className="mb-2 block text-white/80">Phone (optional)</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+92 3xx xxxxxxx"
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <div>
            <Label className="mb-2 block text-white/80">Department (optional)</Label>
            <Input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Engineering"
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <div>
            <Label className="mb-2 block text-white/80">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as EmployeeRole)}>
              <SelectTrigger className="w-full border-white/15 bg-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-2 block text-white/80">Reports to (optional)</Label>
            <Select value={managerId} onValueChange={setManagerId}>
              <SelectTrigger className="w-full border-white/15 bg-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No manager</SelectItem>
                {employees
                  .filter((e) => e.role === "manager" || e.role === "admin")
                  .map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.full_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <Label className="mb-2 block text-white/80">How should they get access?</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {(
                [
                  { value: "email", label: "Email invite", hint: "We email them a link" },
                  { value: "link", label: "Magic link", hint: "Get a link to share yourself" },
                  { value: "password", label: "Temp password", hint: "You set a password now" },
                ] as { value: DeliveryMethod; label: string; hint: string }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDeliveryMethod(opt.value)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    deliveryMethod === opt.value
                      ? "border-emerald-500/40 bg-emerald-500/10 text-white"
                      : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20"
                  }`}
                >
                  <span className="block font-medium">{opt.label}</span>
                  <span className="block text-xs text-white/40">{opt.hint}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-400 sm:col-span-2">{error}</p>}

          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {deliveryMethod === "email" && "Send invite"}
              {deliveryMethod === "link" && "Generate link"}
              {deliveryMethod === "password" && "Create account"}
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="py-3.5 text-white/60">Name</TableHead>
              <TableHead className="py-3.5 text-white/60">Email</TableHead>
              <TableHead className="py-3.5 text-white/60">Department</TableHead>
              <TableHead className="py-3.5 text-white/60">Reports to</TableHead>
              <TableHead className="py-3.5 text-white/60">Role</TableHead>
              <TableHead className="py-3.5 text-white/60">Status</TableHead>
              <TableHead className="w-10 py-3.5" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id} className="border-white/10">
                <TableCell className="py-3.5 font-medium text-white">{emp.full_name}</TableCell>
                <TableCell className="py-3.5 text-white/70">{emp.email}</TableCell>
                <TableCell className="py-3.5 text-white/70">{emp.department || "—"}</TableCell>
                <TableCell className="py-3.5">
                  <ManagerSelect employeeId={emp.id} initialManagerId={emp.manager_id} options={employees} />
                </TableCell>
                <TableCell className="py-3.5">
                  <RoleSelect employeeId={emp.id} initialRole={emp.role} />
                </TableCell>
                <TableCell className="py-3.5">
                  <ActiveToggle employeeId={emp.id} initialActive={emp.active} />
                </TableCell>
                <TableCell className="py-3.5">
                  <DeleteButton
                    employeeId={emp.id}
                    onDeleted={() => setEmployees((prev) => prev.filter((e) => e.id !== emp.id))}
                  />
                </TableCell>
              </TableRow>
            ))}

            {employees.length === 0 && (
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableCell colSpan={7} className="py-12 text-center text-white/40">
                  No employees yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
