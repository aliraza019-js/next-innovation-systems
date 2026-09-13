export type DocumentCategory = "offer_letter" | "contract" | "nda" | "other"

export type EmployeeDocument = {
  id: string
  created_at: string
  employee_id: string
  title: string
  category: DocumentCategory
  file_path: string
  file_name: string
  uploaded_by: string
}

export const DOCUMENT_CATEGORIES: { value: DocumentCategory; label: string }[] = [
  { value: "offer_letter", label: "Offer letter" },
  { value: "contract", label: "Contract" },
  { value: "nda", label: "NDA" },
  { value: "other", label: "Other" },
]

export const DOCUMENTS_BUCKET = "documents"
