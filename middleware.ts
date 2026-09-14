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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
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

  if (PUBLIC_PATHS.some((path) => pathname === path)) {
    return response
  }

  // getSession() just decodes the cookie locally — no network round-trip to
  // Supabase's auth server, unlike getUser(). That's fine here: this is only
  // a coarse "is anyone logged in" gate for routing. The actual secure
  // check (getUser(), validated server-side) still happens on every request
  // in getCurrentEmployee(), which every admin page/layout calls before
  // touching any data — a forged/expired cookie fails there regardless of
  // what middleware decided.
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user ?? null

  if (!user) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
