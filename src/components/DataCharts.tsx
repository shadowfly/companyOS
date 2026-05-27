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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="card-tech p-6">
      <div className="text-sm font-semibold text-slate-400 mb-6 font-mono">{title}</div>
      <div className="flex items-end gap-3 h-36">
        {data.map((bar, i) => {
          const pct = animated ? (bar.value / bar.maxValue) * 100 : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs text-slate-500 font-mono whitespace-nowrap">
                {bar.value >= 10000
                  ? `${(bar.value / 1000).toFixed(0)}k`
                  : bar.value >= 1000
                  ? `${(bar.value / 1000).toFixed(1)}k`
                  : bar.value}
              </div>
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    height: `${pct}%`,
                    minHeight: animated ? "4px" : "0",
                    background: bar.color,
                    transition: `height 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s`,
                  }}
                />
              </div>
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
  const size = 140;
  const strokeWidth = 14;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const total = data.reduce((s, d) => s + d.value, 0);

  // Pre-compute offsets to avoid mutating during render
  const segmentOffsets = data.reduce<number[]>((acc, d, i) => {
    const prev = i === 0 ? 0 : acc[i - 1] + (data[i - 1].value / total) * circumference;
    return [...acc, prev];
  }, []);

  return (
    <div ref={ref} className="card-tech p-6">
      <div className="text-sm font-semibold text-slate-400 mb-4 font-mono">{title}</div>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
              const gap = circumference - dash;
              const thisOffset = segmentOffsets[i];
              return (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={-thisOffset + circumference / 4}
                  strokeLinecap="round"
                  style={{ transition: `stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.2}s` }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-xl font-black gradient-text-cyan">{centerValue}</div>
            <div className="text-[10px] text-slate-500 font-mono">{centerLabel}</div>
          </div>
        </div>
        <div className="space-y-3 flex-1">
          {data.map((d, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-xs text-slate-400">{d.label}</span>
              </div>
              <span className="text-xs font-mono text-slate-300">{d.value}%</span>
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
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const w = 280;
  const h = 100;
  const pad = 10;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value));
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * (w - 2 * pad),
    y: h - pad - ((d.value - minVal) / range) * (h - 2 * pad),
    ...d,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${h} L ${points[0].x} ${h} Z`;

  return (
    <div ref={ref} className="card-tech p-6">
      <div className="text-sm font-semibold text-slate-400 mb-4 font-mono">{title}</div>
      <div className="overflow-hidden">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full"
          style={{ height: "100px" }}
        >
          <defs>
            <linearGradient id={`area-grad-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
            <clipPath id={`line-clip-${title}`}>
              <rect
                x="0"
                y="0"
                width={animated ? w : 0}
                height={h}
                style={{ transition: "width 1.5s cubic-bezier(0.4,0,0.2,1)" }}
              />
            </clipPath>
          </defs>
          <path
            d={areaD}
            fill={`url(#area-grad-${title})`}
            clipPath={`url(#line-clip-${title})`}
          />
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="2"
            clipPath={`url(#line-clip-${title})`}
          />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill={color}
              clipPath={`url(#line-clip-${title})`}
            />
          ))}
        </svg>
        <div className="flex justify-between mt-2">
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
    color: `linear-gradient(180deg, #00d4ff ${i * 5}%, #7c3aed)`,
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
    { label: t("nav.features"), value: 12, color: "#ef4444" },
  ];

  return (
    <section id="data" className="py-20 lg:py-32 relative">
      {/* Background glow */}
      <div className="absolute inset-0 radial-glow-cyan pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 tag-tech mb-4">
            <span className="ai-dot" />
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
