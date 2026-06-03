"use client";

import React, { createContext, useContext, useState } from "react";

export type Lang = "zh" | "en";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Nav
  "nav.scenarios": { zh: "场景", en: "Scenarios" },
  "nav.services": { zh: "合作方式", en: "Services" },
  "nav.audiences": { zh: "目标用户", en: "Audiences" },
  "nav.pricing": { zh: "定价", en: "Pricing" },
  "nav.demo": { zh: "查看演示", en: "View Demo" },
  "nav.start": { zh: "立即开始", en: "Get Started" },

  // Hero
  "hero.badge": { zh: "AI 驱动的企业操作系统", en: "AI-Powered Enterprise OS" },
  "hero.title1": { zh: "一键创建", en: "Create Your" },
  "hero.title2": { zh: "AI公司", en: "AI Company" },
  "hero.title3": { zh: "立即开始变现", en: "Start Monetizing Now" },
  "hero.desc": { zh: "按照世界500强公司标准，一键创建你的AI公司。真实的组织架构、智能招聘系统、自动化运营——让AI为你24小时赚钱", en: "Build your AI company to Fortune 500 standards with one click. Real org structure, smart hiring, automated operations — let AI earn for you 24/7" },
  "hero.cta1": { zh: "🚀 立即创建公司", en: "🚀 Create Company Now" },
  "hero.cta2": { zh: "查看演示", en: "View Demo" },
  "hero.stat1.num": { zh: "10,000+", en: "10,000+" },
  "hero.stat1.label": { zh: "AI公司已创建", en: "AI Companies Created" },
  "hero.stat2.num": { zh: "7×24h", en: "7×24h" },
  "hero.stat2.label": { zh: "自动化运营", en: "Automated Operations" },
  "hero.stat3.num": { zh: "$48", en: "$48" },
  "hero.stat3.label": { zh: "月起", en: "per Month" },

  // Companies
  "companies.badge": { zh: "多元化业务", en: "Diverse Business" },
   "companies.title": { zh: "支持多种AI公司形态", en: "Multiple AI Company Types" },
  "companies.desc": { zh: "从软件开发到内容创作，覆盖主流商业场景，一键创建专属AI公司", en: "From software development to content creation, covering all major business scenarios" },
  "company.software": { zh: "软件公司", en: "Software Company" },
  "company.software.desc": { zh: "SaaS / 工具开发", en: "SaaS / Tool Development" },
  "company.game": { zh: "游戏公司", en: "Game Company" },
  "company.game.desc": { zh: "自动生成游戏内容", en: "Auto-Generate Game Content" },
  "company.geo": { zh: "GEO业务公司", en: "GEO Business Company" },
  "company.geo.desc": { zh: "地理 / 数据业务", en: "Geographic / Data Business" },
  "company.animation": { zh: "动画与视频公司", en: "Animation & Video Company" },
  "company.animation.desc": { zh: "AI视频内容生产", en: "AI Video Content Production" },
  "company.content": { zh: "内容创作工作室", en: "Content Studio" },
  "company.content.desc": { zh: "短视频 / 自媒体", en: "Short Video / Social Media" },
  "company.marketing": { zh: "营销与广告公司", en: "Marketing & Ad Company" },
  "company.marketing.desc": { zh: "自动化营销投放", en: "Automated Marketing" },
   "company.outsourcing": { zh: "自动化外包公司", en: "Automation Outsourcing" },
   "company.outsourcing.desc": { zh: "AI交付业务外包", en: "AI-Delivered Outsourcing" },
   "company.consulting": { zh: "咨询公司", en: "Consulting Company" },
   "company.consulting.desc": { zh: "AI商务咨询服务", en: "AI Business Consulting" },

  // Features
  "features.badge": { zh: "企业级系统", en: "Enterprise-Grade System" },
  "features.title": { zh: "核心功能体系", en: "Core Feature System" },
  "features.desc": { zh: "按照世界500强企业标准设计，完整复现真实公司运营模式", en: "Designed to Fortune 500 standards, fully replicating real company operations" },
  "feat1.title": { zh: "真实公司组织架构", en: "Real Org Structure" },
  "feat1.desc": { zh: "CEO / 管理层 / 执行层自动生成，清晰的层级结构与职责划分", en: "Auto-generate CEO / management / execution layers with clear hierarchy and responsibilities" },
  "feat1.tag1": { zh: "层级架构", en: "Hierarchy" },
  "feat1.tag2": { zh: "职责划分", en: "Responsibilities" },
  "feat1.tag3": { zh: "AI员工", en: "AI Staff" },
  "feat2.title": { zh: "智能招聘与裁员系统", en: "Smart HR System" },
  "feat2.desc": { zh: "内置人才市场，无限AI员工供给，自动匹配岗位能力，按绩效优化团队", en: "Built-in talent market, unlimited AI staff, auto-match skills, optimize teams by performance" },
  "feat2.tag1": { zh: "人才市场", en: "Talent Market" },
  "feat2.tag2": { zh: "绩效驱动", en: "Performance" },
  "feat2.tag3": { zh: "无限员工", en: "Unlimited Staff" },
  "feat3.title": { zh: "任务与项目管理系统", en: "Task & Project System" },
  "feat3.desc": { zh: "任务分派带质量关卡，自动执行与反馈，项目成本实时追踪，KPI考核", en: "Task delegation with quality gates, auto-execution, real-time cost tracking, KPI assessments" },
  "feat3.tag1": { zh: "质量关卡", en: "Quality Gates" },
  "feat3.tag2": { zh: "成本追踪", en: "Cost Tracking" },
  "feat3.tag3": { zh: "KPI考核", en: "KPI Assessment" },
  "feat4.title": { zh: "企业办公模拟系统", en: "Virtual Office System" },
  "feat4.desc": { zh: "虚拟会议室、AI团队协作、实时运营数据看板、企业级流程管理", en: "Virtual meeting rooms, AI team collaboration, real-time ops dashboard, enterprise process management" },
  "feat4.tag1": { zh: "虚拟会议室", en: "Meeting Rooms" },
  "feat4.tag2": { zh: "数据看板", en: "Data Dashboard" },
  "feat4.tag3": { zh: "流程管理", en: "Process Mgmt" },

  // Revenue
  "revenue.badge": { zh: "盈利系统", en: "Revenue System" },
  "revenue.title": { zh: "多元变现渠道", en: "Multiple Revenue Streams" },
  "revenue.desc": { zh: "三大盈利引擎，AI自动运营，7×24小时持续产生收益", en: "Three revenue engines, AI-automated operations, 24/7 continuous income generation" },
  "rev1.title": { zh: "业务大厅", en: "Business Hall" },
  "rev1.sub": { zh: "核心收入来源", en: "Core Revenue Source" },
  "rev1.desc": { zh: "上传你的服务或产品，AI自动匹配市场需求，员工执行项目，快速获得收入", en: "Upload your services or products, AI auto-matches market demand, staff execute projects, earn revenue fast" },
  "rev2.title": { zh: "广告分成系统", en: "Ad Revenue System" },
  "rev2.sub": { zh: "持续佣金收益", en: "Continuous Commission" },
  "rev2.desc": { zh: "接入广告任务，自动投放与优化，获取持续稳定的佣金收益流", en: "Connect ad tasks, auto-placement and optimization, earn continuous stable commission streams" },
  "rev3.title": { zh: "自动化运营", en: "Automated Operations" },
  "rev3.sub": { zh: "零人工成本", en: "Zero Labor Cost" },
  "rev3.desc": { zh: "AI自动处理客户需求，7×24小时持续工作，零人工成本实现规模化扩张", en: "AI handles all client needs, 24/7 operation, scale your business with zero labor costs" },

  // Workforce
  "workforce.badge": { zh: "AI人才市场", en: "AI Workforce Market" },
  "workforce.title": { zh: "无限AI员工，随用随招", en: "Unlimited AI Staff, Hire Anytime" },
  "workforce.desc": { zh: "所有员工均由系统提供与维护，覆盖企业运营各核心职能", en: "All staff provided and maintained by the system, covering all core enterprise functions" },
  "wf.dev": { zh: "技术开发", en: "Tech Dev" },
  "wf.content": { zh: "内容创作", en: "Content Creation" },
  "wf.ops": { zh: "运营推广", en: "Operations" },
  "wf.support": { zh: "客服支持", en: "Customer Support" },
  "wf.data": { zh: "数据分析", en: "Data Analysis" },

  // Chart Section
  "chart.badge": { zh: "平台数据", en: "Platform Data" },
  "chart.title": { zh: "真实运营数据", en: "Real Operational Data" },
  "chart.desc": { zh: "平台实时数据，见证AI公司的规模化增长", en: "Real-time platform data, witness the scale growth of AI companies" },
  "chart.companies": { zh: "活跃AI公司", en: "Active AI Companies" },
  "chart.tasks": { zh: "任务完成量", en: "Tasks Completed" },
  "chart.revenue": { zh: "平台收益($)", en: "Platform Revenue ($)" },
  "chart.staff": { zh: "AI员工总数", en: "Total AI Staff" },
  "chart.growth": { zh: "月度增长率", en: "Monthly Growth Rate" },
  "chart.jan": { zh: "1月", en: "Jan" },
  "chart.feb": { zh: "2月", en: "Feb" },
  "chart.mar": { zh: "3月", en: "Mar" },
  "chart.apr": { zh: "4月", en: "Apr" },
  "chart.may": { zh: "5月", en: "May" },
  "chart.jun": { zh: "6月", en: "Jun" },

  // Pricing
  "pricing.badge": { zh: "透明定价", en: "Transparent Pricing" },
  "pricing.title": { zh: "选择你的方案", en: "Choose Your Plan" },
  "pricing.monthly": { zh: "月付", en: "Monthly" },
  "pricing.yearly": { zh: "年付", en: "Yearly" },
  "pricing.save": { zh: "省16%", en: "Save 16%" },
  "pricing.month.price": { zh: "$48", en: "$48" },
  "pricing.month.unit": { zh: "/月", en: "/mo" },
  "pricing.year.price": { zh: "$480", en: "$480" },
  "pricing.year.unit": { zh: "/年", en: "/yr" },
  "pricing.feature1": { zh: "一键创建AI公司", en: "One-click AI company creation" },
  "pricing.feature2": { zh: "完整组织架构系统", en: "Full org structure system" },
  "pricing.feature3": { zh: "无限AI员工", en: "Unlimited AI employees" },
  "pricing.feature4": { zh: "业务大厅 & 收益系统", en: "Business Hall & Revenue system" },
  "pricing.feature5": { zh: "广告分成收益", en: "Ad revenue sharing" },
  "pricing.feature6": { zh: "7×24 自动化运营", en: "7×24 automated operations" },
  "pricing.feature7": { zh: "实时数据看板", en: "Real-time data dashboard" },
  "pricing.feature8": { zh: "KPI & 绩效系统", en: "KPI & performance system" },
  "pricing.cta": { zh: "立即开始创建", en: "Start Creating Now" },
  "pricing.custom.title": { zh: "企业定制方案", en: "Enterprise Custom Plan" },
  "pricing.custom.desc": { zh: "需要定制公司架构或 FDE 协助？联系我们获取专属方案", en: "Need custom company architecture or FDE assistance? Contact us for a tailored plan" },
  "pricing.custom.cta": { zh: "立即联系", en: "Contact Us" },

  // CTA
  "cta.title1": { zh: "从0到1，只需点击一次", en: "From 0 to 1, Just One Click" },
  "cta.title2": { zh: "今天开始，让AI为你赚钱", en: "Start Today, Let AI Earn for You" },
  "cta.desc": { zh: "加入10,000+创始人，用AI公司OS实现财务自由", en: "Join 10,000+ founders achieving financial freedom with AI Company OS" },
  "cta.btn1": { zh: "🚀 现在立即创建一家公司", en: "🚀 Create a Company Right Now" },
  "cta.btn2": { zh: "查看演示", en: "View Demo" },

  // Footer
  "footer.tagline": { zh: "AI驱动的企业操作系统，重新定义公司创建方式", en: "AI-powered enterprise OS, redefining how companies are built" },
  "footer.product": { zh: "产品", en: "Product" },
  "footer.features": { zh: "功能特性", en: "Features" },
  "footer.pricing": { zh: "定价方案", en: "Pricing" },
  "footer.demo": { zh: "在线演示", en: "Live Demo" },
  "footer.contact": { zh: "联系我们", en: "Contact" },
  "footer.company": { zh: "关于", en: "Company" },
  "footer.about": { zh: "关于我们", en: "About Us" },
  "footer.rights": { zh: "保留所有权利", en: "All rights reserved" },
};

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("zh");

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
