import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { getCurrentEmployee } from "@/lib/auth/current-employee"
import { DOCUMENT_CATEGORIES, DOCUMENTS_BUCKET } from "@/lib/types/document"

export async function GET() {
  const employee = await getCurrentEmployee()
  if (!employee) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const supabase = getSupabaseAdmin()
  let query = supabase.from("documents").select("*").order("created_at", { ascending: false })

  // Admins see every document; everyone else only sees their own.
  if (employee.role !== "admin") {
    query = query.eq("employee_id", employee.id)
  }

  const { data, error } = await query

  if (error) {
    console.error("Failed to list documents:", error)
    return NextResponse.json({ error: "Failed to load documents" }, { status: 500 })
  }

  return NextResponse.json({ documents: data })
}

export async function POST(req: Request) {
  const employee = await getCurrentEmployee()
  if (!employee || employee.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const employeeId = formData.get("employeeId")
    const title = formData.get("title")
    const category = formData.get("category")
    const file = formData.get("file")

    const categoryValue = DOCUMENT_CATEGORIES.some((c) => c.value === category) ? (category as string) : "other"

    if (typeof employeeId !== "string" || !employeeId || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Employee and title are required" }, { status: 400 })
    }
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Please attach a file" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const storagePath = `${employeeId}/${Date.now()}-${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`
    const buffer = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .upload(storagePath, buffer, { contentType: file.type || "application/octet-stream" })

    if (uploadError) {
      console.error("Document upload error:", uploadError)
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    const { error: insertError } = await supabase.from("documents").insert({
      employee_id: employeeId,
      title: title.trim(),
      category: categoryValue,
      file_path: storagePath,
      file_name: file.name,
      uploaded_by: employee.id,
    } as any)

    if (insertError) {
      console.error("Document insert error:", insertError)
      await supabase.storage.from(DOCUMENTS_BUCKET).remove([storagePath])
      return NextResponse.json({ error: "Failed to save document" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Upload document error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
