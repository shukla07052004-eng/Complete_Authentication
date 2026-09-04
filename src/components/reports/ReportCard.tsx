import type { HTMLAttributes } from "react";
import { Card } from "@/components/frontendUi/index.js";
import type { ReportDefinition } from "@/lib/reports/types";

type ReportCardProps = HTMLAttributes<HTMLDivElement> & {
  report: ReportDefinition;
  selected: boolean;
  focused: boolean;
};

export default function ReportCard({
  report,
  selected,
  focused,
  style,
  ...props
}: ReportCardProps) {
  return (
    <Card
      {...props}
      className={`report-nav-card ${props.className ?? ""}`.trim()}
      style={{
        padding: 18,
        border: `1px solid ${selected ? report.accent : "var(--border)"}`,
        background: selected
          ? "var(--surface)"
          : "none",
        boxShadow: selected ? "var(--shadow-md)" : "var(--shadow-xs)",
        display: "grid",
        gap: 14,
        cursor: "pointer",
        minHeight: 12,
        outline: focused ? `2px solid ${report.accent}` : "none",
        outlineOffset: 2,
        ...style,
      }}
    >
      <div
        style={{
          width: 40,
          height: 1,
          borderRadius: 999,
          background: report.accent,
          opacity: selected ? 1 : 0.45,
        }}
      />
      <div>

      <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>
        {report.name}
      </div>
      <div style={{ fontSize: 12.5, color: "var(--ink-40)", lineHeight: 1.6 }}>
        {report.desc}
      </div>
      <div
        style={{
          fontSize: 11,
          // color: selected ? report.accent : "var(--ink-20)",
          color: "var(--ink-40)",
          textTransform: "uppercase",
          fontWeight: 700,
          letterSpacing: ".07em",
        }}
        >
        Open report
        </div>
      </div>
    </Card>
  );
}
