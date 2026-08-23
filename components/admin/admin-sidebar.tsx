"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FileText, LogOut, Loader2 } from "lucide-react"
import { NisLogoDark } from "@/components/nis-logo-dark"

const navItems = [{ name: "Resumes", href: "/admin/resumes", icon: FileText }]

export function AdminSidebar() {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await fetch("/api/admin/logout", { method: "POST" })
    router.replace("/admin/login")
    router.refresh()
  }

  return (
    <aside className="flex h-full w-full flex-col justify-between border-r border-white/10 bg-[#0a0a0a] px-4 py-6">
      <div>
        <Link href="/admin/resumes" className="mb-10 flex items-center px-2">
          <NisLogoDark className="h-8 w-auto" />
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white data-[active=true]:bg-emerald-500/10 data-[active=true]:text-emerald-400"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
      >
        {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
        Log out
      </button>
    </aside>
  )
}
