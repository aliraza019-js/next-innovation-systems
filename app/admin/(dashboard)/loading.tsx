import { Loader2 } from "lucide-react"

/**
 * Next.js shows this automatically the instant a navigation starts under
 * /admin/(dashboard)/* — before the target page's own data fetching even
 * finishes — wrapping just the page content in a Suspense boundary. The
 * sidebar (in the layout above this) isn't part of that boundary, so it
 * stays exactly where it is and stays clickable.
 */
export default function DashboardLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-white/40">
      <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      <p className="text-sm">Loading…</p>
    </div>
  )
}
