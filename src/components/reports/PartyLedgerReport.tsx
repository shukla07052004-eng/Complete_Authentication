"use client";

import ReportLayout, {
  ReportSummaryCard,
  ReportTableCard,
  fmt,
  fmtShort,
} from "@/components/reports/ReportLayout.jsx";
import { REPORT_BY_ID } from "@/lib/reports/reportDefinitions";
import type { PartyStatementRow, ReportState } from "@/lib/reports/types";
import { DatePartyCategoryFilters } from "./ReportFilters";

type Party = { name: string };

type ReportContext = {
  reportState: ReportState;
  fromDate: string;
  toDate: string;
  partyFilter: string;
  setFromDate: (value: string) => void;
  setToDate: (value: string) => void;
  setPartyFilter: (value: string) => void;
  clearBaseFilters: () => void;
  parties: Party[];
};

export default function PartyLedgerReport() {
  return (
    <ReportLayout
      report={REPORT_BY_ID["party-ledger"]}
      renderContent={{
        filters: ({
          fromDate,
          toDate,
          partyFilter,
          setFromDate,
          setToDate,
          setPartyFilter,
          clearBaseFilters,
          parties,
        }: ReportContext) => (
          <DatePartyCategoryFilters
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
            partyFilter={partyFilter}
            setPartyFilter={setPartyFilter}
            partyOptions={["All", ...parties.map((party) => party.name)]}
            clearBaseFilters={clearBaseFilters}
          />
        ),
        summary: ({ reportState }: ReportContext) => [
          ReportSummaryCard({ label: "Parties", value: reportState.partyStatement.length, sub: "Ledger accounts" }),
          ReportSummaryCard({ label: "Debit", value: fmtShort(reportState.totals.totalSales), sub: "Sales value" }),
          ReportSummaryCard({ label: "Credit", value: fmtShort(reportState.totals.totalPurchases), sub: "Purchase value" }),
          ReportSummaryCard({ label: "Closing Balance", value: fmtShort(reportState.totals.totalSales - reportState.totals.totalPurchases), sub: "Debit - credit" }),
        ],
        body: ({ reportState }: ReportContext) => (
          <ReportTableCard
            title="Party Ledger"
            sub="Opening balance, debit, credit and closing balance by party."
            focusId="report-party-ledger"
            cols={[
              { key: "name", label: "Party" },
              { key: "salesValue", label: "Debit", right: true, render: (value: number) => fmt(value) },
              { key: "purchaseValue", label: "Credit", right: true, render: (value: number) => fmt(value) },
              {
                key: "balanceValue",
                label: "Closing Balance",
                right: true,
                render: (value: number) => <strong style={{ color: value < 0 ? "var(--red)" : "var(--ink)" }}>{fmt(value)}</strong>,
              },
              { key: "invoices", label: "Sales Bills", right: true },
              { key: "purchases", label: "Purchase Bills", right: true },
            ]}
            rows={reportState.partyStatement as PartyStatementRow[]}
            emptyMsg="No party ledger rows found for the selected filters."
          />
        ),
      }}
    />
  );
}
