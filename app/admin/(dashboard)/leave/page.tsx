import { redirect } from "next/navigation"
import { getCurrentEmployee } from "@/lib/auth/current-employee"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { LeaveManager } from "@/components/admin/leave-manager"
import type { LeaveRequest } from "@/lib/types/leave-request"

export const dynamic = "force-dynamic"

export default async function LeavePage() {
  const employee = await getCurrentEmployee()
  if (!employee) redirect("/admin/login")

  const supabase = getSupabaseAdmin()
  const canReview = employee.role === "admin" || employee.role === "manager"

  async function fetchTeamRequests(): Promise<(LeaveRequest & { employee: { full_name: string; email: string } | null })[]> {
    if (!canReview) return []

    let employeeIds: string[] | null = null
    if (employee!.role === "manager") {
      const { data: reports } = await supabase.from("employees").select("id").eq("manager_id", employee!.id)
      employeeIds = (reports ?? []).map((r: any) => r.id)
      if (employeeIds.length === 0) return []
    }

    let query = supabase.from("leave_requests").select("*").order("created_at", { ascending: false })
    if (employeeIds) query = query.in("employee_id", employeeIds)
    const { data } = await query

    const ids = Array.from(new Set((data ?? []).map((r: any) => r.employee_id)))
    const { data: employees } = ids.length
      ? await supabase.from("employees").select("id, full_name, email").in("id", ids)
      : { data: [] }
    const byId = new Map((employees ?? []).map((e: any) => [e.id, e]))

    return (data ?? []).map((r: any) => ({ ...r, employee: byId.get(r.employee_id) ?? null }))
  }

  // Independent of each other — fetch concurrently instead of one after another.
  const [{ data: myRequests }, teamRequests] = await Promise.all([
    supabase.from("leave_requests").select("*").eq("employee_id", employee.id).order("created_at", { ascending: false }),
    fetchTeamRequests(),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Leave</h1>
        <p className="mt-1 text-sm text-white/50">Request time off and track approvals.</p>
      </div>

      <LeaveManager
        myRequests={(myRequests ?? []) as LeaveRequest[]}
        teamRequests={teamRequests}
        canReview={canReview}
      />
    </div>
  )
}
