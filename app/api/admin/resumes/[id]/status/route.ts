import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { APPLICATION_STATUSES } from "@/lib/types/job-application"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json()

    if (!APPLICATION_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { error } = await (supabase.from("job_applications") as any)
      .update({ status })
      .eq("id", params.id)

    if (error) {
      console.error("Failed to update status:", error)
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Status update error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
