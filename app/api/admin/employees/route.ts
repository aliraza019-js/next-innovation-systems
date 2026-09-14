import { NextResponse } from "next/server"
import { Resend } from "resend"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/auth/require-role"

type DeliveryMethod = "email" | "link" | "password"

function generateTempPassword(): string {
  // 12 random chars from a readable alphabet — shown once to the admin to
  // hand off to the new employee (who should change it after first login).
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"
  let out = ""
  for (let i = 0; i < 12; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)]
  return out
}

function getSiteUrl(req: Request): string {
  // Explicit env var — deriving this from the incoming request was
  // unreliable (local dev falls back to a different port when 3001 is
  // busy; Vercel's internal request handling doesn't always reflect the
  // public domain either). Falls back to the request's own origin only if
  // SITE_URL was never configured.
  return process.env.SITE_URL || new URL(req.url).origin
}

async function sendInviteEmail(to: string, fullName: string, actionLink: string) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured")
  }
  const resend = new Resend(process.env.RESEND_API_KEY)

  const { error } = await resend.emails.send({
    from: "Next Innovation Systems <onboarding@resend.dev>",
    to: [to],
    subject: "You're invited to the Next Innovation Systems portal",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #10b981;">Welcome to Next Innovation Systems</h2>
        <p>Hi ${fullName},</p>
        <p>You've been added to the Next Innovation Systems employee portal. Click below to set your password and get started:</p>
        <p style="margin: 28px 0;">
          <a href="${actionLink}" style="display: inline-block; padding: 12px 28px; background: #10b981; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Set your password
          </a>
        </p>
        <p style="color: #666; font-size: 13px;">This link is single-use and expires after a while — if it's already expired, ask an admin to send you a new one.</p>
      </div>
    `,
  })

  if (error) throw new Error(error.message)
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
    const { fullName, email, role, department, jobTitle, phone, managerId, startDate, deliveryMethod } =
      await req.json()

    if (typeof fullName !== "string" || !fullName.trim() || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Full name and email are required" }, { status: 400 })
    }

    const normalizedRole = role === "admin" || role === "manager" ? role : "employee"
    const normalizedEmail = email.trim().toLowerCase()
    const method: DeliveryMethod =
      deliveryMethod === "link" || deliveryMethod === "password" ? deliveryMethod : "email"

    const supabase = getSupabaseAdmin()

    let userId: string
    let tempPassword: string | null = null
    let magicLink: string | null = null

    if (method === "email" || method === "link") {
      const redirectTo = `${getSiteUrl(req)}/admin/accept-invite`

      const { data: generated, error: generateError } = await supabase.auth.admin.generateLink({
        type: "invite",
        email: normalizedEmail,
        options: { redirectTo },
      })

      if (generateError || !generated?.user) {
        console.error("Failed to generate invite link:", generateError)
        return NextResponse.json({ error: generateError?.message || "Failed to create account" }, { status: 500 })
      }

      userId = generated.user.id
      magicLink = generated.properties?.action_link ?? null

      if (method === "email" && magicLink) {
        try {
          await sendInviteEmail(normalizedEmail, fullName.trim(), magicLink)
        } catch (emailError: any) {
          console.error("Failed to send invite email:", emailError)
          // The account + link both exist regardless — surface the link so
          // the admin isn't stuck if email delivery is the thing that failed.
          return NextResponse.json(
            {
              error: `Account created, but the invite email failed to send (${emailError.message}). Use the magic link below instead.`,
              magicLink,
            },
            { status: 502 }
          )
        }
      }
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

    return NextResponse.json({ success: true, method, tempPassword, magicLink: method === "link" ? magicLink : null })
  } catch (error: any) {
    console.error("Create employee error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
