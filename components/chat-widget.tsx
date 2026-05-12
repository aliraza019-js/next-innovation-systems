"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles, ArrowDown, Mail, CheckCircle } from "lucide-react"
import { BRAND_COLORS } from "@/lib/brand"
import "./chat-widget.css"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// Email prompt states
type EmailPromptState = "hidden" | "visible" | "submitting" | "success" | "dismissed"

const WELCOME_CONTENT = "Hey there! 👋 I'm the NIS Assistant. Ask me anything about our services, projects, pricing, or how we can help your business grow!"

const SUGGESTED_QUESTIONS = [
  "What do you do?",
  "How much does it cost?",
  "How do I get started?",
  "Show me your projects",
]

// Email regex 
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SESSION_DISMISSED_KEY = "nis_email_prompt_dismissed"
const SESSION_SUBMITTED_KEY = "nis_email_submitted"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => [{
    id: "welcome",
    role: "assistant",
    content: WELCOME_CONTENT,
    timestamp: new Date(),
  }])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Email capture state
  const [emailPromptState, setEmailPromptState] = useState<EmailPromptState>("hidden")
  const [emailInput, setEmailInput] = useState("")
  const [emailError, setEmailError] = useState("")
  const promptTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }, [])

  // Check session flags on mount
  useEffect(() => {
    const dismissed = sessionStorage.getItem(SESSION_DISMISSED_KEY)
    const submitted = sessionStorage.getItem(SESSION_SUBMITTED_KEY)
    if (dismissed || submitted) {
      setEmailPromptState("dismissed")
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      scrollToBottom("instant")
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen, scrollToBottom])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Global ESC listener to close chat
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  }, [isOpen])

  // Start 10-second timer when chat opens (only if not dismissed/submitted)
  useEffect(() => {
    if (isOpen && emailPromptState === "hidden") {
      promptTimerRef.current = setTimeout(() => {
        setEmailPromptState("visible")
        setTimeout(() => emailInputRef.current?.focus(), 100)
      }, 10000)
    }
    return () => {
      if (promptTimerRef.current) clearTimeout(promptTimerRef.current)
    }
  }, [isOpen, emailPromptState])

  // Also trigger after first message if timer hasn't fired yet
  useEffect(() => {
    if (hasInteracted && emailPromptState === "hidden") {
      if (promptTimerRef.current) clearTimeout(promptTimerRef.current)
      promptTimerRef.current = setTimeout(() => {
        setEmailPromptState("visible")
        setTimeout(() => emailInputRef.current?.focus(), 100)
      }, 3000) // 3s after first message
    }
  }, [hasInteracted, emailPromptState])

  const handleScroll = () => {
    if (!messagesContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100)
  }

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || isLoading) return

    setHasInteracted(true)
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role === "assistant" ? "model" : "user", content: m.content }))

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, history }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Something went wrong")

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err: any) {
      const fallbackText = err.message?.includes("API key")
        ? "I'm currently being set up! In the meantime, you can reach our team directly at contact@nextinnovation.systems — we'd love to hear from you! 😊"
        : "Oops! I had a small hiccup processing that. Could you try rephrasing your question? If it keeps happening, feel free to email us at contact@nextinnovation.systems and our team will help right away! 🙏"

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fallbackText,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // ── Email prompt handlers ──
  const dismissEmailPrompt = () => {
    setEmailPromptState("dismissed")
    sessionStorage.setItem(SESSION_DISMISSED_KEY, "1")
  }

  const validateEmail = (val: string): string => {
    if (!val.trim()) return "Please enter your email address"
    if (!EMAIL_REGEX.test(val.trim())) return "Please enter a valid email (e.g. you@example.com)"
    return ""
  }

  const submitEmail = async () => {
    const err = validateEmail(emailInput)
    if (err) {
      setEmailError(err)
      emailInputRef.current?.focus()
      return
    }

    // Client-side dedup: don't submit if already submitted this session
    const alreadySubmitted = sessionStorage.getItem(SESSION_SUBMITTED_KEY)
    if (alreadySubmitted === emailInput.trim().toLowerCase()) {
      setEmailPromptState("success")
      return
    }

    setEmailPromptState("submitting")
    setEmailError("")

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.trim(),
          page: typeof window !== "undefined" ? window.location.href : "Unknown",
          timestamp: new Date().toISOString(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setEmailPromptState("visible")
        setEmailError(data.error || "Something went wrong. Please try again.")
        return
      }

      // Mark as submitted in session (keyed to email for dedup)
      sessionStorage.setItem(SESSION_SUBMITTED_KEY, emailInput.trim().toLowerCase())
      setEmailPromptState("success")
    } catch {
      setEmailPromptState("visible")
      setEmailError("Network error. Please try again.")
    }
  }

  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      submitEmail()
    }
    if (e.key === "Escape") {
      dismissEmailPrompt()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    if (hours === 0) hours = 12
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`
  }

  const showEmailPrompt = emailPromptState === "visible" || emailPromptState === "submitting" || emailPromptState === "success"

  return (
    <>
      {/* Floating Action Button */}
      <div className="chat-fab-container">
        {!hasInteracted && !isOpen && (
          <div className="chat-fab-tooltip">
            <span className="chat-fab-tooltip__text">Hi!</span>
            <span className="chat-fab-tooltip__emoji">👋</span>
            <div className="chat-fab-tooltip__arrow" />
          </div>
        )}
        <button
          id="nis-chat-fab"
          onClick={() => setIsOpen(!isOpen)}
          className={`chat-fab ${isOpen ? "chat-fab--open" : ""}`}
          aria-label={isOpen ? "Close chat" : "Open chat"}
          style={{
            background: !isOpen
              ? `linear-gradient(135deg, ${BRAND_COLORS.emerald} 0%, ${BRAND_COLORS.emeraldDark} 100%)`
              : undefined,
            boxShadow: !isOpen
              ? `0 4px 24px ${BRAND_COLORS.emerald}66, 0 0 0 0 ${BRAND_COLORS.emerald}4d`
              : undefined,
          }}
        >
          <div className="chat-fab__icon-wrapper">
            {isOpen ? (
              <X className="chat-fab__icon" />
            ) : (
              <>
                {/* <img src="/nis-logo-icon.png" className="chat-fab__icon" /> */}
                <MessageCircle className="chat-fab__icon" />
                <span className="chat-fab__pulse" />
              </>
            )}
          </div>
        </button>
      </div>

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? "chat-window--open" : ""}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header__left">
            <div className="chat-header__avatar">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="chat-header__title">NIS Assistant</h3>
              <div className="chat-header__status">
                <span className="chat-header__dot" />
                Online
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="chat-header__close"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="chat-messages"
          onScroll={handleScroll}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble ${msg.role === "user" ? "chat-bubble--user" : "chat-bubble--assistant"}`}
            >
              <div className="chat-bubble__avatar">
                {msg.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
              </div>
              <div className="chat-bubble__content">
                <p className="chat-bubble__text">{msg.content}</p>
                <span className="chat-bubble__time" suppressHydrationWarning>{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="chat-bubble chat-bubble--assistant">
              <div className="chat-bubble__avatar"><Bot size={14} /></div>
              <div className="chat-bubble__content">
                <div className="chat-typing">
                  <span className="chat-typing__dot" />
                  <span className="chat-typing__dot" />
                  <span className="chat-typing__dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Email Capture Prompt ── */}
        {showEmailPrompt && (
          <div className="chat-email-prompt" role="dialog" aria-label="Email capture">

            {emailPromptState === "success" ? (
              /* Success state */
              <div className="chat-email-prompt__success">
                <CheckCircle size={28} className="chat-email-prompt__success-icon" />
                <p className="chat-email-prompt__success-title">You're all set! 🎉</p>
                <p className="chat-email-prompt__success-text">
                  Thanks! Our team will reach out to you shortly. Feel free to keep chatting!
                </p>
                <button
                  onClick={() => setEmailPromptState("dismissed")}
                  className="chat-email-prompt__success-btn"
                >
                  Continue chatting
                </button>
              </div>
            ) : (
              /* Input state */
              <>
                <div className="chat-email-prompt__header">
                  <div className="chat-email-prompt__icon">
                    <Mail size={16} />
                  </div>
                  <div className="chat-email-prompt__text">
                    <p className="chat-email-prompt__title">Get a free consultation</p>
                    <p className="chat-email-prompt__subtitle">Drop your email and we'll reach out within 24 hours!</p>
                  </div>
                  <button
                    onClick={dismissEmailPrompt}
                    className="chat-email-prompt__dismiss"
                    aria-label="Dismiss"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="chat-email-prompt__form">
                  <div className="chat-email-prompt__input-wrap">
                    <input
                      ref={emailInputRef}
                      type="email"
                      placeholder="your@email.com"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value)
                        if (emailError) setEmailError(validateEmail(e.target.value))
                      }}
                      onKeyDown={handleEmailKeyDown}
                      disabled={emailPromptState === "submitting"}
                      className={`chat-email-prompt__input ${emailError ? "chat-email-prompt__input--error" : ""}`}
                      aria-label="Your email address"
                    />
                    <button
                      onClick={submitEmail}
                      disabled={emailPromptState === "submitting"}
                      className="chat-email-prompt__submit"
                      aria-label="Submit email"
                    >
                      {emailPromptState === "submitting" ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Send size={15} />
                      )}
                    </button>
                  </div>
                  {emailError && (
                    <p className="chat-email-prompt__error">{emailError}</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Suggested questions (only before first interaction) */}
        {!hasInteracted && !showEmailPrompt && (
          <div className="chat-suggestions">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)} className="chat-suggestion-chip">
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button
            onClick={() => scrollToBottom()}
            className="chat-scroll-btn"
            aria-label="Scroll to bottom"
          >
            <ArrowDown size={16} />
          </button>
        )}

        {/* Input Area */}
        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask me anything about NIS..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="chat-input"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="chat-send-btn"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
          <p className="chat-disclaimer">Powered by NIS • AI-assisted responses</p>
        </div>
      </div>
    </>
  )
}
