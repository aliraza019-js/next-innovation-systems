import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { getCurrentEmployee } from "@/lib/auth/current-employee"
import { RECEIPTS_BUCKET } from "@/lib/types/reimbursement"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const employee = await getCurrentEmployee()
  if (!employee) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const supabase = getSupabaseAdmin()
  const { data: record, error: fetchError } = await supabase
    .from("reimbursements")
    .select("employee_id, receipt_path")
    .eq("id", params.id)
    .single()

  if (fetchError || !record || !(record as any).receipt_path) {
    return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
  }

  const row = record as { employee_id: string; receipt_path: string }
  const isOwner = row.employee_id === employee.id

  let isReviewer = employee.role === "admin"
  if (!isReviewer && employee.role === "manager") {
    const { data: target } = await supabase.from("employees").select("manager_id").eq("id", row.employee_id).single()
    isReviewer = !!target && (target as any).manager_id === employee.id
  }

  if (!isOwner && !isReviewer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { data, error } = await supabase.storage.from(RECEIPTS_BUCKET).createSignedUrl(row.receipt_path, 60)

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Failed to load receipt" }, { status: 500 })
  }

  return NextResponse.json({ url: data.signedUrl })
}
