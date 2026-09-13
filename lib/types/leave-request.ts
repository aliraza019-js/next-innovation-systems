export type LeaveType = "annual" | "sick" | "casual" | "unpaid"
export type RequestStatus = "pending" | "approved" | "rejected"

export type LeaveRequest = {
  id: string
  created_at: string
  employee_id: string
  leave_type: LeaveType
  start_date: string
  end_date: string
  reason: string
  status: RequestStatus
  reviewed_by: string | null
  reviewed_at: string | null
}

export const LEAVE_TYPES: { value: LeaveType; label: string }[] = [
  { value: "annual", label: "Annual" },
  { value: "sick", label: "Sick" },
  { value: "casual", label: "Casual" },
  { value: "unpaid", label: "Unpaid" },
]
