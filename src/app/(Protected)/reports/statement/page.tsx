import { redirect } from "next/navigation";

export default function LegacyStatementPage() {
  redirect("/reports/party-ledger");
}
