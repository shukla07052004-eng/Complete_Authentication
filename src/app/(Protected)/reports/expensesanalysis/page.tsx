import { redirect } from "next/navigation";

export default function LegacyExpensesAnalysisPage() {
  redirect("/reports/expenses");
}
