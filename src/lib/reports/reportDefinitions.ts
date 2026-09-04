import type { ReportDefinition } from "./types";

export const REPORT_DEFINITIONS: ReportDefinition[] = [
  {
    id: "profit-loss",
    name: "Profit & Loss",
    desc: "Revenue, costs, and net profitability for the selected period.",
    route: "/reports/profit-loss",
    accent: "#111111",
  },
  {
    id: "cash-flow",
    name: "Cash Flow",
    desc: "Operational inflow versus outflow with a clean movement table.",
    route: "/reports/cash-flow",
    accent: "#0f766e",
  },
  {
    id: "party-ledger",
    name: "Party Ledger",
    desc: "Ledger-style balances by party with sales and purchase splits.",
    route: "/reports/party-ledger",
    accent: "#1d4ed8",
  },
  {
    id: "expenses",
    name: "Expense Analysis",
    desc: "Category-wise spending trends and contribution to total cost.",
    route: "/reports/expenses",
    accent: "#92400e",
  },
  {
    id: "stock",
    name: "Stock Report",
    desc: "Closing quantity, valuation rate, and total stock value.",
    route: "/reports/stock",
    accent: "#166534",
  },
  {
    id: "gst",
    name: "GST Report",
    desc: "CGST, SGST and IGST filing-friendly invoice breakdown.",
    route: "/reports/gst",
    accent: "#7c3aed",
  },
  {
    id: "billwise",
    name: "Bill-wise Profit",
    desc: "Invoice-level profit with product cost, discount, and margin detail.",
    route: "/reports/billwise",
    accent: "#be123c",
  },
];

export const REPORT_BY_ID = Object.fromEntries(
  REPORT_DEFINITIONS.map((report) => [report.id, report]),
) as Record<string, ReportDefinition>;
