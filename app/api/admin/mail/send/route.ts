import { NextResponse } from "next/server"
import { getCurrentEmployeeMailbox } from "@/lib/hostinger/current-mailbox"
import { sendMail } from "@/lib/hostinger/mail"

export async function POST(req: Request) {
  const mailbox = await getCurrentEmployeeMailbox()
  if (!mailbox) {
    return NextResponse.json({ error: "No mailbox found for this account" }, { status: 404 })
  }

  try {
    const body = await req.json()
    const { to, cc, bcc, subject, text, html } = body

    if (!Array.isArray(to) || to.length === 0 || typeof subject !== "string" || !subject.trim()) {
      return NextResponse.json({ error: "At least one recipient and a subject are required" }, { status: 400 })
    }

    await sendMail(mailbox.mailboxId, { to, cc, bcc, subject, text, html })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Send mail error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 502 })
  }
}
