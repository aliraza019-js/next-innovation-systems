import { redirect } from "next/navigation"
import { getCurrentEmployee } from "@/lib/auth/current-employee"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { ReimbursementsManager } from "@/components/admin/reimbursements-manager"
import type { Reimbursement } from "@/lib/types/reimbursement"

export const dynamic = "force-dynamic"

export default async function ReimbursementsPage() {
  const employee = await getCurrentEmployee()
  if (!employee) redirect("/admin/login")

  const supabase = getSupabaseAdmin()

  const { data: myRequests } = await supabase
    .from("reimbursements")
    .select("*")
    .eq("employee_id", employee.id)
    .order("created_at", { ascending: false })

  const canReview = employee.role === "admin" || employee.role === "manager"

  let teamRequests: (Reimbursement & { employee: { full_name: string; email: string } | null })[] = []
  if (canReview) {
    let employeeIds: string[] | null = null
    if (employee.role === "manager") {
      const { data: reports } = await supabase.from("employees").select("id").eq("manager_id", employee.id)
      employeeIds = (reports ?? []).map((r: any) => r.id)
    }

    if (!employeeIds || employeeIds.length > 0) {
      let query = supabase.from("reimbursements").select("*").order("created_at", { ascending: false })
      if (employeeIds) query = query.in("employee_id", employeeIds)
      const { data } = await query

      const ids = Array.from(new Set((data ?? []).map((r: any) => r.employee_id)))
      const { data: employees } = ids.length
        ? await supabase.from("employees").select("id, full_name, email").in("id", ids)
        : { data: [] }
      const byId = new Map((employees ?? []).map((e: any) => [e.id, e]))

      teamRequests = (data ?? []).map((r: any) => ({ ...r, employee: byId.get(r.employee_id) ?? null }))
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Reimbursements</h1>
        <p className="mt-1 text-sm text-white/50">Submit expenses and track approvals.</p>
      </div>

      <ReimbursementsManager
        myRequests={(myRequests ?? []) as Reimbursement[]}
        teamRequests={teamRequests}
        canReview={canReview}
      />
    </div>
  )
}
