import { NextResponse } from "next/server"
import { ADMIN_SESSION_COOKIE, createAdminSessionToken } from "@/lib/admin-session"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      console.error("ADMIN_EMAIL / ADMIN_PASSWORD are not configured.")
      return NextResponse.json({ error: "Admin login is not configured" }, { status: 500 })
    }

    const emailOk = typeof email === "string" && email.trim().toLowerCase() === adminEmail.toLowerCase()
    const passwordOk = typeof password === "string" && password === adminPassword

    if (!emailOk || !passwordOk) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = await createAdminSessionToken(adminEmail)

    const res = NextResponse.json({ success: true })
    res.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return res
  } catch (error: any) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
