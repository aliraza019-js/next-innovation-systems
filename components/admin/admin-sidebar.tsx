"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  FileText,
  Mail,
  Users,
  LogOut,
  Loader2,
  Contact,
  CalendarDays,
  Receipt,
  FolderLock,
  Laptop,
} from "lucide-react"
import { NisLogoDark } from "@/components/nis-logo-dark"
import type { EmployeeRole } from "@/lib/auth/current-employee"

type NavItem = {
  name: string
  href: string
  icon: typeof FileText
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { name: "Mail", href: "/admin/mail", icon: Mail },
  { name: "Directory", href: "/admin/directory", icon: Contact },
  { name: "Leave", href: "/admin/leave", icon: CalendarDays },
  { name: "Reimbursements", href: "/admin/reimbursements", icon: Receipt },
  { name: "Documents", href: "/admin/documents", icon: FolderLock },
  { name: "Resumes", href: "/admin/resumes", icon: FileText, adminOnly: true },
  { name: "Assets", href: "/admin/assets", icon: Laptop, adminOnly: true },
  { name: "Employees", href: "/admin/employees", icon: Users, adminOnly: true },
]

export function AdminSidebar({
  employee,
}: {
  employee: { full_name: string; email: string; role: EmployeeRole }
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await fetch("/api/admin/logout", { method: "POST" })
    router.replace("/admin/login")
    router.refresh()
  }

  const visibleItems = navItems.filter((item) => !item.adminOnly || employee.role === "admin")

  return (
    <aside className="flex h-full w-full flex-col justify-between border-r border-white/10 bg-[#0a0a0a] px-4 py-6">
      <div>
        <Link href="/admin/mail" className="mb-8 flex items-center px-2">
          <NisLogoDark className="h-8 w-auto" />
        </Link>

        <nav className="space-y-1 overflow-y-auto">
          {visibleItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                data-active={isActive}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white data-[active=true]:bg-emerald-500/10 data-[active=true]:text-emerald-400"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div>
        <div className="mb-2 rounded-xl px-3 py-2.5">
          <div className="truncate text-sm font-medium text-white">{employee.full_name}</div>
          <div className="truncate text-xs text-white/40">{employee.email}</div>
          {employee.role !== "employee" && (
            <span className="mt-1 inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-400">
              {employee.role}
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
        >
          {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          Log out
        </button>
      </div>
    </aside>
  )
}
