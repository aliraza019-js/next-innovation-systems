import { createBrowserClient } from "@supabase/ssr"

/**
 * Browser-side Supabase client (anon key only, never the service key).
 * Needed specifically for the invite-acceptance flow: when an employee
 * clicks their invite link, Supabase hands the browser a session via the
 * URL — only a client-side SDK instance can read that and let them set
 * their own password with auth.updateUser().
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
