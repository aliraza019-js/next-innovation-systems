import { createClient } from "@supabase/supabase-js"

/**
 * Server-only Supabase client using the service role key.
 * This bypasses Row Level Security, so it must NEVER be imported
 * from a Client Component or exposed to the browser.
 *
 * Note: intentionally untyped (no Database generic) — the installed
 * supabase-js version expects typegen output in a newer internal format
 * that a hand-written schema type doesn't satisfy. Call sites that
 * insert/update cast their payload instead (see apply/status routes).
 */
let cachedClient: ReturnType<typeof createClient> | null = null

export function getSupabaseAdmin() {
  if (cachedClient) return cachedClient

  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    )
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      // Next.js patches the global fetch to auto-cache requests inside
      // Server Components. Force every Supabase request to bypass that,
      // otherwise the admin dashboard can silently serve stale data.
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  })

  return cachedClient
}

export const RESUMES_BUCKET = "resumes"
