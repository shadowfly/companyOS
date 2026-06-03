"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navItems = [
    { key: "nav.scenarios", href: "#companies" },
    { key: "nav.services", href: "#features" },
    { key: "nav.audiences", href: "#workforce" },
    { key: "nav.pricing", href: "#pricing" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(3,7,18,0.95)] backdrop-blur-xl border-b border-[rgba(0,212,255,0.1)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
                <span className="text-white font-black text-sm">AI</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse-cyan" />
            </div>
            <div>
              <div className="font-black text-white text-lg leading-none tracking-tight">AI Company</div>
              <div className="font-mono text-[10px] text-cyan-400 tracking-widest">ENTERPRISE OS</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a key={item.key} href={item.href} className="nav-link text-sm font-medium">
                {t(item.key)}
              </a>
            ))}
            <a
              href="http://123.56.0.189:8000/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link text-sm font-medium"
            >
              {t("nav.demo")}
            </a>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex items-center bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.15)] rounded-full p-1">
              <button
                onClick={() => setLang("zh")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  lang === "zh"
                    ? "bg-cyan-400 text-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                中文
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  lang === "en"
                    ? "bg-cyan-400 text-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>

            <a
              href="#pricing"
              className="btn-neon px-5 py-2 rounded-full text-sm cursor-pointer inline-block"
            >
              {t("nav.start")}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {/* Mobile Language Toggle */}
            <div className="flex items-center bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.15)] rounded-full p-0.5">
              <button
                onClick={() => setLang("zh")}
                className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
                  lang === "zh" ? "bg-cyan-400 text-black" : "text-slate-400"
                }`}
              >
                中
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
                  lang === "en" ? "bg-cyan-400 text-black" : "text-slate-400"
                }`}
              >
                EN
              </button>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="Menu"
            >
              <div className="space-y-1.5">
                <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(3,7,18,0.98)] backdrop-blur-xl border-b border-[rgba(0,212,255,0.1)]">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="block text-slate-300 hover:text-cyan-400 font-medium py-2 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {t(item.key)}
              </a>
            ))}
            <a
              href="http://123.56.0.189:8000/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-slate-300 hover:text-cyan-400 font-medium py-2 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {t("nav.demo")}
            </a>
            <div className="pt-2">
              <a
                href="#pricing"
                className="btn-neon px-6 py-3 rounded-full text-sm inline-block w-full text-center"
                onClick={() => setMenuOpen(false)}
              >
                {t("nav.start")}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
