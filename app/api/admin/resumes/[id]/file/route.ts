import { NextResponse } from "next/server"
import { getSupabaseAdmin, RESUMES_BUCKET } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/auth/require-role"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const supabase = getSupabaseAdmin()

    const { data: application, error: fetchError } = await supabase
      .from("job_applications")
      .select("resume_path")
      .eq("id", params.id)
      .single()

    if (fetchError || !application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const resumePath = (application as { resume_path: string }).resume_path

    const { data, error } = await supabase.storage.from(RESUMES_BUCKET).createSignedUrl(resumePath, 60)

    if (error || !data?.signedUrl) {
      console.error("Failed to create signed URL:", error)
      return NextResponse.json({ error: "Failed to load resume" }, { status: 500 })
    }

    return NextResponse.json({ url: data.signedUrl })
  } catch (error: any) {
    console.error("Resume file error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
