import type { EmployeeRole } from "@/lib/auth/current-employee"

export type Employee = {
  id: string
  full_name: string
  email: string
  role: EmployeeRole
  department: string | null
  manager_id: string | null
  job_title: string | null
  phone: string | null
  start_date: string | null
  avatar_url: string | null
  active: boolean
  created_at: string
}
