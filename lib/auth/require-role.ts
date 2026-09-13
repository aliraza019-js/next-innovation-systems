import { getCurrentEmployee, type CurrentEmployee } from "./current-employee"

/** Returns the current employee only if they're an admin, otherwise null. */
export async function requireAdmin(): Promise<CurrentEmployee | null> {
  const employee = await getCurrentEmployee()
  if (!employee || employee.role !== "admin") return null
  return employee
}

/** Returns the current employee only if they're an admin or manager, otherwise null. */
export async function requireManagerOrAdmin(): Promise<CurrentEmployee | null> {
  const employee = await getCurrentEmployee()
  if (!employee || (employee.role !== "admin" && employee.role !== "manager")) return null
  return employee
}
