import { NextResponse, type NextRequest } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

const PUBLIC_PATHS = [
  "/admin/login",
  "/api/admin/login",
  // The invite link hands the browser a session via a URL fragment
  // (#access_token=...) that the server never sees — no cookie exists yet
  // on this first request, so it must be let through before the client-side
  // Supabase SDK runs and establishes the real cookie session.
  "/admin/accept-invite",
]

function denyOrRedirect(request: NextRequest, pathname: string) {
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const loginUrl = new URL("/admin/login", request.url)
  loginUrl.searchParams.set("from", pathname)
  return NextResponse.redirect(loginUrl)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some((path) => pathname === path)) {
    return NextResponse.next()
  }

  // A misconfigured/missing env var (wrong project after a Supabase
  // migration, a var never added to this deployment target, etc.) used to
  // throw here and take down every /admin request with a 500
  // (MIDDLEWARE_INVOCATION_FAILED). Fail closed instead — deny access, but
  // don't crash the whole route.
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error("Middleware: SUPABASE_URL/SUPABASE_ANON_KEY are not configured for this deployment.")
    return denyOrRedirect(request, pathname)
  }

  try {
    let response = NextResponse.next({ request: { headers: request.headers } })

    const supabase = createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: "", ...options })
        },
      },
    })

    // getSession() just decodes the cookie locally — no network round-trip
    // to Supabase's auth server, unlike getUser(). That's fine here: this is
    // only a coarse "is anyone logged in" gate for routing. The actual
    // secure check (getUser(), validated server-side) still happens on
    // every request in getCurrentEmployee(), which every admin page/layout
    // calls before touching any data — a forged/expired cookie fails there
    // regardless of what middleware decided.
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return denyOrRedirect(request, pathname)
    }

    return response
  } catch (error) {
    // Network hiccup, unreachable Supabase host, malformed cookie, etc. —
    // same principle: deny access rather than 500 the whole route.
    console.error("Admin middleware error:", error)
    return denyOrRedirect(request, pathname)
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
