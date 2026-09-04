"use client";

import { useRouter } from "next/navigation";
import GSTReport from "@/components/reports/GSTReport.jsx";

const REPORTS_LAST_CARD_KEY = "reports-last-card";
const REPORTS_RESTORE_FOCUS_KEY = "reports-restore-focus";

export default function GSTPage() {
  const router = useRouter();

  return (
    <GSTReport
      onBack={() => {
        sessionStorage.setItem(REPORTS_LAST_CARD_KEY, "gst");
        sessionStorage.setItem(REPORTS_RESTORE_FOCUS_KEY, "true");
        router.push("/reports");
      }}
    />
  );
}
