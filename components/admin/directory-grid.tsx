"use client"

import { useMemo, useState } from "react"
import { Search, Mail, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Employee } from "@/lib/types/employee"

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

const roleBadgeClass: Record<string, string> = {
  admin: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  manager: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  employee: "border-white/15 bg-white/5 text-white/60",
}

export function DirectoryGrid({ employees }: { employees: Employee[] }) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return employees
    return employees.filter(
      (e) =>
        e.full_name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.department || "").toLowerCase().includes(q) ||
        (e.job_title || "").toLowerCase().includes(q)
    )
  }, [employees, search])

  return (
    <div>
      <div className="relative mb-6 max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search people…"
          className="border-white/15 bg-white/5 pl-9 text-white placeholder:text-white/30"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((emp) => (
          <div
            key={emp.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-emerald-500/20"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-semibold text-emerald-400">
                {initials(emp.full_name)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{emp.full_name}</p>
                <p className="truncate text-xs text-white/50">{emp.job_title || "—"}</p>
              </div>
            </div>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {emp.department && (
                <Badge variant="outline" className="border-white/15 bg-white/5 text-white/60">
                  {emp.department}
                </Badge>
              )}
              <Badge variant="outline" className={roleBadgeClass[emp.role]}>
                {emp.role}
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs text-white/60">
              <a href={`mailto:${emp.email}`} className="flex items-center gap-2 hover:text-emerald-400">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{emp.email}</span>
              </a>
              {emp.phone && (
                <a href={`tel:${emp.phone}`} className="flex items-center gap-2 hover:text-emerald-400">
                  <Phone className="h-3.5 w-3.5" />
                  {emp.phone}
                </a>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-white/40">No one matches your search.</p>
        )}
      </div>
    </div>
  )
}
