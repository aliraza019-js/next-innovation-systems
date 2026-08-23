import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-black">
      {/* Static glow (not the animated Aurora shader) — keeps the same
          emerald-on-black family without fighting a dense data table. */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 15% 0%, rgba(0,106,84,0.25), transparent 60%), radial-gradient(50% 40% at 100% 100%, rgba(11,63,53,0.25), transparent 60%)",
        }}
      />
      <div className="relative z-10 hidden w-64 shrink-0 md:block">
        <div className="fixed h-screen w-64">
          <AdminSidebar />
        </div>
      </div>
      <main className="relative z-10 min-w-0 flex-1 px-4 py-8 sm:px-8 sm:py-10">{children}</main>
    </div>
  )
}
