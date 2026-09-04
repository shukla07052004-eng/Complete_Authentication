"use client";

import { Bar, BarChart, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ReportLayout, {
  ReportSummaryCard,
  ReportTableCard,
  fmt,
  fmtShort,
} from "@/components/reports/ReportLayout.jsx";
import { Card, CardBody } from "@/components/frontendUi/index.js";
import { REPORT_BY_ID } from "@/lib/reports/reportDefinitions";
import { filterExpenseAnalysis } from "@/lib/reports/calculations";
import { exportExpenseReport } from "@/lib/reports/exports";
import type { ExpenseAnalysisRow, ReportState } from "@/lib/reports/types";
import { DatePartyCategoryFilters } from "./ReportFilters";

const CHART_COLORS = ["#163a5f", "#2f6690", "#58a4b0", "#7ec8b2", "#d9ed92"];

type ReportContext = {
  reportState: ReportState;
  fromDate: string;
  toDate: string;
  categoryFilter: string;
  setFromDate: (value: string) => void;
  setToDate: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  clearBaseFilters: () => void;
  categories: string[];
};

function textFrom(row: Record<string, unknown>, key: string, fallback = "-"): string {
  const value = row[key];
  return typeof value === "string" && value ? value : fallback;
}

export default function ExpenseReport() {
  return (
    <ReportLayout
      report={REPORT_BY_ID.expenses}
      renderContent={{
        stickyFilters: false,
        filters: ({
          fromDate,
          toDate,
          categoryFilter,
          setFromDate,
          setToDate,
          setCategoryFilter,
          clearBaseFilters,
          categories,
        }: ReportContext) => (
          <DatePartyCategoryFilters
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categoryOptions={categories}
            clearBaseFilters={clearBaseFilters}
          />
        ),
        actions: ({ reportState, fromDate, toDate }: ReportContext) => (
          <button
            type="button"
            onClick={() => exportExpenseReport(reportState, fromDate, toDate)}
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
        ),
        summary: ({ reportState }: ReportContext) => [
          ReportSummaryCard({ label: "Total Expenses", value: fmtShort(reportState.totals.totalExpenses), sub: "Selected range total" }),
          ReportSummaryCard({
            label: "Highest Expense Category",
            value: reportState.highestExpenseCategory?.category || "N/A",
            sub: reportState.highestExpenseCategory ? fmtShort(reportState.highestExpenseCategory.amount) : "No data",
          }),
          ReportSummaryCard({ label: "Average Daily Expense", value: fmtShort(reportState.totals.averageDailyExpense), sub: "Active expense days only" }),
          ReportSummaryCard({ label: "Monthly Expense Trend", value: reportState.expenseTrend.length, sub: "Tracked month buckets" }),
        ],
        body: ({ reportState, categoryFilter }: ReportContext) => {
          const expenseAnalysis = filterExpenseAnalysis(reportState.expenseAnalysis, categoryFilter);
          const visibleExpenses = categoryFilter === "All"
            ? reportState.filteredExpenses
            : reportState.filteredExpenses.filter((row) => row.category === categoryFilter);

          return (
            <>
              <div className="two-col-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                <Card>
                  <CardBody style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={expenseAnalysis}>
                        <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value: number) => fmt(value)} />
                        <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                          {expenseAnalysis.map((entry: ExpenseAnalysisRow, index: number) => (
                            <Cell key={entry.category} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={reportState.expenseTrend}>
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value: number) => fmt(value)} />
                        <Line dataKey="amount" stroke="#163a5f" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
              </div>
              <ReportTableCard
                title="Expense Breakdown"
                sub="Date-filtered expense rows with category totals."
                focusId="report-expenses-analysis"
                cols={[
                  { key: "date", label: "Date", dim: true },
                  { key: "category", label: "Category" },
                  { key: "title", label: "Expense Title", render: (_: unknown, row: Record<string, unknown>) => textFrom(row, "title", textFrom(row, "desc")) },
                  { key: "paymentMode", label: "Payment Mode", render: (_: unknown, row: Record<string, unknown>) => textFrom(row, "paymentMode", textFrom(row, "mode")) },
                  { key: "amount", label: "Amount", right: true, render: (value: number) => <strong>{fmt(value || 0)}</strong> },
                ]}
                rows={visibleExpenses}
                emptyMsg="No expenses match the current filters."
              />
            </>
          );
        },
      }}
    />
  );
}
