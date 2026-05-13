import { SITE_URL } from "@/lib/site-config"

export type BreadcrumbItem = { name: string; path: string }

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const itemListElement = items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: item.path.startsWith("http") ? item.path : `${SITE_URL}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
  }))

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
