import { getCurrentEmployee } from "@/lib/auth/current-employee"
import { getMailboxIdForEmail } from "./mail"

/** Resolves the logged-in employee's own Hostinger mailbox — never lets one employee address another's. */
export async function getCurrentEmployeeMailbox(): Promise<{ mailboxId: string; email: string } | null> {
  const employee = await getCurrentEmployee()
  if (!employee) return null

  const mailboxId = await getMailboxIdForEmail(employee.email)
  if (!mailboxId) return null

  return { mailboxId, email: employee.email }
}
