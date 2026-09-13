import { NextResponse } from "next/server"
import { getCurrentEmployeeMailbox } from "@/lib/hostinger/current-mailbox"
import { listMessages } from "@/lib/hostinger/mail"

export async function GET(req: Request) {
  const mailbox = await getCurrentEmployeeMailbox()
  if (!mailbox) {
    return NextResponse.json({ error: "No mailbox found for this account" }, { status: 404 })
  }

  const url = new URL(req.url)
  const folder = url.searchParams.get("folder") === "Sent" ? "Sent" : "INBOX"
  const page = Number(url.searchParams.get("page") || "1") || 1

  try {
    const result = await listMessages(mailbox.mailboxId, folder, { page })
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("List messages error:", error)
    return NextResponse.json({ error: "Failed to load mail" }, { status: 502 })
  }
}
