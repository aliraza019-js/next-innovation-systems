export type CaseStudy = {
  slug: string
  title: string
  category: string
  client: string
  timeframe: string
  image: string
  images: string[]
  summary: string
  challenge: string
  solution: string[]
  outcomes: string[]
  technologies: string[]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "boxes-by-swagify",
    title: "Boxes by Swagify",
    category: "Web Development / E-commerce",
    client: "Swag Management Platform",
    timeframe: "2024",
    image: "/projects/boxes-by-swagify/thumbnail.png",
    images: [
      "/projects/boxes-by-swagify/image.png",
      "/projects/boxes-by-swagify/image-copy.png",
      "/projects/boxes-by-swagify/image-copy-2.png",
      "/projects/boxes-by-swagify/image-copy-3.png",
      "/projects/boxes-by-swagify/image-copy-4.png",
      "/projects/boxes-by-swagify/image-copy-5.png",
      "/projects/boxes-by-swagify/image-copy-6.png",
      "/projects/boxes-by-swagify/image-copy-7.png",
      "/projects/boxes-by-swagify/image-copy-8.png",
    ],
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
  },
  {
    slug: "self-hosted-gateway",
    title: "Self Hosted Payment Gateway",
    category: "Web Development / FinTech",
    client: "CardEye",
    timeframe: "March 2024",
    image: "/projects/self-hosted-gateway/thumbnail.png",
    images: [
      "/projects/self-hosted-gateway/dashboard-2_optimized.0-1920x1507-1.jpg",
      "/projects/self-hosted-gateway/levin-pay-sign-in_optimized.png",
      "/projects/self-hosted-gateway/transaction-2_optimized.0.jpg",
      "/projects/self-hosted-gateway/transaction-detail-page_optimized.jpg",
      "/projects/self-hosted-gateway/fraudulent-2_optimized.0-user-details.jpg",
      "/projects/self-hosted-gateway/notification-design-3_optimized.png",
    ],
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
  },
  {
    slug: "3d-generative-nft-builder",
    title: "3D Generative NFT Builder",
    category: "Web Development / Web3",
    client: "Digital Product Studio",
    timeframe: "November 2024",
    image: "/projects/3d-generative-nft-builder/thumbnail.png",
    images: [
      "/projects/3d-generative-nft-builder/img-1.png",
      "/projects/3d-generative-nft-builder/img-2.png",
      "/projects/3d-generative-nft-builder/img-3.png",
      "/projects/3d-generative-nft-builder/img-4.png",
    ],
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
  },
  {
    slug: "eolasbio",
    title: "EolasBio Corporate Website",
    category: "Corporate Website / Life Sciences",
    client: "EolasBio",
    timeframe: "2024",
    image: "/projects/eolasbio/thumbnail.png",
    images: [
      "/projects/eolasbio/image.png",
      "/projects/eolasbio/image-copy.png",
      "/projects/eolasbio/image-copy-2.png",
    ],
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
  },
  {
    slug: "nft-marketplace",
    title: "NFT Marketplace for Digital Art & Collectibles",
    category: "SaaS / Marketing Automation",
    client: "Enterprise Marketing Client",
    timeframe: "January 2025",
    image: "/projects/nft-marketplace/thumbnail.png",
    images: [
      "/projects/nft-marketplace/image1.webp",
      "/projects/nft-marketplace/image2.webp",
      "/projects/nft-marketplace/image3.webp",
    ],
    summary:
      "A comprehensive AI-powered campaign management platform with cohort building, campaign library, and HubSpot-integrated execution workflows.",
    challenge:
      "The NFT space lacked marketplaces that combined a premium visual experience with genuinely fast, low-friction trading flows.",
    solution: [
      "Designed and built a fully functional NFT marketplace with a dark-themed, futuristic UI.",
      "Built with React and Tailwind CSS for pixel-perfect responsiveness.",
      "Integrated with Web3.js and ERC-721 for secure on-chain ownership."
    ],
    outcomes: [
      "The marketplace launched to strong reception from the creator community.",
      "The premium dark UI became a differentiator.",
      "Smooth trading flow consistently praised by users."
    ],
    technologies: ["React.js", "Tailwind CSS", "Web3.js", "ERC-721", "Node.js", "Ethereum"],
  },
  {
    slug: "campaign-builder",
    title: "AI Campaign Builder Platform",
    category: "SaaS / Marketing Automation",
    client: "Enterprise Marketing Client",
    timeframe: "January 2025",
    image: "/projects/campaign-builder/thumbnail.png",
    images: [
      "/projects/campaign-builder/product-library.webp",
      "/projects/campaign-builder/cohort-campaign-selection.webp",
      "/projects/campaign-builder/cohort-library.webp",
      "/projects/campaign-builder/campaign-library.webp",
      "/projects/campaign-builder/customer-library.webp",
    ],
    summary:
      "A comprehensive AI-powered campaign management platform with cohort building, campaign library, and HubSpot-integrated execution workflows.",
    challenge:
      "The client needed to unify customer segmentation, campaign creation, and marketplace discovery in a single intelligent platform.",
    solution: [
      "Architected a modular campaign builder with cohort selection and campaign pairing.",
      "Built a product and customer library with data quality assessment tooling.",
      "Integrated marketplace exploration for discovering campaign templates.",
    ],
    outcomes: [
      "Reduced campaign launch time from days to hours through guided workflows.",
      "Unified 6 previously siloed marketing tools into a single platform.",
      "Enabled data-driven segmentation with 11-step data foundation process.",
    ],
    technologies: ["React.js", "TypeScript", "Node.js", "HubSpot API"],
  },
  {
    slug: "autogather",
    title: "Autogather Platform",
    category: "Web App / B2B SaaS",
    client: "Autogather",
    timeframe: "March 2025",
    image: "/projects/autogather/thumbnail.png",
    images: [
      "/projects/autogather/cover.webp",
      "/projects/autogather/dashboard.webp",
      "/projects/autogather/assessment.webp",
      "/projects/autogather/full-page.webp",
    ],
    summary:
      "A full-featured B2B platform for professional assessment, career tracking, product discovery, and case-study-driven learning.",
    challenge:
      "The client needed a unified digital workspace combining HR assessments, product catalogs, and career paths.",
    solution: [
      "Built a multi-module platform with assessment engine and career tracker.",
      "Designed an intuitive dashboard surfacing key metrics.",
      "Implemented case-study learning flows with structured knowledge paths.",
    ],
    outcomes: [
      "Consolidated 5 separate tools into a single cohesive platform.",
      "Increased user engagement by 70% through structured learning journeys.",
      "Reduced onboarding time for new users by 45%.",
    ],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "AWS"],
  },
  {
    slug: "crypto-wallet",
    title: "Crypto Wallet & DApp Dashboard",
    category: "Web3 / FinTech",
    client: "Crypto Platform Client",
    timeframe: "2024",
    image: "/projects/crypto-wallet/thumbnail.png",
    images: [
      "/projects/crypto-wallet/dashboard-1.webp",
      "/projects/crypto-wallet/wallet-overview.webp",
      "/projects/crypto-wallet/transactions.webp",
      "/projects/crypto-wallet/dapp-store.webp",
    ],
    summary:
      "A full-stack Web3 wallet and DApp dashboard with portfolio tracking, transaction history, and site monitoring.",
    challenge:
      "The client needed a single unified interface for managing multi-chain wallets and monitoring DApp performance.",
    solution: [
      "Built a multi-chain wallet interface with real-time portfolio valuation.",
      "Designed a DApp store with discovery and usage analytics.",
      "Implemented site monitoring and hosting overview for deployed DApps.",
    ],
    outcomes: [
      "Delivered a seamless Web3 UX that abstracts blockchain complexity.",
      "Reduced wallet management time by 60% through unified views.",
      "Enabled instant DApp discovery and deployment.",
    ],
    technologies: ["React.js", "Web3.js", "Node.js", "Ethers.js"],
  },
  {
    slug: "custom-enterprise-crm",
    title: "Custom Enterprise CRM",
    category: "Enterprise Software / CRM",
    client: "B2B Enterprise Client",
    timeframe: "October 2024",
    image: "/projects/custom-enterprise-crm/thumbnail.png",
    images: [
      "/projects/custom-enterprise-crm/cover.webp",
      "/projects/custom-enterprise-crm/companies-dashboard.webp",
      "/projects/custom-enterprise-crm/login.webp",
      "/projects/custom-enterprise-crm/create-form.webp",
      "/projects/custom-enterprise-crm/forms-preview.webp",
      "/projects/custom-enterprise-crm/shared-forms.webp",
      "/projects/custom-enterprise-crm/shared-packages.webp",
      "/projects/custom-enterprise-crm/transactions.webp",
      "/projects/custom-enterprise-crm/environmental-reporting.webp",
    ],
    summary:
      "A custom enterprise CRM with dynamic form builder, shared packages, and environmental reporting.",
    challenge:
      "Off-the-shelf CRMs could not handle the client's multi-entity structure and custom data collection requirements.",
    solution: [
      "Designed a flexible form builder with shared templates.",
      "Built a companies dashboard with full transaction tracking.",
      "Implemented environmental reporting module aligned with compliance.",
    ],
    outcomes: [
      "Eliminated reliance on 4 legacy tools with one unified CRM.",
      "Compliance reporting time reduced by 65%.",
      "Sales cycle shortened by 30% with automation.",
    ],
    technologies: ["React.js", "Node.js", "PostgreSQL", "Redis"],
  },
  {
    slug: "efxpro",
    title: "EfxPro Trading Platform",
    category: "FinTech / Trading",
    client: "EFXPro",
    timeframe: "2024",
    image: "/projects/efxpro/thumbnail.png",
    images: [
      "/projects/efxpro/home.webp",
      "/projects/efxpro/detail-page.webp",
      "/projects/efxpro/detail-page-1.webp",
      "/projects/efxpro/economic-news.webp",
      "/projects/efxpro/account.webp",
    ],
    summary:
      "A professional forex and financial trading platform with real-time market data and account management.",
    challenge:
      "The client needed a high-performance trading interface that could handle real-time data streams.",
    solution: [
      "Built a real-time market data dashboard with live price feeds.",
      "Designed detailed instrument pages with historical analytics.",
      "Integrated economic news feed with relevance filtering.",
    ],
    outcomes: [
      "Delivered sub-100ms data refresh rates for live trading views.",
      "Increased average session duration by 40%.",
      "Launched to 2,000+ active traders within the first month.",
    ],
    technologies: ["React.js", "TypeScript", "WebSocket", "Node.js"],
  },
  {
    slug: "ducorr",
    title: "Cathodic Protection & Corrosion Solutions",
    category: "Corporate / Industrial",
    client: "CEO & Founder, Ducorr",
    timeframe: "2024",
    image: "/projects/ducorr/thumbnail.png",
    images: [
      "/projects/ducorr/career.webp",
      "/projects/ducorr/case-studies-learning.webp",
      "/projects/ducorr/products-details.webp",
      "/projects/ducorr/projects.webp",
    ],
    summary:
      "Ducorr is a leading cathodic protection specialist operating across UAE and KSA.",
    challenge:
      "Building a platform for corporate presence, product catalog, project portfolio, and e-commerce.",
    solution: [
      "Built a comprehensive digital platform for Ducorr.",
      "Unifies corporate identity, projects, and e-commerce.",
      "Positions Ducorr as the authority in the Middle East."
    ],
    outcomes: [
      "Significantly improved search visibility across UAE and KSA.",
      "Streamlined lead generation and product inquiries."
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Headless CMS"],
  },
  {
    slug: "aladdin-catering",
    title: "Aladdin Catering Platform",
    category: "Web App / Food & Beverage",
    client: "Aladdin Catering",
    timeframe: "2024",
    image: "/projects/aladdin-catering/thumbnail.png",
    images: [
      "/projects/aladdin-catering/home.webp",
      "/projects/aladdin-catering/menu.webp",
      "/projects/aladdin-catering/catering-menu.webp",
      "/projects/aladdin-catering/add-to-cart.webp",
      "/projects/aladdin-catering/about-us.webp",
    ],
    summary:
      "A modern catering platform with interactive menus and order management.",
    challenge:
      "The business needed to move from phone-based orders to a digital platform.",
    solution: [
      "Built a dynamic menu management system.",
      "Designed an intuitive booking and order flow.",
      "Implemented an admin panel for tracking orders.",
    ],
    outcomes: [
      "Online orders increased by 180% within 60 days.",
      "Reduced order errors by 90%.",
      "Improved customer satisfaction through self-service.",
    ],
    technologies: ["Next.js", "Tailwind CSS", "Supabase"],
  },
  {
    slug: "managed-hosting-dashboard",
    title: "Managed Hosting Dashboard",
    category: "SaaS / DevOps",
    client: "Hosting Platform Client",
    timeframe: "2025",
    image: "/projects/managed-hosting-dashboard/thumbnail.png",
    images: [
      "/projects/managed-hosting-dashboard/dashboard.webp",
      "/projects/managed-hosting-dashboard/hosting-overview.webp",
      "/projects/managed-hosting-dashboard/cover.webp",
      "/projects/managed-hosting-dashboard/site-monitoring.webp",
    ],
    summary:
      "A managed hosting control panel with real-time monitoring and resource dashboards.",
    challenge:
      "The client needed a white-label dashboard for uptime and resource usage visibility.",
    solution: [
      "Built a real-time site monitoring module.",
      "Designed a hosting overview panel with resource graphs.",
      "Implemented a responsive dashboard for hosted sites.",
    ],
    outcomes: [
      "Customer support tickets reduced by 50%.",
      "Achieved 99.95% uptime visibility accuracy.",
      "Onboarded 300+ sites in the first 2 months.",
    ],
    technologies: ["React.js", "Node.js", "WebSocket", "PostgreSQL"],
  },
  {
    slug: "sparkdoc-ai",
    title: "SparkDoc AI Writing Platform",
    category: "AI / SaaS",
    client: "SparkDoc",
    timeframe: "April 2025",
    image: "/projects/sparkdoc-ai/thumbnail.png",
    images: [
      "/projects/sparkdoc-ai/dashboard.webp",
      "/projects/sparkdoc-ai/register.webp",
      "/projects/sparkdoc-ai/ai-chatbot.webp",
      "/projects/sparkdoc-ai/auto-suggestion.webp",
      "/projects/sparkdoc-ai/add-function.webp",
      "/projects/sparkdoc-ai/cite-analysis.webp",
      "/projects/sparkdoc-ai/document-settings.webp",
      "/projects/sparkdoc-ai/view-sources.webp",
    ],
    summary:
      "An AI-powered writing platform with chatbot, citation analysis, and source management.",
    challenge:
      "Building a writing assistant to reduce research friction and improve accuracy.",
    solution: [
      "Built an AI chatbot integrated into the document editor.",
      "Implemented auto-suggestion engine for writers.",
      "Designed citation analysis with one-click reference insertion.",
    ],
    outcomes: [
      "Writing speed increased by 3x for active users.",
      "Citation error rates reduced by 85%.",
      "Achieved 4.9 star rating in beta.",
    ],
    technologies: ["Next.js", "OpenAI API", "TypeScript", "PostgreSQL"],
  },
]