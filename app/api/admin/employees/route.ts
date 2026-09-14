import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/auth/require-role"

function generateTempPassword(): string {
  // 12 random chars from a readable alphabet — shown once to the admin to
  // hand off to the new employee (who should change it after first login).
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"
  let out = ""
  for (let i = 0; i < 12; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)]
  return out
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("employees")
    .select(
      "id, full_name, email, role, department, manager_id, job_title, phone, start_date, avatar_url, active, created_at"
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to list employees:", error)
    return NextResponse.json({ error: "Failed to load employees" }, { status: 500 })
  }

  return NextResponse.json({ employees: data })
}

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { fullName, email, role, department, jobTitle, phone, managerId, startDate, inviteByEmail } = await req.json()

    if (typeof fullName !== "string" || !fullName.trim() || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Full name and email are required" }, { status: 400 })
    }

    const normalizedRole = role === "admin" || role === "manager" ? role : "employee"
    const normalizedEmail = email.trim().toLowerCase()
    const shouldInvite = inviteByEmail !== false // default true

    const supabase = getSupabaseAdmin()

    let userId: string
    let tempPassword: string | null = null

    if (shouldInvite) {
      // Where the invite link sends them after Supabase's own verify step —
      // built from this request's own origin so it works on localhost,
      // preview URLs, and production without an env var to keep in sync.
      const redirectTo = `${new URL(req.url).origin}/admin/accept-invite`

      const { data: invited, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(normalizedEmail, {
        redirectTo,
      })

      if (inviteError || !invited?.user) {
        console.error("Failed to invite user:", inviteError)
        return NextResponse.json({ error: inviteError?.message || "Failed to send invite" }, { status: 500 })
      }

      userId = invited.user.id
    } else {
      tempPassword = generateTempPassword()
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password: tempPassword,
        email_confirm: true,
      })

      if (createError || !created?.user) {
        console.error("Failed to create auth user:", createError)
        return NextResponse.json({ error: createError?.message || "Failed to create account" }, { status: 500 })
      }

      userId = created.user.id
    }

    const { error: insertError } = await supabase.from("employees").insert({
      id: userId,
      full_name: fullName.trim(),
      email: normalizedEmail,
      role: normalizedRole,
      department: typeof department === "string" && department.trim() ? department.trim() : null,
      job_title: typeof jobTitle === "string" && jobTitle.trim() ? jobTitle.trim() : null,
      phone: typeof phone === "string" && phone.trim() ? phone.trim() : null,
      manager_id: typeof managerId === "string" && managerId ? managerId : null,
      start_date: typeof startDate === "string" && startDate ? startDate : null,
    } as any)

    if (insertError) {
      console.error("Failed to create employee row:", insertError)
      // Roll back the auth user so we don't leave an orphaned login with no profile.
      await supabase.auth.admin.deleteUser(userId)
      return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
    }

    return NextResponse.json({ success: true, invited: shouldInvite, tempPassword })
  } catch (error: any) {
    console.error("Create employee error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
