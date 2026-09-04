"use client";

import { useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import ReportLayout, {
  ReportListCard,
  ReportSummaryCard,
  ReportTableCard,
  fmt,
  fmtShort,
} from "@/components/reports/ReportLayout.jsx";
import useFocusList from "@/hooks/useFocusList.js";
import { REPORT_BY_ID } from "@/lib/reports/reportDefinitions";
import { buildProfitLossRows } from "@/lib/reports/calculations";
import { exportProfitReport } from "@/lib/reports/exports";
import type {
  BillWiseProfitRow,
  ItemWiseProfitRow,
  PartyWiseProfitRow,
  ProfitLossRow,
  ReportState,
} from "@/lib/reports/types";
import { DateRangeSearchFilters } from "./ReportFilters";

const PROFIT_SECTIONS = [
  {
    id: "billwise",
    title: "Bill Wise Profit",
    sub: "Invoice-level profit analysis",
    accent: "#1f4e79",
  },
  {
    id: "itemwise",
    title: "Item Wise Profit & Loss",
    sub: "Item margin and quantity analysis",
    accent: "#2d6a4f",
  },
  {
    id: "netprofit",
    title: "Net Profit Dashboard",
    sub: "Gross and net profit summary",
    accent: "#8d5524",
  },
  {
    id: "partywise",
    title: "Party Wise Profit & Loss",
    sub: "Customer and supplier margin view",
    accent: "#7b2cbf",
  },
] as const;

type ReportContext = {
  reportState: ReportState;
  fromDate: string;
  toDate: string;
  setFromDate: (value: string) => void;
  setToDate: (value: string) => void;
  clearBaseFilters: () => void;
};

function ExportButtons({ reportState, fromDate, toDate }: Pick<ReportContext, "reportState" | "fromDate" | "toDate">) {
  return (
    <>
      <button className="sr-only" type="button" aria-hidden="true" tabIndex={-1} />
      <button
        type="button"
        onClick={() => exportProfitReport(reportState, fromDate, toDate)}
        style={{
          padding: "7px 15px",
          borderRadius: "var(--r-sm)",
          border: "1px solid transparent",
          background: "#111",
          color: "#fff",
          fontFamily: "var(--font)",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Export Report
      </button>
    </>
  );
}

function ProfitReportsWorkspace({ reportState }: { reportState: ReportState }) {
  const [activeSectionId, setActiveSectionId] = useState<(typeof PROFIT_SECTIONS)[number]["id"]>("billwise");
  const focusList = useFocusList({
    count: PROFIT_SECTIONS.length,
    orientation: "horizontal",
    onEnter: (index: number, event: ReactKeyboardEvent<HTMLElement>) => {
      event.preventDefault();
      setActiveSectionId(PROFIT_SECTIONS[index].id);
    },
  });

  const activeSection = PROFIT_SECTIONS.find((section) => section.id === activeSectionId) ?? PROFIT_SECTIONS[0];

  return (
    <>
      <ReportListCard title="Profit Report Sections" sub={`Selected: ${activeSection.title}`}>
        <div className="reports-card-grid">
          {PROFIT_SECTIONS.map((section, index) => {
            const active = section.id === activeSectionId;
            return (
              <div
                key={section.id}
                className="focusable-card report-nav-card"
                {...focusList.getItemProps(index, {
                  onClick: () => setActiveSectionId(section.id),
                })}
                style={{
                  padding: 18,
                  cursor: "pointer",
                  border: `1px solid ${active ? section.accent : "var(--border)"}`,
                  background: active ? "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)" : "var(--surface)",
                  boxShadow: active ? "var(--shadow-md)" : "var(--shadow-sm)",
                  borderRadius: "var(--r-lg)",
                  display: "grid",
                  gap: 8,
                  outline: focusList.currentIndex === index ? `2px solid ${section.accent}` : "none",
                  outlineOffset: 2,
                }}
              >
                <div style={{ width: 44, height: 5, borderRadius: 999, background: section.accent }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{section.title}</div>
                <div style={{ fontSize: 12, color: "var(--ink-40)", lineHeight: 1.6 }}>{section.sub}</div>
              </div>
            );
          })}
        </div>
      </ReportListCard>

      {activeSectionId === "billwise" && (
        <ReportTableCard
          title="Bill Wise Profit"
          sub="Profit earned on each sales invoice."
          focusId="report-profit-billwise"
          cols={[
            { key: "id", label: "Invoice No", mono: true },
            { key: "customerName", label: "Customer Name" },
            { key: "salesAmount", label: "Sales Amount", right: true, render: (value: number) => fmt(value) },
            { key: "purchaseCost", label: "Purchase Cost", right: true, render: (value: number) => fmt(value) },
            {
              key: "profitEarned",
              label: "Profit Earned",
              right: true,
              render: (value: number) => <strong style={{ color: value >= 0 ? "var(--green)" : "var(--red)" }}>{fmt(value)}</strong>,
            },
            { key: "profitPct", label: "Profit %", right: true, render: (value: number) => `${value.toFixed(1)}%` },
          ]}
          rows={reportState.billWiseProfit as BillWiseProfitRow[]}
          emptyMsg="No invoice profits available for the selected period."
        />
      )}

      {activeSectionId === "itemwise" && (
        <ReportTableCard
          title="Item Wise Profit & Loss"
          sub="Margins by sold item."
          focusId="report-profit-itemwise"
          cols={[
            { key: "itemName", label: "Item Name", wrap: true },
            { key: "quantitySold", label: "Quantity Sold", right: true },
            { key: "purchaseCost", label: "Purchase Cost", right: true, render: (value: number) => fmt(value) },
            { key: "saleValue", label: "Sale Value", right: true, render: (value: number) => fmt(value) },
            {
              key: "profitLoss",
              label: "Profit/Loss",
              right: true,
              render: (value: number) => <strong style={{ color: value >= 0 ? "var(--green)" : "var(--red)" }}>{fmt(value)}</strong>,
            },
          ]}
          rows={reportState.itemWiseProfit as ItemWiseProfitRow[]}
        />
      )}

      {activeSectionId === "netprofit" && (
        <>
          <ReportTableCard
            title="Profit & Loss Statement"
            sub="Revenue, direct purchase cost, expenses, and final profitability."
            focusId="report-profit-loss"
            cols={[
              { key: "label", label: "Metric" },
              {
                key: "amount",
                label: "Amount",
                right: true,
                render: (value: number) => <strong style={{ color: value < 0 ? "var(--red)" : "var(--ink)" }}>{fmt(value)}</strong>,
              },
            ]}
            rows={buildProfitLossRows(reportState) as ProfitLossRow[]}
          />
        </>
      )}

      {activeSectionId === "partywise" && (
        <ReportTableCard
          title="Party Wise Profit & Loss"
          sub="Customer and supplier margin analysis."
          focusId="report-profit-partywise"
          cols={[
            { key: "partyName", label: "Party Name" },
            { key: "totalBusiness", label: "Total Business", right: true, render: (value: number) => fmt(value) },
            { key: "profitGenerated", label: "Profit Generated", right: true, render: (value: number) => fmt(value) },
            { key: "lossGenerated", label: "Loss Generated", right: true, render: (value: number) => fmt(value) },
            { key: "netMargin", label: "Net Margin", right: true, render: (value: number) => `${value.toFixed(1)}%` },
          ]}
          rows={reportState.partyWiseProfit as PartyWiseProfitRow[]}
        />
      )}
    </>
  );
}

export default function ProfitLossReport() {
  return (
    <ReportLayout
      report={REPORT_BY_ID["profit-loss"]}
      renderContent={{
        stickyFilters: false,
        filters: ({ fromDate, toDate, setFromDate, setToDate, clearBaseFilters }: ReportContext) => (
          <DateRangeSearchFilters
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
            clearBaseFilters={clearBaseFilters}
          />
        ),
        actions: ({ reportState, fromDate, toDate }: ReportContext) => (
          <ExportButtons reportState={reportState} fromDate={fromDate} toDate={toDate} />
        ),
        summary: ({ reportState }: ReportContext) => [
          ReportSummaryCard({ label: "Total Sales", value: fmtShort(reportState.totals.totalSales), sub: "Revenue in selected range" }),
          ReportSummaryCard({ label: "Total Purchase", value: fmtShort(reportState.totals.totalPurchases), sub: "Direct cost base" }),
          ReportSummaryCard({ label: "Total Expense", value: fmtShort(reportState.totals.totalExpenses), sub: "Operating expenses" }),
          ReportSummaryCard({ label: "Gross Profit", value: fmtShort(reportState.totals.grossProfit), sub: "Sales - purchase cost" }),
        ],
        body: ({ reportState }: ReportContext) => <ProfitReportsWorkspace reportState={reportState} />,
      }}
    />
  );
}
