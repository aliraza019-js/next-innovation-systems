import type { RequestStatus } from "./leave-request"

export type Reimbursement = {
  id: string
  created_at: string
  employee_id: string
  category: string
  amount_pkr: number
  description: string
  receipt_path: string | null
  status: RequestStatus
  reviewed_by: string | null
  reviewed_at: string | null
}

export const REIMBURSEMENT_CATEGORIES = ["Travel", "Meals", "Office supplies", "Software/Tools", "Client expense", "Other"]

export const RECEIPTS_BUCKET = "receipts"
