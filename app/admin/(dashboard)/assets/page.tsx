import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth/require-role"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { AssetsManager } from "@/components/admin/assets-manager"
import type { Asset } from "@/lib/types/asset"
import type { Employee } from "@/lib/types/employee"

export const dynamic = "force-dynamic"

export default async function AssetsPage() {
  const admin = await requireAdmin()
  if (!admin) redirect("/admin/mail")

  const supabase = getSupabaseAdmin()
  const [{ data: assets }, { data: employees }] = await Promise.all([
    supabase.from("assets").select("*").order("created_at", { ascending: false }),
    supabase.from("employees").select("id, full_name, email").eq("active", true).order("full_name"),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Assets</h1>
        <p className="mt-1 text-sm text-white/50">Track company equipment and who has what.</p>
      </div>

      <AssetsManager
        initialAssets={(assets ?? []) as Asset[]}
        employees={(employees ?? []) as Pick<Employee, "id" | "full_name" | "email">[]}
      />
    </div>
  )
}
