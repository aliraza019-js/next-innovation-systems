export type AssetCategory = "laptop" | "monitor" | "phone" | "accessory" | "other"
export type AssetStatus = "available" | "assigned" | "retired"

export type Asset = {
  id: string
  created_at: string
  name: string
  category: AssetCategory
  serial_number: string | null
  assigned_to: string | null
  status: AssetStatus
  notes: string | null
}

export const ASSET_CATEGORIES: AssetCategory[] = ["laptop", "monitor", "phone", "accessory", "other"]
