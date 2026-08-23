"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, ArrowUpRight } from "lucide-react"
import { Input } from "@/components/ui/input"
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
import { StatusSelect } from "@/components/admin/status-select"
import { APPLICATION_STATUSES, type ApplicationStatus, type JobApplication } from "@/lib/types/job-application"

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function ResumesTable({ applications }: { applications: JobApplication[] }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return applications.filter((app) => {
      const matchesStatus = statusFilter === "all" || app.status === statusFilter
      const matchesSearch =
        !q ||
        app.full_name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.university.toLowerCase().includes(q) ||
        app.job_title.toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [applications, search, statusFilter])

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, university…"
            className="border-white/15 bg-white/5 pl-9 text-white placeholder:text-white/30"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ApplicationStatus | "all")}>
          <SelectTrigger className="w-full border-white/15 bg-white/5 text-white sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {APPLICATION_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="py-3.5 text-white/60">Candidate</TableHead>
              <TableHead className="py-3.5 text-white/60">Position</TableHead>
              <TableHead className="py-3.5 text-white/60">University</TableHead>
              <TableHead className="py-3.5 text-white/60">Applied</TableHead>
              <TableHead className="py-3.5 text-white/60">Status</TableHead>
              <TableHead className="w-10 py-3.5" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((app) => (
              <TableRow key={app.id} className="relative border-white/10 cursor-pointer">
                <TableCell className="whitespace-normal py-3.5">
                  <Link
                    href={`/admin/resumes/${app.id}`}
                    className="absolute inset-0"
                    aria-label={`View ${app.full_name}'s application`}
                  />
                  <div className="font-medium text-white">{app.full_name}</div>
                  <div className="text-xs text-white/50">{app.email}</div>
                </TableCell>
                <TableCell className="whitespace-normal py-3.5 text-white/80">{app.job_title}</TableCell>
                <TableCell className="whitespace-normal py-3.5 text-white/80">{app.university}</TableCell>
                <TableCell className="py-3.5 text-white/60">{formatDate(app.created_at)}</TableCell>
                <TableCell className="relative py-3.5">
                  <StatusSelect applicationId={app.id} initialStatus={app.status} />
                </TableCell>
                <TableCell className="relative py-3.5 text-white/30">
                  <ArrowUpRight className="h-4 w-4" />
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableCell colSpan={6} className="py-12 text-center text-white/40">
                  No applications match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
