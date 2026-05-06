export type CaseStudyStat = {
  value: string
  label: string
}

export type CaseStudy = {
  slug: string
  title: string
  category: string
  client: string
  timeframe: string
  image: string
  summary: string
  challenge: string
  solution: string[]
  outcomes: string[]
  technologies: string[]
  stats: CaseStudyStat[]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "boxes-by-swagify",
    title: "Boxes by Swagify",
    category: "Web Development / E-commerce",
    client: "Swag Management Platform",
    timeframe: "2024",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop&q=80",
    summary:
      "A global swag gifting and management platform enabling teams to design, store, and ship custom branded swag boxes.",
    challenge:
      "The client needed a unified platform for custom swag operations across multiple destinations, with consistent branding and efficient logistics.",
    solution: [
      "Built a modern web platform for product configuration and swag box personalization.",
      "Implemented inventory and fulfillment workflows for global shipping operations.",
      "Created scalable admin controls for campaign and order lifecycle management.",
    ],
    outcomes: [
      "Faster swag campaign launches with centralized tooling.",
      "Streamlined end-to-end gifting workflows for distributed teams.",
      "Improved operational visibility across design, storage, and shipping stages.",
    ],
    technologies: ["Vue.js", "Laravel", "MySQL"],
    stats: [
      { value: "Global", label: "Shipping" },
      { value: "500+", label: "SKU Support" },
      { value: "3x", label: "Faster Launches" },
      { value: "Multi", label: "Warehouse" },
    ],
  },
  {
    slug: "cardeye-payment-gateway",
    title: "Self Hosted Payment Gateway (CardEye)",
    category: "Web Development",
    client: "CardEye",
    timeframe: "March 2024",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=500&fit=crop&q=80",
    summary:
      "A secure self-hosted payment gateway with intelligent routing and fraud controls to improve acceptance rates and reduce chargebacks.",
    challenge:
      "The business needed high-performance payment processing with strict compliance requirements and flexible API-driven integration.",
    solution: [
      "Developed merchant-facing product experiences and payment workflows.",
      "Supported intelligent transaction routing and fraud monitoring integrations.",
      "Designed frontend architecture aligned with PCI-focused platform standards.",
    ],
    outcomes: [
      "Higher payment reliability through optimized routing logic.",
      "Reduced risk exposure with improved fraud handling controls.",
      "Enterprise-ready foundation for secure and scalable payment operations.",
    ],
    technologies: ["Vue.js", "Laravel", "Vuetify", "AWS"],
    stats: [
      { value: "99.9%", label: "Uptime" },
      { value: "<200ms", label: "Latency" },
      { value: "PCI", label: "Compliant" },
      { value: "Smart", label: "Routing" },
    ],
  },
  {
    slug: "nft-builder",
    title: "3D NFT Builder",
    category: "Web Development",
    client: "Digital Product Studio",
    timeframe: "November 2024",
    image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&h=500&fit=crop&q=80",
    summary:
      "A 3D avatar customization platform with real-time rendering, marketplace capabilities, and interoperable digital ownership features.",
    challenge:
      "The product required high-performance rendering and a smooth customization flow while supporting blockchain-oriented use cases.",
    solution: [
      "Built immersive UI flows for avatar customization and asset management.",
      "Implemented real-time 3D rendering experiences for interactive previews.",
      "Integrated marketplace-ready architecture for digital ownership workflows.",
    ],
    outcomes: [
      "Launched an engaging customization experience with fast visual feedback.",
      "Enabled scalable architecture for asset expansion and trading experiences.",
      "Improved product differentiation through advanced interactive UX.",
    ],
    technologies: ["Next.js", "Three.js", "Go"],
    stats: [
      { value: "60fps", label: "Rendering" },
      { value: "1000+", label: "Asset Combos" },
      { value: "Real-time", label: "3D Preview" },
      { value: "Web3", label: "Integrated" },
    ],
  },
  {
    slug: "eolasbio-corporate-site",
    title: "EolasBio Corporate Website",
    category: "Corporate Website / Life Sciences",
    client: "EolasBio",
    timeframe: "2024",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=500&fit=crop&q=80",
    summary:
      "A professional life sciences website that presents complex services with clear structure for partners, researchers, and pharma stakeholders.",
    challenge:
      "The client needed to communicate deep scientific capabilities in a way that was accessible and conversion-oriented for multiple audiences.",
    solution: [
      "Designed clear service taxonomy and structured content flows.",
      "Built a content-driven platform with maintainable editorial workflows.",
      "Aligned UX and information architecture for credibility and lead generation.",
    ],
    outcomes: [
      "Stronger clarity across service offerings and research capabilities.",
      "Improved stakeholder navigation and content discoverability.",
      "Elevated digital presence for enterprise and partnership conversations.",
    ],
    technologies: ["WordPress", "PHP", "MySQL"],
    stats: [
      { value: "40%", label: "More Leads" },
      { value: "SEO", label: "Optimized" },
      { value: "Multi", label: "Audience" },
      { value: "CMS", label: "Powered" },
    ],
  },
]
