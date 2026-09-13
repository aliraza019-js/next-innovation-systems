import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/auth/require-role"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const body = await req.json()
    const update: Record<string, unknown> = {}

    if ("assignedTo" in body) {
      update.assigned_to = body.assignedTo || null
      update.status = body.assignedTo ? "assigned" : "available"
    }
    if (body.status === "available" || body.status === "assigned" || body.status === "retired") {
      update.status = body.status
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { error } = await (supabase.from("assets") as any).update(update).eq("id", params.id)

    if (error) {
      console.error("Failed to update asset:", error)
      return NextResponse.json({ error: "Failed to update asset" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Update asset error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
