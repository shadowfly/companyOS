"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";

interface BarData {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

function BarChart({ data, title }: { data: BarData[]; title: string }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const MAX_HEIGHT = 120; // px

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay so transition is visible
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
    <div ref={ref} className="card-tech p-6">
      <div className="text-sm font-semibold text-slate-400 mb-6 font-mono">{title}</div>
      <div className="flex items-end gap-2 sm:gap-3" style={{ height: `${MAX_HEIGHT + 40}px` }}>
        {data.map((bar, i) => {
          const heightPx = animated ? Math.max(4, (bar.value / bar.maxValue) * MAX_HEIGHT) : 4;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="text-[10px] text-slate-500 font-mono whitespace-nowrap transition-opacity duration-500"
                style={{ opacity: animated ? 1 : 0 }}
              >
                {bar.value >= 10000
                  ? `${(bar.value / 1000).toFixed(0)}k`
                  : bar.value >= 1000
                  ? `${(bar.value / 1000).toFixed(1)}k`
                  : bar.value}
              </div>
              <div
                className="w-full rounded-t-md"
                style={{
                  height: `${heightPx}px`,
                  background: bar.color,
                  transition: `height 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.12}s`,
                  boxShadow: animated ? `0 0 12px ${bar.color.includes("cyan") ? "rgba(0,212,255,0.4)" : "rgba(124,58,237,0.4)"}` : "none",
                }}
              />
              <div className="text-[10px] text-slate-500 font-mono">{bar.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface DonutData {
  label: string;
  value: number;
  color: string;
}

function DonutChart({ data, title, centerValue, centerLabel }: {
  data: DonutData[];
  title: string;
  centerValue: string;
  centerLabel: string;
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const size = 150;
  const strokeWidth = 16;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), 150);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const total = data.reduce((s, d) => s + d.value, 0);

  // Pre-compute offsets — no mutation during render
  const segmentOffsets = data.reduce<number[]>((acc, d, i) => {
    const prev = i === 0 ? 0 : acc[i - 1] + (data[i - 1].value / total) * circumference;
    return [...acc, prev];
  }, []);

  return (
    <div ref={ref} className="card-tech p-6">
      <div className="text-sm font-semibold text-slate-400 mb-4 font-mono">{title}</div>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
            {/* Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="rgba(0,212,255,0.08)"
              strokeWidth={strokeWidth}
            />
            {data.map((d, i) => {
              const pct = d.value / total;
              const dash = animated ? pct * circumference : 0;
              const gap = circumference;
              const dashOffset = -segmentOffsets[i];
              return (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={strokeWidth - 2}
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="butt"
                  style={{
                    transition: `stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1) ${i * 0.15}s`,
                  }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #00d4ff, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {centerValue}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{centerLabel}</div>
          </div>
        </div>
        <div className="space-y-2.5 flex-1 w-full">
          {data.map((d, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: d.color, boxShadow: `0 0 6px ${d.color}` }}
                />
                <span className="text-xs text-slate-400 truncate">{d.label}</span>
              </div>
              <span className="text-xs font-mono text-slate-300 flex-shrink-0">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface LinePoint {
  label: string;
  value: number;
}

function LineChart({ data, title, color }: { data: LinePoint[]; title: string; color: string }) {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const w = 600;
  const h = 120;
  const padX = 8;
  const padY = 12;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setProgress(1), 100);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value));
  const range = maxVal - minVal || 1;

  const pts = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * (w - 2 * padX),
    y: h - padY - ((d.value - minVal) / range) * (h - 2 * padY),
    ...d,
  }));

  // Smooth cubic bezier path
  const smoothPath = pts.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
  }).join(" ");

  const areaPath = `${smoothPath} L ${pts[pts.length - 1].x} ${h} L ${pts[0].x} ${h} Z`;
  const gradId = `lg-${title.replace(/\s/g, "")}`;
  const clipId = `clip-${title.replace(/\s/g, "")}`;

  return (
    <div ref={ref} className="card-tech p-6">
      <div className="text-sm font-semibold text-slate-400 mb-4 font-mono">{title}</div>
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full"
          style={{ height: "120px" }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
            <clipPath id={clipId}>
              <rect
                x="0" y="0"
                width={w * progress}
                height={h}
                style={{ transition: "width 1.8s cubic-bezier(0.4,0,0.2,1) 0.1s" }}
              />
            </clipPath>
          </defs>

          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={t}
              x1={padX} y1={padY + t * (h - 2 * padY)}
              x2={w - padX} y2={padY + t * (h - 2 * padY)}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          <path d={areaPath} fill={`url(#${gradId})`} clipPath={`url(#${clipId})`} />

          {/* Line */}
          <path
            d={smoothPath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            clipPath={`url(#${clipId})`}
          />

          {/* Data points */}
          {pts.map((p, i) => (
            <g key={i} clipPath={`url(#${clipId})`}>
              <circle cx={p.x} cy={p.y} r="5" fill={color} opacity="0.3" />
              <circle cx={p.x} cy={p.y} r="3" fill={color} />
            </g>
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-1 px-1">
          {data.map((d, i) => (
            <span key={i} className="text-[10px] text-slate-600 font-mono">{d.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DataCharts() {
  const { t } = useLang();

  const months = [
    t("chart.jan"), t("chart.feb"), t("chart.mar"),
    t("chart.apr"), t("chart.may"), t("chart.jun"),
  ];

  const barData: BarData[] = months.map((label, i) => ({
    label,
    value: [1200, 2800, 4500, 6200, 8400, 10800][i],
    maxValue: 12000,
    color: `linear-gradient(180deg, #00d4ff, #7c3aed)`,
  }));

  const growthData: LinePoint[] = months.map((label, i) => ({
    label,
    value: [12, 18, 25, 34, 42, 58][i],
  }));

  const donutData: DonutData[] = [
    { label: t("company.software"), value: 32, color: "#00d4ff" },
    { label: t("company.content"), value: 24, color: "#7c3aed" },
    { label: t("company.marketing"), value: 18, color: "#10b981" },
    { label: t("company.game"), value: 14, color: "#f59e0b" },
    { label: t("company.outsourcing"), value: 12, color: "#ef4444" },
  ];

  return (
    <section id="data" className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 radial-glow-cyan pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 tag-tech mb-4">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00d4ff] animate-pulse" />
            {t("chart.badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            {t("chart.title")}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            {t("chart.desc")}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: t("chart.companies"), value: "10,800+", icon: "🏢", color: "text-cyan-400" },
            { label: t("chart.tasks"), value: "2.4M+", icon: "✅", color: "text-violet-400" },
            { label: t("chart.revenue"), value: "$18.6M", icon: "💰", color: "text-emerald-400" },
            { label: t("chart.staff"), value: "580K+", icon: "🤖", color: "text-amber-400" },
          ].map((kpi, i) => (
            <div key={i} className="card-tech p-5 text-center">
              <div className="text-2xl mb-2">{kpi.icon}</div>
              <div className={`text-2xl sm:text-3xl font-black ${kpi.color} mb-1`}>{kpi.value}</div>
              <div className="text-xs text-slate-500 font-mono">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BarChart data={barData} title={`📊 ${t("chart.companies")}`} />
          </div>
          <div>
            <DonutChart
              data={donutData}
              title={`🥧 ${t("companies.title")}`}
              centerValue="7"
              centerLabel={t("companies.badge")}
            />
          </div>
          <div className="lg:col-span-3">
            <LineChart
              data={growthData}
              title={`📈 ${t("chart.growth")} (%)`}
              color="#00d4ff"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
