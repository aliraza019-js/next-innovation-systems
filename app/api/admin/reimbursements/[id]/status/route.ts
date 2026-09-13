import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { requireManagerOrAdmin } from "@/lib/auth/require-role"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const reviewer = await requireManagerOrAdmin()
  if (!reviewer) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { status } = await req.json()
    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    const { data: reimbursement, error: fetchError } = await supabase
      .from("reimbursements")
      .select("employee_id")
      .eq("id", params.id)
      .single()

    if (fetchError || !reimbursement) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    if (reviewer.role === "manager") {
      const { data: target } = await supabase
        .from("employees")
        .select("manager_id")
        .eq("id", (reimbursement as any).employee_id)
        .single()

      if (!target || (target as any).manager_id !== reviewer.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    }

    const { error } = await (supabase.from("reimbursements") as any)
      .update({ status, reviewed_by: reviewer.id, reviewed_at: new Date().toISOString() })
      .eq("id", params.id)

    if (error) {
      console.error("Failed to update reimbursement:", error)
      return NextResponse.json({ error: "Failed to update request" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Update reimbursement error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
