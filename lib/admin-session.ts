/**
 * Minimal signed-cookie session for the single-admin dashboard at /admin.
 * Uses Web Crypto (not node:crypto) so it works in both the Edge middleware
 * and regular route handlers.
 */

export const ADMIN_SESSION_COOKIE = "nis_admin_session"
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET environment variable.")
  }
  return secret
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  let str = ""
  for (const b of arr) str += String.fromCharCode(b)
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/")
  const str = atob(padded + "===".slice((padded.length + 3) % 4))
  const arr = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) arr[i] = str.charCodeAt(i)
  return arr
}

async function getHmacKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

export async function createAdminSessionToken(email: string): Promise<string> {
  const payload = JSON.stringify({ email, exp: Date.now() + SESSION_TTL_MS })
  const payloadB64 = toBase64Url(new TextEncoder().encode(payload))

  const key = await getHmacKey()
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64)
  )

  return `${payloadB64}.${toBase64Url(signature)}`
}

export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false

  const [payloadB64, sigB64] = token.split(".")
  if (!payloadB64 || !sigB64) return false

  try {
    const key = await getHmacKey()
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(sigB64),
      new TextEncoder().encode(payloadB64)
    )
    if (!valid) return false

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64)))
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return false

    return true
  } catch {
    return false
  }
}
