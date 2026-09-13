/**
 * Server-only client for the Hostinger Agentic Mail REST API
 * (https://github.com/hostinger/mail-api). One company-wide token (scoped
 * to "all mailboxes" in hPanel → Agentic Mail → API) gives access to every
 * mailbox on the order — we resolve which mailbox belongs to which logged-in
 * employee by matching their email address, so employees never need their
 * own Hostinger credentials.
 *
 * NOTE: field names below are our best read of the published OpenAPI spec.
 * Verify against a real token/mailbox once HOSTINGER_MAIL_API_TOKEN is set
 * (a couple of curl calls) and adjust the `normalize*` helpers below if any
 * field name differs — that's the only place it should need a fix.
 */

const HOSTINGER_MAIL_BASE = "https://api.mail.hostinger.com"

function getToken(): string {
  const token = process.env.HOSTINGER_MAIL_API_TOKEN
  if (!token) {
    throw new Error("Missing HOSTINGER_MAIL_API_TOKEN environment variable.")
  }
  return token
}

async function hostingerFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${HOSTINGER_MAIL_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Hostinger Mail API ${init?.method || "GET"} ${path} → ${res.status}: ${text}`)
  }

  if (res.status === 204) return null
  return res.json()
}

export type MailboxRef = { id: string; address: string }

let mailboxCache: { mailboxes: MailboxRef[]; fetchedAt: number } | null = null
const MAILBOX_CACHE_TTL_MS = 5 * 60 * 1000

function normalizeMailbox(raw: any): MailboxRef {
  return {
    id: raw.resourceId ?? raw.id ?? raw.mailboxResourceId,
    address: raw.address ?? raw.email,
  }
}

/** All mailboxes this API token can see (cached briefly — this rarely changes). */
export async function listMailboxes(): Promise<MailboxRef[]> {
  if (mailboxCache && Date.now() - mailboxCache.fetchedAt < MAILBOX_CACHE_TTL_MS) {
    return mailboxCache.mailboxes
  }
  const data = await hostingerFetch("/api/v1/me")
  const raw = data?.data?.mailboxes ?? data?.mailboxes ?? []
  const mailboxes = raw.map(normalizeMailbox)
  mailboxCache = { mailboxes, fetchedAt: Date.now() }
  return mailboxes
}

/** Resolves an employee's Hostinger mailbox resource id from their email. */
export async function getMailboxIdForEmail(email: string): Promise<string | null> {
  const mailboxes = await listMailboxes()
  const match = mailboxes.find((m) => m.address?.toLowerCase() === email.toLowerCase())
  return match?.id ?? null
}

export type MailAddress = { name?: string; address: string }

export type MailMessageSummary = {
  uid: number | string
  subject: string | null
  from: MailAddress | null
  to: MailAddress[]
  date: string
  unseen: boolean
  hasAttachments: boolean
}

function normalizeAddress(raw: any): MailAddress | null {
  if (!raw) return null
  if (typeof raw === "string") return { address: raw }
  return { name: raw.name, address: raw.address ?? raw.email }
}

function normalizeMessageSummary(raw: any): MailMessageSummary {
  return {
    uid: raw.uid,
    subject: raw.subject ?? null,
    from: normalizeAddress(raw.from),
    to: (raw.to ?? []).map(normalizeAddress).filter(Boolean),
    date: raw.date,
    unseen: typeof raw.unseen === "boolean" ? raw.unseen : typeof raw.seen === "boolean" ? !raw.seen : false,
    hasAttachments: Array.isArray(raw.attachments) && raw.attachments.length > 0,
  }
}

export async function listMessages(
  mailboxId: string,
  folder: "INBOX" | "Sent",
  { page = 1, perPage = 25 }: { page?: number; perPage?: number } = {}
): Promise<{ messages: MailMessageSummary[]; total: number; totalPages: number }> {
  const data = await hostingerFetch(
    `/api/v1/mailboxes/${encodeURIComponent(mailboxId)}/folders/${encodeURIComponent(folder)}/messages?page=${page}&perPage=${perPage}`
  )
  const raw = data?.data ?? []
  const pagination = data?.pagination ?? {}
  return {
    messages: raw.map(normalizeMessageSummary),
    total: pagination.total ?? raw.length,
    totalPages: pagination.totalPages ?? 1,
  }
}

export async function getMessage(mailboxId: string, folder: string, uid: string | number) {
  const [meta, text] = await Promise.all([
    hostingerFetch(
      `/api/v1/mailboxes/${encodeURIComponent(mailboxId)}/folders/${encodeURIComponent(folder)}/messages/${uid}`
    ),
    hostingerFetch(
      `/api/v1/mailboxes/${encodeURIComponent(mailboxId)}/folders/${encodeURIComponent(folder)}/messages/${uid}/text`
    ).catch(() => null),
  ])

  const rawMeta = meta?.data ?? meta
  return {
    ...normalizeMessageSummary(rawMeta),
    html: text?.data?.html ?? text?.html ?? null,
    text: text?.data?.text ?? text?.text ?? null,
  }
}

export async function sendMail(
  mailboxId: string,
  payload: { to: string[]; cc?: string[]; bcc?: string[]; subject: string; text?: string; html?: string }
) {
  return hostingerFetch(`/api/v1/mailboxes/${encodeURIComponent(mailboxId)}/send`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
