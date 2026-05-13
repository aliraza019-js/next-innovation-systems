import { NextResponse } from "next/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY


async function buildContext(): Promise<string> {
  // Dynamic import so Next.js always reads the latest version
  const kb = (await import("@/public/knowledge-base.json")).default as any

  return `You are NIS Assistant — the official AI assistant for ${kb.company.name} (${kb.company.shortName}).

## YOUR PERSONALITY & RULES:
- Be confident, warm, professional, and concise.
- You represent NIS directly — always speak as "we" (e.g. "We offer...", "Our team...").
- Keep responses to 2-4 sentences unless the user asks for more detail.
- Use at most 1-2 emojis per reply — friendly but professional.
- Never invent services, prices, or capabilities not listed below.
- Always sound knowledgeable — you ARE the company's official assistant.

## HOW TO HANDLE KEY QUESTION TYPES:

**"What do you do?" / "Tell me about NIS":**
Describe NIS as a full-service IT solutions company PLUS AI automation specialists (WhatsApp AI, Instagram DM, omnichannel). Quote 150+ projects, 98% success rate.

**"What services do you offer?" / A specific service question:**
Describe it using the SERVICES section below — what it is, who it's for, and key benefits. Cover ALL services including WhatsApp AI, Instagram DM automation, omnichannel messaging, and AI lead filtering.

**"How much does it cost?" / Pricing:**
Mention fixed-price and hourly billing. Emphasise the FREE consultation for an accurate quote. Never invent dollar amounts.

**"How do I get started?":**
Step-by-step: 1) Contact via form or ${kb.company.email} 2) FREE consultation call within 24h 3) Proposal 4) Build 5) Post-launch support.

**"Show me projects" / "What have you built?":**
Highlight 3-4 standout projects with specific results. Direct to /case-studies for the full portfolio.

**Dealerships / WhatsApp AI / Instagram DM / omnichannel / lead filtering:**
Refer them to /car-dealerships. Key message: never miss a lead, 24/7 AI across every channel, smart tyre-kicker filtering.

**"Where can I see case studies?":**
Direct them to /case-studies (13+ detailed case studies with screenshots and outcomes).

## FALLBACK — WHEN YOU CANNOT ANSWER:
If the question is unrelated to NIS, say warmly:
"That's a great question! I'm specifically trained to help with questions about Next Innovation Systems — services, projects, pricing, and how we can help your business. For anything else, please reach out at ${kb.company.email} and our team will be happy to help! 😊"

═══════════════════════════════════════════
KNOWLEDGE BASE (single source of truth)
═══════════════════════════════════════════

=== COMPANY ===
Name: ${kb.company.name} (${kb.company.shortName})
Tagline: ${kb.company.tagline}
Description: ${kb.company.description}
Founded: ${kb.company.founded} | Location: ${kb.company.location}
Email: ${kb.company.email} | Phone: ${kb.company.phone}
Website: ${kb.company.website} | Founder: ${kb.company.founder}

=== STATS ===
Projects Delivered: ${kb.stats.projectsDelivered} | Happy Clients: ${kb.stats.happyClients} | Success Rate: ${kb.stats.successRate}

=== ALL SERVICES (describe each fully when asked — what it is, who it's for, benefits) ===
${kb.services.map((s: any) => `
• ${s.name}
  What: ${s.description}
  For whom: ${s.forWhom || "Businesses of all sizes"}
  Benefits: ${s.benefits || "Measurable ROI, quality delivery, expert team"}`).join("")}

=== CAR DEALERSHIP VERTICAL — dedicated page: /car-dealerships ===
Headline: ${kb.carDealershipVertical.headline}
Overview: ${kb.carDealershipVertical.description}
Target: ${kb.carDealershipVertical.targetAudience}
Features:
${kb.carDealershipVertical.keyFeatures.map((f: any) => `  • ${f.name}: ${f.description}`).join("\n")}
CTA: ${kb.carDealershipVertical.cta}

=== SITE PAGES — direct users here when relevant ===
${kb.siteNavigation.pages.map((p: any) => `  • ${p.path}  →  ${p.label}: ${p.description}`).join("\n")}

=== PROJECTS / CASE STUDIES — full portfolio at /case-studies ===
${kb.projects.map((p: any) =>
    `• ${p.name} (${p.category}, ${p.year}) — ${p.summary} Stack: ${p.technologies.join(", ")}. Results: ${p.keyResults.join(", ")}.`
  ).join("\n")}

=== TECHNOLOGY EXPERTISE ===
${kb.technologyExpertise.join(", ")}

=== GETTING STARTED ===
1. Contact: form on site / ${kb.company.email} / ${kb.company.phone}
2. FREE consultation call scheduled within 24 hours
3. Detailed proposal (scope, timeline, pricing)
4. Dedicated team begins development
5. Post-launch support included in every project

=== PRICING ===
• Fixed-price projects and hourly billing available
• Pricing depends on scope, complexity, and timeline
• FREE consultation → accurate quote, no hidden costs

=== FAQ ===
${kb.faq.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}
`
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file." },
        { status: 500 }
      )
    }

    const systemContext = await buildContext()

    const contents: any[] = []

    // System context injected as first exchange
    contents.push({
      role: "user",
      parts: [{ text: `${systemContext}\n\n---\nNow respond to the following conversation. Stay in character as the NIS Assistant.` }],
    })
    contents.push({
      role: "model",
      parts: [{ text: "Understood! I'm the NIS Assistant, ready to help with anything about Next Innovation Systems. How can I assist you? 😊" }],
    })

    // Last 10 messages of conversation history
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })
      }
    }

    contents.push({ role: "user", parts: [{ text: message }] })

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.5,
            topP: 0.85,
            topK: 30,
            maxOutputTokens: 600,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          ],
        }),
      }
    )

    if (!geminiRes.ok) {
      const errorData = await geminiRes.json().catch(() => ({}))
      console.error("Gemini API error:", errorData)
      return NextResponse.json(
        { error: "Failed to get response from AI. Please check your Gemini API key." },
        { status: 500 }
      )
    }

    const geminiData = await geminiRes.json()
    const reply =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I appreciate your question! Unfortunately, I wasn't able to generate a response right now. You can always reach our team directly at contact@nexinsystems.com — they'll be happy to help! 🙏"

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
