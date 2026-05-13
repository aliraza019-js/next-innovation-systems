import { ORGANIZATION_ID, SITE_URL } from "@/lib/site-config"
import { SITE_SERVICES } from "@/lib/services-catalog"

const FEATURES_URL = `${SITE_URL}/#features`

export function HomeServicesJsonLd() {
  const graph = SITE_SERVICES.map((s) => ({
    "@type": "Service",
    name: s.name,
    serviceType: s.name,
    description: s.description,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: {
      "@type": "Country",
      name: "Pakistan",
    },
    url: FEATURES_URL,
  }))

  const schema = {
    "@context": "https://schema.org",
    "@graph": graph,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
