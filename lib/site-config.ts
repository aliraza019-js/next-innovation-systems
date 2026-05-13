/** Canonical site URL (no trailing slash). */
export const SITE_URL = "https://nexinsystems.com"

export const SITE_NAME = "Next Innovation Systems"

/** Stable @id for JSON-LD linking (Organization / provider). */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`

export const CONTACT_EMAIL = "contact@nexinsystems.com"
export const CONTACT_PHONE_E164 = "+923334039462"
export const CONTACT_PHONE_DISPLAY = "+92 333 4039462"

export const ADDRESS = {
  locality: "Lahore",
  region: "Punjab",
  country: "PK",
  countryName: "Pakistan",
} as const

/** Default OG/Twitter image (absolute path under /public). */
export const DEFAULT_OG_IMAGE_PATH = "/placeholder-logo.png"

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path
  const p = path.startsWith("/") ? path : `/${path}`
  return `${SITE_URL}${p}`
}
