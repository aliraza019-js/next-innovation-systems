import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

export type EmployeeRole = "admin" | "manager" | "employee"

export type CurrentEmployee = {
  id: string
  full_name: string
  email: string
  role: EmployeeRole
  department: string | null
  manager_id: string | null
}

/**
 * Resolves the logged-in employee from the Supabase Auth session (validated
 * server-side via getUser(), not just decoded from the cookie), then looks
 * up their role/profile row using the service_role client. Returns null if
 * there's no session, or the account isn't (or is no longer) an employee.
 */
export async function getCurrentEmployee(): Promise<CurrentEmployee | null> {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from("employees")
    .select("id, full_name, email, role, department, manager_id, active")
    .eq("id", user.id)
    .single()

  if (error || !data || !(data as any).active) return null

  return data as CurrentEmployee
}
