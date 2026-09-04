import { redirect } from "next/navigation";

export default function LegacyPurchaseReportsPage() {
  redirect("/reports/party-ledger");
}
