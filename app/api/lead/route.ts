import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

// In-memory dedup store (resets on server restart — fine for edge cases)
// For production, use Redis or a DB
const submittedEmails = new Set<string>()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, page, timestamp } = body

    // ── Validate email presence ──
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // ── Validate email format ──
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // ── Deduplicate — same email won't send twice ──
    if (submittedEmails.has(normalizedEmail)) {
      return NextResponse.json({ success: true, deduplicated: true })
    }

    submittedEmails.add(normalizedEmail)

    const capturedAt = timestamp
      ? new Date(timestamp).toLocaleString("en-US", {
          timeZone: "Asia/Karachi",
          dateStyle: "full",
          timeStyle: "short",
        })
      : new Date().toLocaleString("en-US", {
          timeZone: "Asia/Karachi",
          dateStyle: "full",
          timeStyle: "short",
        })

    const landingPage = page || "Unknown"

    // ── Send lead notification to admin ──
    const { error } = await resend.emails.send({
      from: "NIS Chatbot <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL || "contact@nextinnovation.systems"],
      replyTo: normalizedEmail,
      subject: `🔥 New Lead Captured: ${normalizedEmail}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); padding: 32px 40px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              <div style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></div>
              <span style="color: #6ee7b7; font-size: 12px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;">NIS Chatbot Lead</span>
            </div>
            <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #ffffff;">New Lead Captured 🎯</h1>
            <p style="margin: 8px 0 0; color: #a7f3d0; font-size: 14px;">A visitor submitted their email via the chatbot widget.</p>
          </div>

          <!-- Body -->
          <div style="padding: 32px 40px; background: #111827;">
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 14px 0; border-bottom: 1px solid #1f2937;">
                  <span style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Visitor Email</span><br>
                  <span style="font-size: 16px; color: #10b981; font-weight: 600; margin-top: 4px; display: block;">${normalizedEmail}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 14px 0; border-bottom: 1px solid #1f2937;">
                  <span style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Landing Page</span><br>
                  <span style="font-size: 14px; color: #d1d5db; margin-top: 4px; display: block;">${landingPage}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 14px 0;">
                  <span style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Captured At (PKT)</span><br>
                  <span style="font-size: 14px; color: #d1d5db; margin-top: 4px; display: block;">${capturedAt}</span>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <div style="margin-top: 28px; padding: 20px; background: #064e3b; border-radius: 12px; border: 1px solid #065f46;">
              <p style="margin: 0 0 12px; font-size: 14px; color: #a7f3d0; font-weight: 600;">⚡ Respond within 24 hours to maximize conversion</p>
              <a href="mailto:${normalizedEmail}" style="display: inline-block; padding: 10px 24px; background: #10b981; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Reply to ${normalizedEmail}</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding: 20px 40px; background: #0a0a0a; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #4b5563;">This lead was automatically captured by the NIS chatbot widget on <a href="https://nexinsystems.com" style="color: #10b981;">nexinsystems.com</a></p>
          </div>
        </div>
      `,
    })

    if (error) {
      // Remove from dedup set so they can try again
      submittedEmails.delete(normalizedEmail)
      console.error("Lead email error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Lead capture error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to capture lead" },
      { status: 500 }
    )
  }
}
