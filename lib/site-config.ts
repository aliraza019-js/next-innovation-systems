/** Canonical site URL (no trailing slash). */
export const SITE_URL = "https://nexinsystems.com"

export const SITE_NAME = "Next Innovation Systems"

/** Registered legal entity name — used in copyright lines and legalName schema. */
export const LEGAL_NAME = "Next Innovation Systems LLC"

/** Stable @id for JSON-LD linking (Organization / provider). */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`

export const CONTACT_EMAIL = "contact@nexinsystems.com"
export const CONTACT_PHONE_E164 = "+923334039462"
export const CONTACT_PHONE_DISPLAY = "+92 333 4039462"

/** US registered agent address (Next Innovation Systems LLC). */
export const US_ADDRESS = {
  streetAddress: "30 N Gould St Ste R",
  addressLocality: "Sheridan",
  addressRegion: "WY",
  postalCode: "82801",
  addressCountry: "US",
  countryName: "United States",
} as const

/** Lahore delivery office. */
export const PK_ADDRESS = {
  streetAddress: "3rd Floor, Office 4-A, R Block, Johar Town",
  addressLocality: "Lahore",
  addressRegion: "Punjab",
  postalCode: "",
  addressCountry: "PK",
  countryName: "Pakistan",
} as const

/** Default OG/Twitter image (absolute path under /public). */
export const DEFAULT_OG_IMAGE_PATH = "/placeholder-logo.png"

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path
  const p = path.startsWith("/") ? path : `/${path}`
  return `${SITE_URL}${p}`
}
