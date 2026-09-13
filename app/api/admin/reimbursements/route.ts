import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { getCurrentEmployee } from "@/lib/auth/current-employee"
import { RECEIPTS_BUCKET } from "@/lib/types/reimbursement"

export async function GET(req: Request) {
  const employee = await getCurrentEmployee()
  if (!employee) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const supabase = getSupabaseAdmin()
  const scope = new URL(req.url).searchParams.get("scope")

  if (scope === "team") {
    if (employee.role !== "admin" && employee.role !== "manager") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    let employeeIds: string[] | null = null
    if (employee.role === "manager") {
      const { data: reports } = await supabase.from("employees").select("id").eq("manager_id", employee.id)
      employeeIds = (reports ?? []).map((r: any) => r.id)
      if (employeeIds.length === 0) return NextResponse.json({ requests: [] })
    }

    let query = supabase.from("reimbursements").select("*").order("created_at", { ascending: false })
    if (employeeIds) query = query.in("employee_id", employeeIds)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: "Failed to load requests" }, { status: 500 })

    const ids = Array.from(new Set((data ?? []).map((r: any) => r.employee_id)))
    const { data: employees } = ids.length
      ? await supabase.from("employees").select("id, full_name, email").in("id", ids)
      : { data: [] }
    const byId = new Map((employees ?? []).map((e: any) => [e.id, e]))

    return NextResponse.json({
      requests: (data ?? []).map((r: any) => ({ ...r, employee: byId.get(r.employee_id) ?? null })),
    })
  }

  const { data, error } = await supabase
    .from("reimbursements")
    .select("*")
    .eq("employee_id", employee.id)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: "Failed to load requests" }, { status: 500 })

  return NextResponse.json({ requests: data })
}

export async function POST(req: Request) {
  const employee = await getCurrentEmployee()
  if (!employee) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const formData = await req.formData()
    const category = formData.get("category")
    const amountPkr = Number(formData.get("amountPkr"))
    const description = formData.get("description")
    const receipt = formData.get("receipt")

    if (
      typeof category !== "string" ||
      !category.trim() ||
      !Number.isFinite(amountPkr) ||
      amountPkr <= 0 ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    let receiptPath: string | null = null

    if (receipt instanceof File && receipt.size > 0) {
      receiptPath = `${employee.id}/${Date.now()}-${crypto.randomUUID()}-${receipt.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`
      const buffer = await receipt.arrayBuffer()
      const { error: uploadError } = await supabase.storage
        .from(RECEIPTS_BUCKET)
        .upload(receiptPath, buffer, { contentType: receipt.type || "application/octet-stream" })

      if (uploadError) {
        console.error("Receipt upload error:", uploadError)
        return NextResponse.json({ error: "Failed to upload receipt" }, { status: 500 })
      }
    }

    const { error } = await supabase.from("reimbursements").insert({
      employee_id: employee.id,
      category: category.trim(),
      amount_pkr: amountPkr,
      description: description.trim(),
      receipt_path: receiptPath,
    } as any)

    if (error) {
      console.error("Failed to create reimbursement:", error)
      return NextResponse.json({ error: "Failed to submit request" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Create reimbursement error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
