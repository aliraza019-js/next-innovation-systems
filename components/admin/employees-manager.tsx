"use client"

import type React from "react"
import { useState } from "react"
import { Loader2, UserPlus, Copy, Check, X } from "lucide-react"
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
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [tempPassword, setTempPassword] = useState<{ email: string; password: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

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
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create employee")

      setTempPassword({ email: email.trim().toLowerCase(), password: data.tempPassword })
      setEmployees((prev) => [
        {
          id: crypto.randomUUID(),
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
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
      setShowForm(false)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  const copyPassword = () => {
    if (!tempPassword) return
    navigator.clipboard.writeText(tempPassword.password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      {tempPassword && (
        <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div>
            <p className="mb-1 text-sm font-medium text-emerald-400">Account created for {tempPassword.email}</p>
            <p className="text-sm text-white/70">
              Temporary password:{" "}
              <code className="rounded bg-black/40 px-2 py-0.5 font-mono text-white">{tempPassword.password}</code>
            </p>
            <p className="mt-1 text-xs text-white/40">
              Share this with them directly — it's only shown once. They can log in at /admin/login.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={copyPassword}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={() => setTempPassword(null)}
              className="rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
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

          {error && <p className="text-sm text-red-400 sm:col-span-2">{error}</p>}

          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Create account
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
              </TableRow>
            ))}

            {employees.length === 0 && (
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableCell colSpan={6} className="py-12 text-center text-white/40">
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
