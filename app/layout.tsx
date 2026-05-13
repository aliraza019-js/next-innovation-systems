import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"
import { PageTransition } from "@/components/page-transition"
import { NavigationTransition } from "@/components/navigation-transition"
import { ChatWidget } from "@/components/chat-widget"
import { ScrollToTop } from "@/components/scroll-to-top"
import { OrganizationJsonLd } from "@/components/organization-jsonld"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Dancing_Script, Caveat } from "next/font/google"
import {
  DEFAULT_OG_IMAGE_PATH,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site-config"

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
})

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
})

const defaultTitle =
  "Custom Software & AI Development Company | Next Innovation Systems — Lahore, Pakistan"

const defaultDescription =
  "Lahore software & AI partner: custom apps, cloud, DevOps & ML. 150+ projects across Pakistan & global clients. Book your free consultation to start today."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: "%s | Next Innovation Systems",
  },
  description: defaultDescription,
  authors: [{ name: "Ali Raza", url: "https://aliraza.tech" }],
  creator: "Ali Raza",
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Lahore, Pakistan`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [DEFAULT_OG_IMAGE_PATH],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased ${dancingScript.variable} ${caveat.variable}`}>
        <OrganizationJsonLd />
        <Suspense fallback={null}>
          <NavigationTransition />
          <PageTransition>{children}</PageTransition>
        </Suspense>
        <SpeedInsights />
        <ScrollToTop />
        <ChatWidget />
      </body>
    </html>
  )
}
