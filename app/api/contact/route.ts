import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, message, type } = body

    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    if (type === "contact" && (!name || !message)) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      )
    }


    if (type === "query") {

      const { data, error } = await resend.emails.send({
        from: "NIS Website <onboarding@resend.dev>",
        to: [process.env.CONTACT_EMAIL || "contact@nexinsystems.com"],
        subject: `New Query from ${email}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #10b981;">New Website Query</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p style="color: #666;">This inquiry was submitted via the footer form on the NIS website.</p>
          </div>
        `,
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, id: data?.id })
    }

    if (type === "contact") {
      // CTA contact form — full consultation request
      const { data, error } = await resend.emails.send({
        from: "NIS Website <onboarding@resend.dev>",
        to: [process.env.CONTACT_EMAIL || ""],
        subject: `New Consultation Request from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #10b981;">New Consultation Request</h2>
            <hr style="border: 1px solid #e5e7eb;" />
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f9fafb; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${message}</p>
            <hr style="border: 1px solid #e5e7eb;" />
            <p style="color: #666; font-size: 12px;">Submitted via the CTA contact form on the NIS website.</p>
          </div>
        `,
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, id: data?.id })
    }

    return NextResponse.json({ error: "Invalid form type" }, { status: 400 })
  } catch (error: any) {
    console.error("Email send error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    )
  }
}

