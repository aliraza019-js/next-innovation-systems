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

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const targetId = params.id

  if (targetId === admin.id) {
    return NextResponse.json({ error: "You can't delete your own account" }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  try {
    const { data: target, error: targetError } = await supabase
      .from("employees")
      .select("role")
      .eq("id", targetId)
      .single()

    if (targetError || !target) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    if ((target as any).role === "admin") {
      const { count } = await supabase
        .from("employees")
        .select("id", { count: "exact", head: true })
        .eq("role", "admin")
      if ((count ?? 0) <= 1) {
        return NextResponse.json({ error: "Can't delete the last remaining admin" }, { status: 400 })
      }
    }

    // These reference employees.id WITHOUT "on delete cascade" (unlike
    // employee_id on their own records, e.g. leave_requests, which cascade
    // correctly as "this employee's stuff") — deleting the row below would
    // otherwise fail on a foreign key violation wherever this employee is
    // referenced as someone else's manager, reviewer, uploader, etc.
    // Clearing them to null preserves those other records' history instead
    // of blocking the delete or cascading it somewhere it shouldn't.
    await Promise.all([
      (supabase.from("employees") as any).update({ manager_id: null }).eq("manager_id", targetId),
      (supabase.from("leave_requests") as any).update({ reviewed_by: null }).eq("reviewed_by", targetId),
      (supabase.from("reimbursements") as any).update({ reviewed_by: null }).eq("reviewed_by", targetId),
      (supabase.from("assets") as any).update({ assigned_to: null, status: "available" }).eq("assigned_to", targetId),
      (supabase.from("leads") as any).update({ assigned_to: null }).eq("assigned_to", targetId),
      // These two columns are NOT NULL (unlike the ones above), so they
      // can't just be cleared — reassign to the admin doing the deletion
      // instead, preserving the record rather than losing it or blocking
      // the delete on a constraint violation.
      (supabase.from("documents") as any).update({ uploaded_by: admin.id }).eq("uploaded_by", targetId),
      (supabase.from("announcements") as any).update({ created_by: admin.id }).eq("created_by", targetId),
    ])

    const { error: deleteError } = await supabase.from("employees").delete().eq("id", targetId)
    if (deleteError) {
      console.error("Failed to delete employee row:", deleteError)
      return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 })
    }

    // Removing the underlying auth account (not just the profile row) is
    // what frees the email address up to be used again for a new invite.
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(targetId)
    if (authDeleteError) {
      console.error("Failed to delete auth user (employee row already removed):", authDeleteError)
      return NextResponse.json(
        { error: "Employee removed, but their login couldn't be fully deleted — contact support if this repeats." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Delete employee error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
