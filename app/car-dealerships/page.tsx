import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld"
import { CarDealershipsContent } from "./car-dealerships-content"
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME, SITE_URL } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Automotive Dealership Software Demo",
  description:
    "Explore NIS automotive demo experiences—before/after workflows, omnichannel, and WhatsApp-led engagement built for modern dealerships in Pakistan and beyond.",
  openGraph: {
    title: `Automotive Dealership Software Demo | ${SITE_NAME}`,
    description:
      "Interactive demo: dealership workflows, omnichannel engagement, and conversion-focused UX.",
    url: `${SITE_URL}/car-dealerships`,
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Automotive demo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Automotive Dealership Software Demo | ${SITE_NAME}`,
    description:
      "Interactive demo: dealership workflows, omnichannel engagement, and conversion-focused UX.",
    images: [DEFAULT_OG_IMAGE_PATH],
  },
}

export default function CarDealershipsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Car dealerships demo", path: "/car-dealerships" },
        ]}
      />
      <CarDealershipsContent />
    </>
  )
}
