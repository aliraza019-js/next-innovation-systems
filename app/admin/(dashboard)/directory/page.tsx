import { redirect } from "next/navigation"
import { getCurrentEmployee } from "@/lib/auth/current-employee"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { DirectoryGrid } from "@/components/admin/directory-grid"
import type { Employee } from "@/lib/types/employee"

export const dynamic = "force-dynamic"

async function getDirectory(): Promise<Employee[]> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("employees")
    .select(
      "id, full_name, email, role, department, manager_id, job_title, phone, start_date, avatar_url, active, created_at"
    )
    .eq("active", true)
    .order("full_name", { ascending: true })

  if (error) {
    console.error("Failed to load directory:", error)
    return []
  }

  return (data ?? []) as Employee[]
}

export default async function DirectoryPage() {
  const employee = await getCurrentEmployee()
  if (!employee) redirect("/admin/login")

  const employees = await getDirectory()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Directory</h1>
        <p className="mt-1 text-sm text-white/50">
          {employees.length} people at Next Innovation Systems
        </p>
      </div>

      <DirectoryGrid employees={employees} />
    </div>
  )
}
