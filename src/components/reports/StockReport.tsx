"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import ReportLayout, {
  ReportSummaryCard,
  ReportTableCard,
  fmt,
  fmtShort,
} from "@/components/reports/ReportLayout.jsx";
import { Button, Card, CardBody, Input } from "@/components/frontendUi/index.js";
import useAutocomplete from "@/hooks/useAutocomplete.js";
import { REPORT_BY_ID } from "@/lib/reports/reportDefinitions";
import { filterStockRows } from "@/lib/reports/calculations";
import { exportStockReport } from "@/lib/reports/exports";
import type { ReportState, StockReportRow } from "@/lib/reports/types";

type ReportContext = {
  reportState: ReportState;
};

type StockSuggestion = StockReportRow & { label: string };

function StockBody({ stockReport }: { stockReport: StockReportRow[] }) {
  const [query, setQuery] = useState("");
  const {
    isOpen,
    setOpen,
    suggestions,
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
  } = useAutocomplete({
    items: stockReport.map((row) => ({ ...row, label: row.item })),
    value: query,
    getLabel: (item: StockSuggestion) => item.item,
    maxSuggestions: 6,
  });

  const filteredRows = useMemo(() => filterStockRows(stockReport, query), [query, stockReport]);

  return (
    <>
      <Card style={{ marginBottom: 18 }}>
        <CardBody style={{ display: "grid", gap: 14 }}>
          <div style={{ position: "relative" }}>
            <Input
              label="Smart Item Search"
              value={query}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setQuery(event.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(event: ReactKeyboardEvent<HTMLInputElement>) => {
                if (handleKeyDown(event, (item: StockSuggestion) => {
                  setQuery(item.item);
                  setOpen(false);
                })) return;
              }}
              placeholder="Type item name to see suggestions"
            />
            {isOpen && query && suggestions.length > 0 && (
              <div style={{ position: "absolute", left: 0, right: 0, top: "calc(100% + 6px)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-md)", zIndex: 8, overflow: "hidden" }}>
                {suggestions.map((item: StockSuggestion, index: number) => (
                  <button
                    key={`${item.item}-${index}`}
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      setQuery(item.item);
                      setHighlightedIndex(index);
                      setOpen(false);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    style={{ width: "100%", border: "none", background: highlightedIndex === index ? "#eef4fb" : "transparent", padding: "10px 12px", textAlign: "left" }}
                  >
                    <div style={{ fontWeight: 600 }}>{item.item}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-40)" }}>Batch {item.batchNo || "-"} | Stock {item.currentStock || 0}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div style={{ fontSize: 12, color: "var(--ink-40)" }}>Real-time filtering, autocomplete, Enter selection, arrow navigation, and Esc support.</div>
            <Button variant="primary" onClick={() => exportStockReport(filteredRows)}>Export Report</Button>
          </div>
        </CardBody>
      </Card>
      <ReportTableCard
        title="Inventory Stock Report"
        sub="Expanded stock columns with batch, pricing and stock visibility."
        focusId="report-stock"
        cols={[
          { key: "item", label: "Item", wrap: true },
          { key: "batchNo", label: "Batch No" },
          { key: "purchaseRate", label: "Purchase Rate", right: true, render: (value: number) => fmt(value || 0) },
          { key: "saleRate", label: "Sale Rate", right: true, render: (value: number) => fmt(value || 0) },
          { key: "purchaseDate", label: "Purchase Date", dim: true },
          { key: "expiryDate", label: "Expiry Date", dim: true },
          { key: "currentStock", label: "Stock", right: true, render: (value: number) => <strong>{value || 0}</strong> },
        ]}
        rows={filteredRows}
        emptyMsg="No stock items match the current search."
      />
    </>
  );
}

export default function StockReport() {
  return (
    <ReportLayout
      report={REPORT_BY_ID.stock}
      renderContent={{
        summary: ({ reportState }: ReportContext) => [
          ReportSummaryCard({ label: "Tracked Items", value: reportState.stockReport.length, sub: "Inventory search ready" }),
          ReportSummaryCard({ label: "Stock Value", value: fmtShort(reportState.totals.stockValue), sub: "Purchase-rate valuation" }),
          ReportSummaryCard({ label: "Low Stock Items", value: reportState.stockReport.filter((row) => (row.currentStock || 0) <= 5).length, sub: "Needs reordering soon" }),
          ReportSummaryCard({ label: "Live Search", value: "On", sub: "Autocomplete + arrow navigation" }),
        ],
        body: ({ reportState }: ReportContext) => <StockBody stockReport={reportState.stockReport} />,
      }}
    />
  );
}
