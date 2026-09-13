import { redirect } from "next/navigation"
import { getCurrentEmployee } from "@/lib/auth/current-employee"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { DocumentsManager } from "@/components/admin/documents-manager"
import type { EmployeeDocument } from "@/lib/types/document"
import type { Employee } from "@/lib/types/employee"

export const dynamic = "force-dynamic"

export default async function DocumentsPage() {
  const employee = await getCurrentEmployee()
  if (!employee) redirect("/admin/login")

  const supabase = getSupabaseAdmin()

  let query = supabase.from("documents").select("*").order("created_at", { ascending: false })
  if (employee.role !== "admin") {
    query = query.eq("employee_id", employee.id)
  }
  const { data: documents } = await query

  let employees: Pick<Employee, "id" | "full_name" | "email">[] = []
  if (employee.role === "admin") {
    const { data } = await supabase.from("employees").select("id, full_name, email").eq("active", true).order("full_name")
    employees = (data ?? []) as Pick<Employee, "id" | "full_name" | "email">[]
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Documents</h1>
        <p className="mt-1 text-sm text-white/50">
          {employee.role === "admin" ? "Offer letters, contracts, and NDAs for the team." : "Your documents on file."}
        </p>
      </div>

      <DocumentsManager
        initialDocuments={(documents ?? []) as EmployeeDocument[]}
        employees={employees}
        isAdmin={employee.role === "admin"}
        currentEmployeeId={employee.id}
      />
    </div>
  )
}
