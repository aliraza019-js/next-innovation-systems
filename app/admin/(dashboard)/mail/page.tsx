import { MailClient } from "@/components/admin/mail-client"

export const dynamic = "force-dynamic"

export default function AdminMailPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Mail</h1>
        <p className="mt-1 text-sm text-white/50">Your inbox, linked to your company email.</p>
      </div>

      <MailClient />
    </div>
  )
}
