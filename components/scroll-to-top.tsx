"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import "./scroll-to-top.css";

const SCROLL_THRESHOLD = 400; // Show button after scrolling 400px down

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setIsVisible(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    // Check initial position (e.g. page refresh while scrolled)
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      id="scroll-to-top-btn"
      onClick={scrollToTop}
      className={`scroll-to-top ${isVisible ? "scroll-to-top--visible" : ""}`}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <ArrowUp className="scroll-to-top__icon" />
      <span className="scroll-to-top__pulse" />
    </button>
  );
}
