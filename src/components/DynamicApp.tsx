"use client";

import dynamic from "next/dynamic";

const ClientApp = dynamic(() => import("@/components/ClientApp"), {
  ssr: false,
  loading: () => (
    <main
      style={{
        minHeight: "100vh",
        background: "#030712",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "white", fontWeight: 900, fontSize: 13 }}>
            AI
          </span>
        </div>
        <div
          style={{ color: "#475569", fontFamily: "monospace", fontSize: 14 }}
        >
          Loading...
        </div>
      </div>
    </main>
  ),
});

export default function DynamicApp() {
  return <ClientApp />;
}
