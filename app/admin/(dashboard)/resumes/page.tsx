import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { ResumesTable } from "@/components/admin/resumes-table"
import type { JobApplication } from "@/lib/types/job-application"

export const dynamic = "force-dynamic"

async function getApplications(): Promise<JobApplication[]> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to load job applications:", error)
    return []
  }

  return (data ?? []) as JobApplication[]
}

export default async function AdminResumesPage() {
  const applications = await getApplications()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Resumes</h1>
        <p className="mt-1 text-sm text-white/50">
          {applications.length} application{applications.length === 1 ? "" : "s"} received via the careers page
        </p>
      </div>

      <ResumesTable applications={applications} />
    </div>
  )
}
