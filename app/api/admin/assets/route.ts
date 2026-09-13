import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/auth/require-role"
import { ASSET_CATEGORIES } from "@/lib/types/asset"

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from("assets").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to list assets:", error)
    return NextResponse.json({ error: "Failed to load assets" }, { status: 500 })
  }

  return NextResponse.json({ assets: data })
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { name, category, serialNumber, notes } = await req.json()

    if (typeof name !== "string" || !name.trim() || !ASSET_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Name and a valid category are required" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from("assets").insert({
      name: name.trim(),
      category,
      serial_number: typeof serialNumber === "string" && serialNumber.trim() ? serialNumber.trim() : null,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    } as any)

    if (error) {
      console.error("Failed to create asset:", error)
      return NextResponse.json({ error: "Failed to create asset" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Create asset error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
