"use client";

import { useEffect, useRef, useState } from "react";
import { LangProvider, useLang } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import DataCharts from "@/components/DataCharts";

// ─── AI Particle Canvas ───────────────────────────────────────────────────────
function AIParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#00d4ff", "#7c3aed", "#10b981", "#38bdf8"];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,212,255,${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
    />
  );
}

// ─── Section Header with Number ───────────────────────────────────────────────
function SectionHeader({ number, badge, title, desc }: {
  number: string;
  badge?: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <span className="section-number">{number}</span>
        {badge && (
          <span className="tag-tech">{badge}</span>
        )}
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
        {title}
      </h2>
      {desc && (
        <p className="text-slate-400 max-w-2xl text-lg">{desc}</p>
      )}
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const { t } = useLang();
  const [termLines, setTermLines] = useState<string[]>([]);

  const terminalLines = useRef([
    "> Initializing AI Company OS...",
    "> Loading enterprise modules... ✓",
    "> Generating org structure... ✓",
    "> CEO: AI-Alpha-001 deployed",
    "> Talent market: 580,000 AI staff ready",
    "> Business Hall: ONLINE",
    "> Revenue engine: ACTIVE",
    "> System status: ALL SYSTEMS GO 🚀",
  ]);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < terminalLines.current.length) {
        setTermLines((prev) => [...prev, terminalLines.current[i]]);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden grid-bg pt-20">
      <div className="absolute inset-0">
        <AIParticleField />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            <div className="flex items-center gap-2 tag-tech mb-6">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00d4ff] animate-pulse" />
              {t("hero.badge")}
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00d4ff] animate-pulse" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] mb-6">
              <span className="text-white">{t("hero.title1")}</span>
              <br />
              <span className="gradient-text">{t("hero.title2")}</span>
              <br />
              <span className="text-white text-3xl sm:text-4xl lg:text-5xl">{t("hero.title3")}</span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
              {t("hero.desc")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href="#pricing"
                className="btn-neon px-8 py-4 rounded-full text-lg font-bold text-center cursor-pointer inline-block"
              >
                {t("hero.cta1")}
              </a>
              <a
                href="http://123.56.0.189:8000/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-neon px-8 py-4 rounded-full text-lg font-bold text-center inline-block"
              >
                {t("hero.cta2")} →
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { numKey: "hero.stat1.num", labelKey: "hero.stat1.label" },
                { numKey: "hero.stat2.num", labelKey: "hero.stat2.label" },
                { numKey: "hero.stat3.num", labelKey: "hero.stat3.label" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl sm:text-2xl font-black gradient-text-cyan">
                    {t(stat.numKey)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{t(stat.labelKey)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Terminal + AI Visual */}
          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden lg:block">
              <div className="orbit-ring w-72 h-72 absolute -translate-x-1/2 -translate-y-1/2" />
              <div
                className="orbit-ring w-96 h-96 absolute -translate-x-1/2 -translate-y-1/2"
                style={{ animationDirection: "reverse", animationDuration: "25s" }}
              />
            </div>

            <div className="card-tech rounded-2xl overflow-hidden relative z-10">
              <div className="flex items-center gap-2 px-4 py-3 bg-[rgba(0,212,255,0.05)] border-b border-[rgba(0,212,255,0.1)]">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-slate-500 font-mono">ai-company-os ~ terminal</span>
              </div>
              <div className="p-5 font-mono text-sm min-h-[240px] space-y-1">
                {termLines.map((line, i) => {
                  if (!line) return null;
                  return (
                    <div
                      key={i}
                      className={`${
                        line.includes("✓") ? "text-emerald-400" :
                        line.includes("🚀") ? "text-cyan-400 font-bold" :
                        line.includes(">") ? "text-slate-300" : "text-cyan-400"
                      }`}
                    >
                      {line}
                    </div>
                  );
                })}
                {termLines.length < terminalLines.current.length && (
                  <span className="text-cyan-400 animate-blink">█</span>
                )}
              </div>
            </div>

            <div className="absolute -top-4 -right-4 card-tech p-3 rounded-xl text-center animate-float hidden sm:block">
              <div className="text-2xl font-black text-cyan-400">
                10,800+
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">AI Companies</div>
            </div>
            <div
              className="absolute -bottom-4 -left-4 card-tech p-3 rounded-xl text-center hidden sm:block"
              style={{ animation: "float 3.5s ease-in-out infinite 1s" }}
            >
              <div className="text-2xl font-black text-emerald-400">
                580K+
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">AI Staff</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Company Types Section ────────────────────────────────────────────────────
function CompaniesSection() {
  const { t } = useLang();

  const companies = [
    { icon: "💻", nameKey: "company.software", descKey: "company.software.desc", color: "from-cyan-500/20 to-blue-500/20" },
    { icon: "🎮", nameKey: "company.game", descKey: "company.game.desc", color: "from-violet-500/20 to-purple-500/20" },
    { icon: "🌍", nameKey: "company.geo", descKey: "company.geo.desc", color: "from-emerald-500/20 to-teal-500/20" },
    { icon: "🎬", nameKey: "company.animation", descKey: "company.animation.desc", color: "from-rose-500/20 to-pink-500/20" },
    { icon: "📱", nameKey: "company.content", descKey: "company.content.desc", color: "from-orange-500/20 to-amber-500/20" },
    { icon: "📣", nameKey: "company.marketing", descKey: "company.marketing.desc", color: "from-sky-500/20 to-blue-500/20" },
    { icon: "⚙️", nameKey: "company.outsourcing", descKey: "company.outsourcing.desc", color: "from-slate-500/20 to-gray-500/20" },
    { icon: "💼", nameKey: "company.consulting", descKey: "company.consulting.desc", color: "from-indigo-500/20 to-purple-500/20" },
  ];

  return (
    <section id="companies" className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 radial-glow-purple pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="01"
          badge={t("companies.badge")}
          title={t("companies.title")}
          desc={t("companies.desc")}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {companies.map((c, i) => (
            <div
              key={i}
              className={`card-tech p-5 sm:p-6 cursor-pointer group bg-gradient-to-br ${c.color}`}
            >
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {c.icon}
              </div>
              <div className="font-bold text-white text-sm sm:text-base mb-1">
                {t(c.nameKey)}
              </div>
              <div className="text-xs text-slate-400">{t(c.descKey)}</div>
              <div className="mt-3 flex items-center gap-1 text-cyan-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00d4ff] animate-pulse" />
                One Click →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Feature Card with animated progress bars ─────────────────────────────────
function FeatureCard({
  feat,
  colorMap,
  t,
}: {
  feat: {
    icon: string;
    titleKey: string;
    descKey: string;
    tags: string[];
    color: string;
    metrics: { label: string; pct: number }[];
  };
  colorMap: Record<string, { bar: string; barHex: string; text: string; bg: string }>;
  t: (k: string) => string;
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const c = colorMap[feat.color];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), 100);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="card-tech p-6 sm:p-8">
      <div className={`w-14 h-14 ${c.bg} rounded-2xl flex items-center justify-center text-2xl mb-5`}>
        {feat.icon}
      </div>
      <h3 className={`text-xl font-bold ${c.text} mb-3`}>
        {t(feat.titleKey)}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-5">
        {t(feat.descKey)}
      </p>

      <div className="space-y-3 mb-5">
        {feat.metrics.map((m, j) => (
          <div key={j}>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-slate-500 font-mono">{m.label}</span>
              <span className={`text-xs font-mono ${c.text}`}>{m.pct}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: animated ? `${m.pct}%` : "0%",
                  background: `linear-gradient(90deg, ${c.barHex}, ${c.barHex}aa)`,
                  transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${j * 0.15}s`,
                  boxShadow: animated ? `0 0 8px ${c.barHex}66` : "none",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {feat.tags.map((tagKey) => (
          <span key={tagKey} className="tag-tech text-xs">
            {t(tagKey)}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function FeaturesSection() {
  const { t } = useLang();

  const features = [
    {
      icon: "🏗️",
      titleKey: "feat1.title",
      descKey: "feat1.desc",
      tags: ["feat1.tag1", "feat1.tag2", "feat1.tag3"],
      color: "cyan",
      metrics: [
        { label: "CEO Layer", pct: 100 },
        { label: "Management", pct: 80 },
        { label: "Execution", pct: 60 },
      ],
    },
    {
      icon: "🤝",
      titleKey: "feat2.title",
      descKey: "feat2.desc",
      tags: ["feat2.tag1", "feat2.tag2", "feat2.tag3"],
      color: "violet",
      metrics: [
        { label: "Tech Dev", pct: 90 },
        { label: "Content", pct: 75 },
        { label: "Operations", pct: 85 },
      ],
    },
    {
      icon: "📋",
      titleKey: "feat3.title",
      descKey: "feat3.desc",
      tags: ["feat3.tag1", "feat3.tag2", "feat3.tag3"],
      color: "emerald",
      metrics: [
        { label: "Task Auto", pct: 95 },
        { label: "Quality Gate", pct: 88 },
        { label: "KPI Track", pct: 92 },
      ],
    },
    {
      icon: "🖥️",
      titleKey: "feat4.title",
      descKey: "feat4.desc",
      tags: ["feat4.tag1", "feat4.tag2", "feat4.tag3"],
      color: "amber",
      metrics: [
        { label: "Meeting Rooms", pct: 100 },
        { label: "Collaboration", pct: 96 },
        { label: "Data Board", pct: 100 },
      ],
    },
  ];

  const colorMap: Record<string, { bar: string; barHex: string; text: string; bg: string }> = {
    cyan:    { bar: "bg-cyan-400",    barHex: "#22d3ee", text: "text-cyan-400",    bg: "bg-cyan-400/10" },
    violet:  { bar: "bg-violet-400",  barHex: "#a78bfa", text: "text-violet-400",  bg: "bg-violet-400/10" },
    emerald: { bar: "bg-emerald-400", barHex: "#34d399", text: "text-emerald-400", bg: "bg-emerald-400/10" },
    amber:   { bar: "bg-amber-400",   barHex: "#fbbf24", text: "text-amber-400",   bg: "bg-amber-400/10" },
  };

  return (
    <section id="features" className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 radial-glow-cyan pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="02"
          badge={t("features.badge")}
          title={t("features.title")}
          desc={t("features.desc")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feat, i) => (
            <FeatureCard key={i} feat={feat} colorMap={colorMap} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Revenue Section ──────────────────────────────────────────────────────────
function RevenueSection() {
  const { t } = useLang();

  const revenues = [
    {
      num: "01",
      icon: "🏪",
      titleKey: "rev1.title",
      subKey: "rev1.sub",
      descKey: "rev1.desc",
      color: "cyan",
    },
    {
      num: "02",
      icon: "📺",
      titleKey: "rev2.title",
      subKey: "rev2.sub",
      descKey: "rev2.desc",
      color: "violet",
    },
    {
      num: "03",
      icon: "⚡",
      titleKey: "rev3.title",
      subKey: "rev3.sub",
      descKey: "rev3.desc",
      color: "emerald",
    },
  ];

  return (
    <section className="py-20 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="03"
          badge={t("revenue.badge")}
          title={t("revenue.title")}
          desc={t("revenue.desc")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {revenues.map((rev, i) => (
            <div key={i} className="card-tech p-8 relative overflow-hidden group">
              <div className="absolute top-4 right-4 text-6xl font-black text-white/3 font-mono select-none">
                {rev.num}
              </div>
              <div className="text-3xl mb-4">{rev.icon}</div>
              <div className="text-xs font-mono text-slate-500 mb-2 uppercase tracking-widest">
                {t(rev.subKey)}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t(rev.titleKey)}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t(rev.descKey)}</p>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
            </div>
          ))}
        </div>

        <div className="mt-10 card-tech p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-emerald-500/5" />
          <div className="relative">
            <div className="text-4xl sm:text-5xl font-black gradient-text mb-2">7 × 24H</div>
            <div className="text-slate-400 text-lg">
              {t("rev3.title")} — {t("rev3.sub")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Workforce Section ────────────────────────────────────────────────────────
function WorkforceSection() {
  const { t } = useLang();

  const roles = [
    { icon: "💻", key: "wf.dev", count: "120K+", color: "text-cyan-400", bgColor: "bg-cyan-400/10" },
    { icon: "✍️", key: "wf.content", count: "95K+", color: "text-violet-400", bgColor: "bg-violet-400/10" },
    { icon: "📣", key: "wf.ops", count: "85K+", color: "text-emerald-400", bgColor: "bg-emerald-400/10" },
    { icon: "🎧", key: "wf.support", count: "140K+", color: "text-amber-400", bgColor: "bg-amber-400/10" },
    { icon: "📊", key: "wf.data", count: "140K+", color: "text-rose-400", bgColor: "bg-rose-400/10" },
  ];

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 radial-glow-purple pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="04"
          badge={t("workforce.badge")}
          title={t("workforce.title")}
          desc={t("workforce.desc")}
        />

        {/* Central AI Brain visual */}
        <div className="relative flex justify-center mb-16">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-600/20 border border-cyan-400/30 flex flex-col items-center justify-center backdrop-blur-xl">
                <div className="text-3xl">🤖</div>
                <div className="text-xs text-cyan-400 font-mono mt-1">AI Brain</div>
              </div>
            </div>
            <div className="absolute inset-0 orbit-ring" />
            <div className="absolute inset-4 orbit-ring" style={{ animationDirection: "reverse", animationDuration: "10s" }} />

            {roles.map((role, i) => {
              const angle = (i / roles.length) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const x = 50 + Math.cos(rad) * 42;
              const y = 50 + Math.sin(rad) * 42;
              return (
                <div
                  key={i}
                  className={`absolute w-10 h-10 ${role.bgColor} rounded-xl flex items-center justify-center text-lg border border-white/10 -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform cursor-default`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  title={t(role.key)}
                >
                  {role.icon}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {roles.map((role, i) => (
            <div key={i} className="card-tech p-5 text-center group hover:scale-105 transition-transform">
              <div className={`w-12 h-12 ${role.bgColor} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3`}>
                {role.icon}
              </div>
              <div className={`text-xl font-black ${role.color} mb-1`}>{role.count}</div>
              <div className="text-sm font-medium text-white mb-1">{t(role.key)}</div>
              <div className="flex justify-center">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00d4ff] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing Section ──────────────────────────────────────────────────────────
function PricingSection() {
  const { t } = useLang();
  const [yearly, setYearly] = useState(false);

  const features = [
    "pricing.feature1", "pricing.feature2", "pricing.feature3", "pricing.feature4",
    "pricing.feature5", "pricing.feature6", "pricing.feature7", "pricing.feature8",
  ];

  return (
    <section id="pricing" className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="05"
          badge={t("pricing.badge")}
          title={t("pricing.title")}
        />

        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium ${!yearly ? "text-white" : "text-slate-500"}`}>
            {t("pricing.monthly")}
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            className={`relative w-14 h-7 rounded-full transition-colors ${yearly ? "bg-cyan-400" : "bg-slate-700"}`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${yearly ? "translate-x-8" : "translate-x-1"}`} />
          </button>
          <span className={`text-sm font-medium ${yearly ? "text-white" : "text-slate-500"}`}>
            {t("pricing.yearly")}
          </span>
          {yearly && (
            <span className="text-xs bg-emerald-400/20 text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded-full">
              {t("pricing.save")}
            </span>
          )}
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 card-tech p-8 relative overflow-hidden border-cyan-400/30">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5" />
            <div className="relative">
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl sm:text-6xl font-black gradient-text-cyan">
                  {yearly ? t("pricing.year.price") : t("pricing.month.price")}
                </span>
                <span className="text-slate-400 text-lg mb-2">
                  {yearly ? t("pricing.year.unit") : t("pricing.month.unit")}
                </span>
              </div>
              <p className="text-slate-400 mb-8 text-sm">
                {yearly ? "一次性付费，享受全年服务" : "灵活订阅，随时取消"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {features.map((fKey) => (
                  <div key={fKey} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-cyan-400/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-cyan-400 text-xs">✓</span>
                    </div>
                    <span className="text-sm text-slate-300">{t(fKey)}</span>
                  </div>
                ))}
              </div>

              <a
                href="http://123.56.0.189:8000/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon px-8 py-4 rounded-full text-base font-bold w-full block text-center"
              >
                {t("pricing.cta")}
              </a>
            </div>
          </div>

          <div className="card-tech p-8 flex flex-col justify-between">
            <div>
              <div className="text-3xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-white mb-3">{t("pricing.custom.title")}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{t("pricing.custom.desc")}</p>
            </div>
            <a
              href="mailto:contact@aicompanyos.com"
              className="btn-outline-neon px-6 py-3 rounded-full text-sm font-bold text-center block"
            >
              {t("pricing.custom.cta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────
function CTASection() {
  const { t } = useLang();

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-violet-900/10 to-emerald-900/10" />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-[20vw] font-black text-white/[0.02] select-none tracking-tighter leading-none">
          CEO
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 tag-tech mb-6">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00d4ff] animate-pulse" />
          Now
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00d4ff] animate-pulse" />
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
          {t("cta.title1")}
        </h2>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black gradient-text mb-6">
          {t("cta.title2")}
        </h2>
        <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
          {t("cta.desc")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="http://123.56.0.189:8000/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon px-10 py-5 rounded-full text-xl font-black inline-block"
          >
            {t("cta.btn1")}
          </a>
          <a
            href="http://123.56.0.189:8000/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-neon px-10 py-5 rounded-full text-xl font-bold inline-block"
          >
            {t("cta.btn2")} →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-[rgba(0,212,255,0.08)] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
                <span className="text-white font-black text-sm">AI</span>
              </div>
              <div>
                <div className="font-black text-white text-base leading-none">AI Company</div>
                <div className="font-mono text-[9px] text-cyan-400 tracking-widest">ENTERPRISE OS</div>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">{t("footer.tagline")}</p>
          </div>

          <div>
            <div className="text-white font-semibold mb-4">{t("footer.product")}</div>
            <div className="space-y-3">
              <a href="#features" className="block text-slate-500 hover:text-cyan-400 text-sm transition-colors">{t("footer.features")}</a>
              <a href="#pricing" className="block text-slate-500 hover:text-cyan-400 text-sm transition-colors">{t("footer.pricing")}</a>
              <a href="http://123.56.0.189:8000/" target="_blank" rel="noopener noreferrer" className="block text-slate-500 hover:text-cyan-400 text-sm transition-colors">{t("footer.demo")}</a>
            </div>
          </div>

          <div>
            <div className="text-white font-semibold mb-4">{t("footer.company")}</div>
            <div className="space-y-3">
              <a href="#" className="block text-slate-500 hover:text-cyan-400 text-sm transition-colors">{t("footer.about")}</a>
              <a href="mailto:contact@aicompanyos.com" className="block text-slate-500 hover:text-cyan-400 text-sm transition-colors">{t("footer.contact")}</a>
            </div>
          </div>

          <div>
            <div className="text-white font-semibold mb-4">System Status</div>
            <div className="space-y-3">
              {[
                { label: "API", status: "Operational" },
                { label: "AI Engine", status: "Operational" },
                { label: "Market", status: "Operational" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-cyan" />
                  <span className="text-slate-500 text-sm">{s.label}</span>
                  <span className="text-emerald-400 text-xs ml-auto">{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-divider mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-slate-600 text-sm font-mono">
            © 2025 AI Company OS. {t("footer.rights")}.
          </div>
          <div className="flex items-center gap-2 text-slate-600 text-xs font-mono">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00d4ff] animate-pulse" />
            Powered by AI
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function PageContent() {
  return (
    <main className="min-h-screen bg-[#030712]">
      <Navbar />
      <HeroSection />
      <div className="section-divider" />
      <CompaniesSection />
      <div className="section-divider" />
      <FeaturesSection />
      <div className="section-divider" />
      <DataCharts />
      <div className="section-divider" />
      <RevenueSection />
      <div className="section-divider" />
      <WorkforceSection />
      <div className="section-divider" />
      <PricingSection />
      <div className="section-divider" />
      <CTASection />
      <Footer />
    </main>
  );
}

export default function ClientApp() {
  return (
    <LangProvider>
      <PageContent />
    </LangProvider>
  );
}
