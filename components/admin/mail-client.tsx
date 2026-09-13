"use client"

import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { Inbox, Send, Loader2, RefreshCw, Pencil, X, ArrowLeft, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type Folder = "INBOX" | "Sent"

type MessageSummary = {
  uid: number | string
  subject: string | null
  from: { name?: string; address: string } | null
  to: { name?: string; address: string }[]
  date: string
  unseen: boolean
  hasAttachments: boolean
}

type MessageDetail = MessageSummary & { html: string | null; text: string | null }

function formatDate(value: string): string {
  const date = new Date(value)
  const now = new Date()
  const sameDay = date.toDateString() === now.toDateString()
  return sameDay
    ? date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
}

function addressLabel(addr: { name?: string; address: string } | null | undefined): string {
  if (!addr) return "Unknown"
  return addr.name || addr.address
}

/**
 * Renders email HTML in a sandboxed iframe rather than dangerouslySetInnerHTML
 * — email bodies are attacker-controlled content. `sandbox="allow-same-origin"`
 * with no `allow-scripts`/`allow-popups`/`allow-forms` means embedded
 * <script>, popups, and form submissions simply don't run, while still
 * letting us read scrollHeight to auto-size the frame.
 */
function EmailHtmlFrame({ html }: { html: string }) {
  const [height, setHeight] = useState(200)

  return (
    <iframe
      sandbox="allow-same-origin"
      srcDoc={html}
      onLoad={(e) => {
        const doc = e.currentTarget.contentDocument
        if (doc?.body) setHeight(doc.body.scrollHeight + 24)
      }}
      style={{ width: "100%", height, border: "none", background: "white", borderRadius: "8px" }}
      title="Email content"
    />
  )
}

function ComposeModal({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError("")
    try {
      const recipients = to
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      const res = await fetch("/api/admin/mail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipients, subject, text: body }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send")
      onSent()
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to send")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <form
        onSubmit={handleSend}
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">New message</h3>
          <button type="button" onClick={onClose} className="text-white/40 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <Label className="mb-1.5 block text-xs text-white/60">To</Label>
            <Input
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="someone@example.com"
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs text-white/60">Subject</Label>
            <Input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs text-white/60">Message</Label>
            <Textarea
              required
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="mt-5 flex justify-end">
          <Button
            type="submit"
            disabled={sending}
            className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}

export function MailClient() {
  const [folder, setFolder] = useState<Folder>("INBOX")
  const [messages, setMessages] = useState<MessageSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedUid, setSelectedUid] = useState<string | number | null>(null)
  const [detail, setDetail] = useState<MessageDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [showCompose, setShowCompose] = useState(false)

  const loadMessages = useCallback(async (f: Folder) => {
    setLoading(true)
    setError("")
    setSelectedUid(null)
    setDetail(null)
    try {
      const res = await fetch(`/api/admin/mail/messages?folder=${f}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load mail")
      setMessages(data.messages || [])
    } catch (err: any) {
      setError(err.message || "Failed to load mail")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMessages(folder)
  }, [folder, loadMessages])

  const openMessage = async (uid: string | number) => {
    setSelectedUid(uid)
    setDetailLoading(true)
    setDetail(null)
    try {
      const res = await fetch(`/api/admin/mail/messages/${uid}?folder=${folder}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load message")
      setDetail(data.message)
    } catch (err: any) {
      setError(err.message || "Failed to load message")
    } finally {
      setDetailLoading(false)
    }
  }

  if (error && !loading && messages.length === 0 && !selectedUid) {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
        <p className="mb-1 text-sm font-medium text-amber-400">Couldn't load your mailbox</p>
        <p className="text-sm text-white/50">{error}</p>
        <p className="mt-3 text-xs text-white/30">
          This usually means HOSTINGER_MAIL_API_TOKEN isn't set yet, or this account's email doesn't have a matching
          Hostinger mailbox.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 p-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFolder("INBOX")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              folder === "INBOX" ? "bg-emerald-500/10 text-emerald-400" : "text-white/60 hover:text-white"
            }`}
          >
            <Inbox className="h-3.5 w-3.5" />
            Inbox
          </button>
          <button
            onClick={() => setFolder("Sent")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              folder === "Sent" ? "bg-emerald-500/10 text-emerald-400" : "text-white/60 hover:text-white"
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            Sent
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadMessages(folder)}
            className="rounded-full p-2 text-white/50 hover:bg-white/5 hover:text-white"
            aria-label="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <Button
            onClick={() => setShowCompose(true)}
            size="sm"
            className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
          >
            <Pencil className="h-3.5 w-3.5" />
            Compose
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Message list */}
        <div className={`border-white/10 md:col-span-2 md:border-r ${selectedUid ? "hidden md:block" : ""}`}>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-white/40" />
            </div>
          ) : messages.length === 0 ? (
            <p className="py-16 text-center text-sm text-white/40">No messages here.</p>
          ) : (
            <ul className="max-h-[65vh] divide-y divide-white/5 overflow-y-auto">
              {messages.map((msg) => (
                <li key={msg.uid}>
                  <button
                    onClick={() => openMessage(msg.uid)}
                    className={`block w-full px-4 py-3 text-left transition-colors hover:bg-white/5 ${
                      selectedUid === msg.uid ? "bg-white/5" : ""
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className={`truncate text-sm ${msg.unseen ? "font-semibold text-white" : "text-white/70"}`}>
                        {addressLabel(folder === "Sent" ? msg.to[0] : msg.from)}
                      </span>
                      <span className="shrink-0 text-xs text-white/40">{formatDate(msg.date)}</span>
                    </div>
                    <div className={`truncate text-sm ${msg.unseen ? "text-white/90" : "text-white/50"}`}>
                      {msg.subject || "(no subject)"}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reading pane */}
        <div className={`md:col-span-3 ${selectedUid ? "" : "hidden md:block"}`}>
          {!selectedUid ? (
            <div className="flex h-full min-h-[300px] items-center justify-center text-sm text-white/30">
              Select a message to read
            </div>
          ) : detailLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-white/40" />
            </div>
          ) : detail ? (
            <div className="p-5">
              <button
                onClick={() => setSelectedUid(null)}
                className="mb-4 inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white md:hidden"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
              <h2 className="mb-2 text-lg font-semibold text-white">{detail.subject || "(no subject)"}</h2>
              <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/50">
                <span>
                  From <span className="text-white/80">{addressLabel(detail.from)}</span>
                </span>
                <span>{new Date(detail.date).toLocaleString()}</span>
                {detail.hasAttachments && (
                  <span className="inline-flex items-center gap-1">
                    <Paperclip className="h-3 w-3" /> Attachment
                  </span>
                )}
              </div>
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30 p-4">
                {detail.html ? (
                  <EmailHtmlFrame html={detail.html} />
                ) : (
                  <p className="whitespace-pre-wrap text-sm text-white/80">{detail.text || "(empty message)"}</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {showCompose && (
        <ComposeModal onClose={() => setShowCompose(false)} onSent={() => folder === "Sent" && loadMessages("Sent")} />
      )}
    </div>
  )
}
