"use client"

import type React from "react"
import { useState } from "react"
import { Loader2, Upload, FileText } from "lucide-react"
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
import { DOCUMENT_CATEGORIES, type EmployeeDocument, type DocumentCategory } from "@/lib/types/document"
import type { Employee } from "@/lib/types/employee"

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

function categoryLabel(value: string): string {
  return DOCUMENT_CATEGORIES.find((c) => c.value === value)?.label || value
}

function ViewDocumentButton({ documentId }: { documentId: string }) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/documents/${documentId}/file`)
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || "Failed to open")
      window.open(data.url, "_blank", "noopener,noreferrer")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
      View
    </button>
  )
}

export function DocumentsManager({
  initialDocuments,
  employees,
  isAdmin,
  currentEmployeeId,
}: {
  initialDocuments: EmployeeDocument[]
  employees: Pick<Employee, "id" | "full_name" | "email">[]
  isAdmin: boolean
  currentEmployeeId: string
}) {
  const [documents, setDocuments] = useState(initialDocuments)
  const [showForm, setShowForm] = useState(false)
  const [employeeId, setEmployeeId] = useState("")
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<DocumentCategory>("other")
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const employeeName = (id: string) => employees.find((e) => e.id === id)?.full_name || (id === currentEmployeeId ? "You" : id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Please attach a file")
      return
    }
    setSubmitting(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("employeeId", employeeId)
      formData.append("title", title)
      formData.append("category", category)
      formData.append("file", file)

      const res = await fetch("/api/admin/documents", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to upload")

      setDocuments((prev) => [
        {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          employee_id: employeeId,
          title: title.trim(),
          category,
          file_path: "",
          file_name: file.name,
          uploaded_by: currentEmployeeId,
        },
        ...prev,
      ])
      setTitle("")
      setFile(null)
      setEmployeeId("")
      setCategory("other")
      setShowForm(false)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {isAdmin && (
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-white/50">
            {documents.length} document{documents.length === 1 ? "" : "s"}
          </p>
          <Button
            onClick={() => setShowForm((v) => !v)}
            className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
          >
            <Upload className="h-4 w-4" />
            Upload document
          </Button>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-2"
        >
          <div>
            <Label className="mb-2 block text-white/80">Employee</Label>
            <Select value={employeeId} onValueChange={setEmployeeId} required>
              <SelectTrigger className="w-full border-white/15 bg-white/5 text-white">
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block text-white/80">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as DocumentCategory)}>
              <SelectTrigger className="w-full border-white/15 bg-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-2 block text-white/80">Title</Label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Offer Letter — Meerub Fatima"
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-2 block text-white/80">File</Label>
            <Input
              type="file"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="border-white/15 bg-white/5 text-white file:text-white"
            />
          </div>

          {error && <p className="text-sm text-red-400 sm:col-span-2">{error}</p>}

          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={submitting || !employeeId}
              className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Upload
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="py-3.5 text-white/60">Title</TableHead>
              {isAdmin && <TableHead className="py-3.5 text-white/60">Employee</TableHead>}
              <TableHead className="py-3.5 text-white/60">Category</TableHead>
              <TableHead className="py-3.5 text-white/60">Uploaded</TableHead>
              <TableHead className="py-3.5 text-white/60">File</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id} className="border-white/10">
                <TableCell className="py-3.5 font-medium text-white">{doc.title}</TableCell>
                {isAdmin && <TableCell className="py-3.5 text-white/70">{employeeName(doc.employee_id)}</TableCell>}
                <TableCell className="py-3.5">
                  <Badge variant="outline" className="border-white/15 bg-white/5 text-white/70">
                    {categoryLabel(doc.category)}
                  </Badge>
                </TableCell>
                <TableCell className="py-3.5 text-white/50">{formatDate(doc.created_at)}</TableCell>
                <TableCell className="py-3.5">
                  <ViewDocumentButton documentId={doc.id} />
                </TableCell>
              </TableRow>
            ))}

            {documents.length === 0 && (
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableCell colSpan={isAdmin ? 5 : 4} className="py-12 text-center text-white/40">
                  No documents yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
