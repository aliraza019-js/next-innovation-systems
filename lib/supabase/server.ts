import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Cookie-bound Supabase client for Server Components / Route Handlers.
 * Uses the anon key + the signed-in user's own session — this is what
 * validates "who is logged in", never used to bypass RLS (that's
 * lib/supabase/admin.ts's job, with the service_role key).
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          // Called from a Server Component render — middleware refreshes
          // the session cookie on the next request instead.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch {
          // Same as above.
        }
      },
    },
  })
}
