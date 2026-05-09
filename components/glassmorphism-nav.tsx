"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { NisLogoDark } from "@/components/nis-logo-dark";

const navigation = [
  { name: "Services", href: "#features" },
  { name: "Projects", href: "#case-studies" },
  { name: "About Us", href: "#testimonials" },
  { name: "Contact", href: "#contact" },
];

export function GlassmorphismNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 100);

    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;
        if (currentScrollY > 50) {
          if (
            currentScrollY > lastScrollY.current &&
            currentScrollY - lastScrollY.current > 5
          ) {
            setIsVisible(false);
          } else if (lastScrollY.current - currentScrollY > 5) {
            setIsVisible(true);
          }
        } else {
          setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar, { passive: true });
      return () => {
        window.removeEventListener("scroll", controlNavbar);
        clearTimeout(timer);
      };
    }
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (href: string) => {
    if (href.startsWith("/")) return;

    const element = document.querySelector(href);
    if (element) {
      const rect = element.getBoundingClientRect();
      const currentScrollY =
        window.pageYOffset || document.documentElement.scrollTop;
      const elementAbsoluteTop = rect.top + currentScrollY;
      const navbarHeight = 100;
      const targetPosition = Math.max(0, elementAbsoluteTop - navbarHeight);

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95vw] max-w-7xl  ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-20 md:-translate-y-24 opacity-0"
        } ${hasLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        {/* Main Navigation Container */}
        <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-200/20 rounded-full px-4 py-2 md:px-8 md:py-3 shadow-xl ">
          <div className="flex items-center justify-between gap-4">
            {/* Logo Section */}
         
            <Link
              href="/"
              aria-label="Next Innovation Systems home"
              className="flex items-center gap-3 group transition-transform duration-200"
            >
              <NisLogoDark className="h-8 w-auto md:h-10 shrink-0 block" />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-10">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-white/90 hover:text-white transition-colors duration-200 font-medium text-sm md:text-base cursor-pointer"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Right Side: CTA + Mobile Toggle */}
            <div className="flex items-center gap-4">
            
              <div className="hidden md:block">
                <button
                  className="bg-white text-black font-medium px-6 py-2.5 rounded-full flex items-center transition-all duration-300 hover:scale-105 shadow-lg group"
                  onClick={() => scrollToSection("#contact")}
                >
                  <span className="mr-2">Free Consultation</span>
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 mt-4 transition-all duration-300 origin-top ${
            isOpen
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-emerald-950/90 backdrop-blur-xl border border-emerald-200/20 rounded-3xl p-6 shadow-2xl mx-auto w-[90vw]">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-white/80 hover:text-white text-left py-2 text-lg font-medium border-b border-white/10"
                >
                  {item.name}
                </button>
              ))}
              <button
                className="bg-emerald-600 text-white w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
                onClick={() => scrollToSection("#contact")}
              >
                Free Consultation <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
