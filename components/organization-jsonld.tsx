import {
  ORGANIZATION_ID,
  SITE_URL,
  SITE_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE_E164,
  ADDRESS,
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
          addressLocality: ADDRESS.locality,
          addressRegion: ADDRESS.region,
          addressCountry: ADDRESS.country,
        },
        areaServed: {
          "@type": "Country",
          name: ADDRESS.countryName,
        },
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
