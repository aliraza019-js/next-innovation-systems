"use client"

import type React from "react"
import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { ASSET_CATEGORIES, type Asset, type AssetCategory } from "@/lib/types/asset"
import type { Employee } from "@/lib/types/employee"

const statusStyles: Record<string, string> = {
  available: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  assigned: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  retired: "border-white/15 bg-white/5 text-white/50",
}

function AssignSelect({
  asset,
  employees,
}: {
  asset: Asset
  employees: Pick<Employee, "id" | "full_name" | "email">[]
}) {
  const [assignedTo, setAssignedTo] = useState(asset.assigned_to ?? "unassigned")
  const [saving, setSaving] = useState(false)

  const handleChange = async (value: string) => {
    const prev = assignedTo
    setAssignedTo(value)
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/assets/${asset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: value === "unassigned" ? null : value }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setAssignedTo(prev)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Select value={assignedTo} onValueChange={handleChange} disabled={saving}>
      <SelectTrigger size="sm" className="h-7 w-[180px] border-white/15 bg-white/5 text-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned">Unassigned</SelectItem>
        {employees.map((emp) => (
          <SelectItem key={emp.id} value={emp.id}>
            {emp.full_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function AssetsManager({
  initialAssets,
  employees,
}: {
  initialAssets: Asset[]
  employees: Pick<Employee, "id" | "full_name" | "email">[]
}) {
  const [assets, setAssets] = useState(initialAssets)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [category, setCategory] = useState<AssetCategory>("laptop")
  const [serialNumber, setSerialNumber] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/admin/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, serialNumber }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create asset")

      setAssets((prev) => [
        {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          name: name.trim(),
          category,
          serial_number: serialNumber.trim() || null,
          assigned_to: null,
          status: "available",
          notes: null,
        },
        ...prev,
      ])
      setName("")
      setSerialNumber("")
      setCategory("laptop")
      setShowForm(false)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-white/50">
          {assets.length} asset{assets.length === 1 ? "" : "s"}
        </p>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
        >
          <Plus className="h-4 w-4" />
          Add asset
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-3"
        >
          <div>
            <Label className="mb-2 block text-white/80">Name</Label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="MacBook Pro 14 (2024)"
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <div>
            <Label className="mb-2 block text-white/80">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as AssetCategory)}>
              <SelectTrigger className="w-full border-white/15 bg-white/5 text-white capitalize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASSET_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block text-white/80">Serial number (optional)</Label>
            <Input
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>

          {error && <p className="text-sm text-red-400 sm:col-span-3">{error}</p>}

          <div className="sm:col-span-3">
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Add asset
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="py-3.5 text-white/60">Asset</TableHead>
              <TableHead className="py-3.5 text-white/60">Category</TableHead>
              <TableHead className="py-3.5 text-white/60">Serial</TableHead>
              <TableHead className="py-3.5 text-white/60">Assigned to</TableHead>
              <TableHead className="py-3.5 text-white/60">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id} className="border-white/10">
                <TableCell className="py-3.5 font-medium text-white">{asset.name}</TableCell>
                <TableCell className="py-3.5 capitalize text-white/70">{asset.category}</TableCell>
                <TableCell className="py-3.5 text-white/50">{asset.serial_number || "—"}</TableCell>
                <TableCell className="py-3.5">
                  <AssignSelect asset={asset} employees={employees} />
                </TableCell>
                <TableCell className="py-3.5">
                  <Badge variant="outline" className={statusStyles[asset.status]}>
                    {asset.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}

            {assets.length === 0 && (
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableCell colSpan={5} className="py-12 text-center text-white/40">
                  No assets yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
