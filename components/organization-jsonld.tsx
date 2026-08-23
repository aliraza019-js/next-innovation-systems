import {
  ORGANIZATION_ID,
  SITE_URL,
  SITE_NAME,
  LEGAL_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE_E164,
  US_ADDRESS,
  PK_ADDRESS,
  absoluteUrl,
} from "@/lib/site-config"

const logoUrl = absoluteUrl("/nis-logo-large.svg")

/**
 * Organization + LocalBusiness (Lahore) + WebSite for sitewide JSON-LD.
 */
export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        legalName: LEGAL_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
        image: logoUrl,
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE_E164,
        address: {
          "@type": "PostalAddress",
          streetAddress: PK_ADDRESS.streetAddress,
          addressLocality: PK_ADDRESS.addressLocality,
          addressRegion: PK_ADDRESS.addressRegion,
          addressCountry: PK_ADDRESS.addressCountry,
        },
        location: [
          {
            "@type": "Place",
            name: `${LEGAL_NAME} — Registered Office`,
            address: {
              "@type": "PostalAddress",
              streetAddress: US_ADDRESS.streetAddress,
              addressLocality: US_ADDRESS.addressLocality,
              addressRegion: US_ADDRESS.addressRegion,
              postalCode: US_ADDRESS.postalCode,
              addressCountry: US_ADDRESS.addressCountry,
            },
          },
          {
            "@type": "Place",
            name: `${SITE_NAME} — Lahore Office`,
            address: {
              "@type": "PostalAddress",
              streetAddress: PK_ADDRESS.streetAddress,
              addressLocality: PK_ADDRESS.addressLocality,
              addressRegion: PK_ADDRESS.addressRegion,
              addressCountry: PK_ADDRESS.addressCountry,
            },
          },
        ],
        areaServed: [
          { "@type": "Country", name: US_ADDRESS.countryName },
          { "@type": "Country", name: PK_ADDRESS.countryName },
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": ORGANIZATION_ID },
        inLanguage: "en",
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
