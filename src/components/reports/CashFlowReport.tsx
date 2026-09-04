"use client";

import ReportLayout, {
  ReportSummaryCard,
  ReportTableCard,
  fmt,
  fmtShort,
} from "@/components/reports/ReportLayout.jsx";
import { REPORT_BY_ID } from "@/lib/reports/reportDefinitions";
import { buildCashFlowRows } from "@/lib/reports/calculations";
import type { CashFlowRow, ReportState } from "@/lib/reports/types";
import { DateRangeSearchFilters } from "./ReportFilters";

type ReportContext = {
  reportState: ReportState;
  fromDate: string;
  toDate: string;
  setFromDate: (value: string) => void;
  setToDate: (value: string) => void;
  clearBaseFilters: () => void;
};

export default function CashFlowReport() {
  return (
    <ReportLayout
      report={REPORT_BY_ID["cash-flow"]}
      renderContent={{
        filters: ({ fromDate, toDate, setFromDate, setToDate, clearBaseFilters }: ReportContext) => (
          <DateRangeSearchFilters
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
            clearBaseFilters={clearBaseFilters}
          />
        ),
        summary: ({ reportState }: ReportContext) => [
          ReportSummaryCard({ label: "Cash Inflow", value: fmtShort(reportState.totals.cashInflow), sub: "Sales receipts in range" }),
          ReportSummaryCard({ label: "Cash Outflow", value: fmtShort(reportState.totals.cashOutflow), sub: "Purchases plus expenses" }),
          ReportSummaryCard({ label: "Net Movement", value: fmtShort(reportState.totals.cashInflow - reportState.totals.cashOutflow), sub: "Inflow - outflow" }),
        ],
        body: ({ reportState }: ReportContext) => (
          <ReportTableCard
            title="Cash Movement"
            sub="Sales, purchases and expenses sorted by most recent date."
            focusId="report-cash-flow"
            cols={[
              { key: "date", label: "Date", dim: true },
              { key: "type", label: "Type" },
              { key: "source", label: "Source", wrap: true },
              {
                key: "amount",
                label: "Amount",
                right: true,
                render: (value: number) => <strong style={{ color: value < 0 ? "var(--red)" : "var(--green)" }}>{fmt(value)}</strong>,
              },
            ]}
            rows={buildCashFlowRows(reportState) as CashFlowRow[]}
            emptyMsg="No cash movement found for the selected filters."
          />
        ),
      }}
    />
  );
}
