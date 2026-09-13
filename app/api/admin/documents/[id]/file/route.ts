import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { getCurrentEmployee } from "@/lib/auth/current-employee"
import { DOCUMENTS_BUCKET } from "@/lib/types/document"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const employee = await getCurrentEmployee()
  if (!employee) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const supabase = getSupabaseAdmin()
  const { data: doc, error: fetchError } = await supabase
    .from("documents")
    .select("employee_id, file_path")
    .eq("id", params.id)
    .single()

  if (fetchError || !doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  const record = doc as { employee_id: string; file_path: string }

  if (employee.role !== "admin" && record.employee_id !== employee.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { data, error } = await supabase.storage.from(DOCUMENTS_BUCKET).createSignedUrl(record.file_path, 60)

  if (error || !data?.signedUrl) {
    console.error("Failed to sign document URL:", error)
    return NextResponse.json({ error: "Failed to load document" }, { status: 500 })
  }

  return NextResponse.json({ url: data.signedUrl })
}
