import { buildReportState as buildLegacyReportState } from "@/data/reportUtils.js";
import type {
  CashFlowRow,
  ExpenseAnalysisRow,
  ProfitLossRow,
  ReportState,
  StockReportRow,
} from "./types";

type BuildReportInput = {
  sales?: unknown[];
  purchases?: unknown[];
  parties?: unknown[];
  expenses?: unknown[];
  itemMaster?: unknown[];
  fromDate?: string;
  toDate?: string;
  partyFilter?: string;
};

function numberFrom(value: unknown): number {
  return typeof value === "number" ? value : Number(value) || 0;
}

function textFrom(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function buildReportState(input: BuildReportInput): ReportState {
  return buildLegacyReportState(input) as ReportState;
}

export function buildProfitLossRows(reportState: ReportState): ProfitLossRow[] {
  return [
    { label: "Sales", amount: reportState.totals.totalSales },
    { label: "Purchases", amount: -reportState.totals.totalPurchases },
    { label: "Expenses", amount: -reportState.totals.totalExpenses },
    { label: "Gross Profit", amount: reportState.totals.grossProfit },
    { label: "Net Profit", amount: reportState.totals.netProfit },
  ];
}

export function buildCashFlowRows(reportState: ReportState): CashFlowRow[] {
  const salesRows = reportState.filteredSales.map((invoice, index) => ({
    id: `sale-${textFrom(invoice.id, String(index))}`,
    date: textFrom(invoice.date),
    type: "Inflow" as const,
    source: textFrom(invoice.party, "Sales"),
    amount: numberFrom(invoice.total),
  }));

  const purchaseRows = reportState.filteredPurchases.map((purchase, index) => ({
    id: `purchase-${textFrom(purchase.id, String(index))}`,
    date: textFrom(purchase.date),
    type: "Outflow" as const,
    source: textFrom(purchase.supplier, "Purchase"),
    amount: -numberFrom(purchase.amount),
  }));

  const expenseRows = reportState.filteredExpenses.map((expense, index) => ({
    id: `expense-${textFrom(expense.id, String(index))}`,
    date: textFrom(expense.date),
    type: "Outflow" as const,
    source: textFrom(expense.category, "Expense"),
    amount: -numberFrom(expense.amount),
  }));

  return [...salesRows, ...purchaseRows, ...expenseRows].sort((a, b) =>
    String(b.date).localeCompare(String(a.date)),
  );
}

export function filterExpenseAnalysis(
  rows: ExpenseAnalysisRow[],
  categoryFilter: string,
): ExpenseAnalysisRow[] {
  if (categoryFilter === "All") return rows;
  return rows.filter((row) => row.category === categoryFilter);
}

export function filterStockRows(rows: StockReportRow[], query: string): StockReportRow[] {
  const value = query.trim().toLowerCase();
  if (!value) return rows;
  return rows.filter((row) => row.item.toLowerCase().includes(value));
}
