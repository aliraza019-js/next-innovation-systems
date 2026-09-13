import { NextResponse } from "next/server"
import { getCurrentEmployeeMailbox } from "@/lib/hostinger/current-mailbox"
import { getMessage } from "@/lib/hostinger/mail"

export async function GET(req: Request, { params }: { params: { uid: string } }) {
  const mailbox = await getCurrentEmployeeMailbox()
  if (!mailbox) {
    return NextResponse.json({ error: "No mailbox found for this account" }, { status: 404 })
  }

  const url = new URL(req.url)
  const folder = url.searchParams.get("folder") === "Sent" ? "Sent" : "INBOX"

  try {
    const message = await getMessage(mailbox.mailboxId, folder, params.uid)
    return NextResponse.json({ message })
  } catch (error: any) {
    console.error("Get message error:", error)
    return NextResponse.json({ error: "Failed to load message" }, { status: 502 })
  }
}
