export type ReportRoute =
  | "/reports/profit-loss"
  | "/reports/cash-flow"
  | "/reports/party-ledger"
  | "/reports/expenses"
  | "/reports/stock"
  | "/reports/gst"
  | "/reports/billwise";

export type ReportDefinition = {
  id: string;
  name: string;
  desc: string;
  route: ReportRoute;
  accent: string;
};

export type ReportSummary = {
  label: string;
  value: string | number;
  sub?: string;
};

export type CashFlowRow = {
  id: string;
  date: string;
  type: "Inflow" | "Outflow";
  source: string;
  amount: number;
};

export type ProfitLossRow = {
  label: string;
  amount: number;
};

export type StockReportRow = {
  item: string;
  batchNo?: string;
  purchaseRate?: number;
  saleRate?: number;
  purchaseDate?: string;
  expiryDate?: string;
  currentStock?: number;
  closingQty?: number;
  valuationRate?: number;
  valuation?: number;
};

export type ExpenseAnalysisRow = {
  category: string;
  amount: number;
  count: number;
};

export type ExpenseTrendRow = {
  month: string;
  amount: number;
};

export type BillWiseProfitRow = {
  id: string;
  customerName: string;
  salesAmount: number;
  purchaseCost: number;
  profitEarned: number;
  profitPct: number;
};

export type ItemWiseProfitRow = {
  itemName: string;
  quantitySold: number;
  purchaseCost: number;
  saleValue: number;
  profitLoss: number;
};

export type PartyWiseProfitRow = {
  partyName: string;
  totalBusiness: number;
  profitGenerated: number;
  lossGenerated: number;
  netMargin: number;
};

export type PartyStatementRow = {
  id?: string;
  name: string;
  salesValue: number;
  purchaseValue: number;
  balanceValue: number;
  invoices?: number;
  purchases?: number;
};

export type ReportState = {
  totals: {
    totalSales: number;
    totalPurchases: number;
    totalExpenses: number;
    grossProfit: number;
    netProfit: number;
    purchasePaid: number;
    purchaseDue: number;
    salesInvoices: number;
    purchaseInvoices: number;
    salesGST: number;
    purchaseGST: number;
    cashInflow: number;
    cashOutflow: number;
    stockValue: number;
    averageDailyExpense: number;
  };
  filteredSales: Array<Record<string, unknown>>;
  filteredPurchases: Array<Record<string, unknown>>;
  filteredExpenses: Array<Record<string, unknown>>;
  billWiseProfit: BillWiseProfitRow[];
  itemWiseProfit: ItemWiseProfitRow[];
  partyWiseProfit: PartyWiseProfitRow[];
  partyStatement: PartyStatementRow[];
  expenseAnalysis: ExpenseAnalysisRow[];
  expenseTrend: ExpenseTrendRow[];
  highestExpenseCategory: ExpenseAnalysisRow | null;
  stockReport: StockReportRow[];
};
