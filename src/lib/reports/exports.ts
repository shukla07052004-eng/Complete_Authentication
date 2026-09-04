import { formatRangeLabel } from "@/data/reportUtils.js";
import { downloadCsv, fmt, printTextReport } from "@/utils/helpers.js";
import type { ReportState, StockReportRow } from "./types";

type DataRow = Record<string, unknown>;

function numberFrom(value: unknown): number {
  return typeof value === "number" ? value : Number(value) || 0;
}

function textFrom(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function exportProfitReport(reportState: ReportState, fromDate: string, toDate: string): void {
  downloadCsv("profit-report.csv", [
    { label: "Invoice No", key: "id" },
    { label: "Customer", key: "customerName" },
    { label: "Sales Amount", key: "salesAmount" },
    { label: "Purchase Cost", key: "purchaseCost" },
    { label: "Profit Earned", key: "profitEarned" },
    { label: "Profit %", value: (row: DataRow) => numberFrom(row.profitPct).toFixed(2) },
  ], reportState.billWiseProfit);

  printTextReport({
    title: "Profit Report",
    subtitle: `Range: ${formatRangeLabel(fromDate, toDate)} | Total Sales: ${fmt(reportState.totals.totalSales)} | Gross Profit: ${fmt(reportState.totals.grossProfit)} | Net Profit: ${fmt(reportState.totals.netProfit)}`,
    sections: [
      {
        title: "Bill-wise Profit",
        columns: [
          { label: "Invoice", value: (row: DataRow) => textFrom(row.id) },
          { label: "Customer", value: (row: DataRow) => textFrom(row.customerName) },
          { label: "Sales", value: (row: DataRow) => fmt(numberFrom(row.salesAmount)), align: "right" },
          { label: "Cost", value: (row: DataRow) => fmt(numberFrom(row.purchaseCost)), align: "right" },
          { label: "Profit", value: (row: DataRow) => fmt(numberFrom(row.profitEarned)), align: "right" },
        ],
        rows: reportState.billWiseProfit,
      },
      {
        title: "Item-wise Profit & Loss",
        columns: [
          { label: "Item", value: (row: DataRow) => textFrom(row.itemName) },
          { label: "Qty Sold", value: (row: DataRow) => numberFrom(row.quantitySold), align: "right" },
          { label: "Sale Value", value: (row: DataRow) => fmt(numberFrom(row.saleValue)), align: "right" },
          { label: "Profit/Loss", value: (row: DataRow) => fmt(numberFrom(row.profitLoss)), align: "right" },
        ],
        rows: reportState.itemWiseProfit,
      },
    ],
  });
}

export function exportExpenseReport(reportState: ReportState, fromDate: string, toDate: string): void {
  downloadCsv("expense-report.csv", [
    { label: "Date", key: "date" },
    { label: "Category", key: "category" },
    { label: "Title", value: (row: DataRow) => textFrom(row.title) || textFrom(row.desc) },
    { label: "Amount", key: "amount" },
    { label: "Payment Mode", value: (row: DataRow) => textFrom(row.paymentMode) || textFrom(row.mode) },
    { label: "Notes", value: (row: DataRow) => textFrom(row.notes) },
  ], reportState.filteredExpenses);

  printTextReport({
    title: "Expense Report",
    subtitle: `Range: ${formatRangeLabel(fromDate, toDate)} | Total Expense: ${fmt(reportState.totals.totalExpenses)} | Avg Daily: ${fmt(reportState.totals.averageDailyExpense)} | Highest Category: ${reportState.highestExpenseCategory?.category || "N/A"}`,
    sections: [
      {
        title: "Expense Entries",
        columns: [
          { label: "Date", value: (row: DataRow) => textFrom(row.date) },
          { label: "Category", value: (row: DataRow) => textFrom(row.category) },
          { label: "Title", value: (row: DataRow) => textFrom(row.title) || textFrom(row.desc) },
          { label: "Amount", value: (row: DataRow) => fmt(numberFrom(row.amount)), align: "right" },
        ],
        rows: reportState.filteredExpenses,
      },
    ],
  });
}

export function exportStockReport(rows: StockReportRow[]): void {
  downloadCsv("stock-report.csv", [
    { label: "Item", key: "item" },
    { label: "Batch No", key: "batchNo" },
    { label: "Purchase Rate", key: "purchaseRate" },
    { label: "Sale Rate", key: "saleRate" },
    { label: "Purchase Date", key: "purchaseDate" },
    { label: "Expiry Date", key: "expiryDate" },
    { label: "Stock", key: "currentStock" },
  ], rows);

  printTextReport({
    title: "Stock Report",
    subtitle: `Items: ${rows.length} | Current Stock Value: ${fmt(rows.reduce((sum, row) => sum + (numberFrom(row.currentStock) * numberFrom(row.purchaseRate)), 0))}`,
    sections: [
      {
        title: "Inventory Snapshot",
        columns: [
          { label: "Item", value: (row: StockReportRow) => row.item },
          { label: "Batch", value: (row: StockReportRow) => row.batchNo || "-" },
          { label: "Purchase", value: (row: StockReportRow) => fmt(numberFrom(row.purchaseRate)), align: "right" },
          { label: "Sale", value: (row: StockReportRow) => fmt(numberFrom(row.saleRate)), align: "right" },
          { label: "Stock", value: (row: StockReportRow) => numberFrom(row.currentStock), align: "right" },
        ],
        rows,
      },
    ],
  });
}
