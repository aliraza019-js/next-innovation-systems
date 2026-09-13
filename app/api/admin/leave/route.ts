import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { getCurrentEmployee } from "@/lib/auth/current-employee"
import { LEAVE_TYPES } from "@/lib/types/leave-request"

async function attachEmployeeNames(supabase: ReturnType<typeof getSupabaseAdmin>, rows: any[]) {
  const ids = Array.from(new Set(rows.map((r) => r.employee_id)))
  if (ids.length === 0) return rows
  const { data: employees } = await supabase.from("employees").select("id, full_name, email").in("id", ids)
  const byId = new Map((employees ?? []).map((e: any) => [e.id, e]))
  return rows.map((r) => ({ ...r, employee: byId.get(r.employee_id) ?? null }))
}

export async function GET(req: Request) {
  const employee = await getCurrentEmployee()
  if (!employee) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const supabase = getSupabaseAdmin()
  const scope = new URL(req.url).searchParams.get("scope")

  if (scope === "team") {
    if (employee.role !== "admin" && employee.role !== "manager") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    let employeeIds: string[] | null = null
    if (employee.role === "manager") {
      const { data: reports } = await supabase.from("employees").select("id").eq("manager_id", employee.id)
      employeeIds = (reports ?? []).map((r: any) => r.id)
      if (employeeIds.length === 0) return NextResponse.json({ requests: [] })
    }

    let query = supabase.from("leave_requests").select("*").order("created_at", { ascending: false })
    if (employeeIds) query = query.in("employee_id", employeeIds)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: "Failed to load requests" }, { status: 500 })

    return NextResponse.json({ requests: await attachEmployeeNames(supabase, data ?? []) })
  }

  const { data, error } = await supabase
    .from("leave_requests")
    .select("*")
    .eq("employee_id", employee.id)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: "Failed to load requests" }, { status: 500 })

  return NextResponse.json({ requests: data })
}

export async function POST(req: Request) {
  const employee = await getCurrentEmployee()
  if (!employee) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { leaveType, startDate, endDate, reason } = await req.json()

    if (
      !LEAVE_TYPES.some((t) => t.value === leaveType) ||
      typeof startDate !== "string" ||
      !startDate ||
      typeof endDate !== "string" ||
      !endDate ||
      typeof reason !== "string" ||
      !reason.trim()
    ) {
      return NextResponse.json({ error: "Please fill in all fields" }, { status: 400 })
    }

    if (new Date(endDate) < new Date(startDate)) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from("leave_requests").insert({
      employee_id: employee.id,
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason: reason.trim(),
    } as any)

    if (error) {
      console.error("Failed to create leave request:", error)
      return NextResponse.json({ error: "Failed to submit request" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Create leave request error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
