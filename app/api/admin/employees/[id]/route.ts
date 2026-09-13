import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/auth/require-role"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const body = await req.json()
    const update: Record<string, unknown> = {}

    if (typeof body.active === "boolean") update.active = body.active
    if (body.role === "admin" || body.role === "manager" || body.role === "employee") update.role = body.role
    if (typeof body.department === "string") update.department = body.department.trim() || null
    if (typeof body.jobTitle === "string") update.job_title = body.jobTitle.trim() || null
    if (typeof body.phone === "string") update.phone = body.phone.trim() || null
    if (typeof body.managerId === "string") update.manager_id = body.managerId || null
    if (typeof body.startDate === "string") update.start_date = body.startDate || null

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { error } = await (supabase.from("employees") as any).update(update).eq("id", params.id)

    if (error) {
      console.error("Failed to update employee:", error)
      return NextResponse.json({ error: "Failed to update employee" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Update employee error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
