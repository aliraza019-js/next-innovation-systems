export type ApplicationStatus = "new" | "reviewed" | "shortlisted" | "rejected"

export type JobApplication = {
  id: string
  created_at: string
  job_slug: string
  job_title: string
  full_name: string
  email: string
  phone: string
  university: string
  has_ruby: boolean
  has_mern: boolean
  has_dotnet_angular: boolean
  has_react_next: boolean
  experience_years: number
  current_salary_pkr: number
  expected_salary_pkr: number
  available_join_date: string
  resume_path: string
  resume_filename: string
  status: ApplicationStatus
}

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "new",
  "reviewed",
  "shortlisted",
  "rejected",
]
