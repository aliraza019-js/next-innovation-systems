import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth/require-role"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { EmployeesManager } from "@/components/admin/employees-manager"
import type { Employee } from "@/lib/types/employee"

export const dynamic = "force-dynamic"

async function getEmployees(): Promise<Employee[]> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("employees")
    .select(
      "id, full_name, email, role, department, manager_id, job_title, phone, start_date, avatar_url, active, created_at"
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to load employees:", error)
    return []
  }

  return (data ?? []) as Employee[]
}

export default async function AdminEmployeesPage() {
  const admin = await requireAdmin()
  if (!admin) redirect("/admin/mail")

  const employees = await getEmployees()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Employees</h1>
        <p className="mt-1 text-sm text-white/50">Manage portal access for your team.</p>
      </div>

      <EmployeesManager initialEmployees={employees} />
    </div>
  )
}
