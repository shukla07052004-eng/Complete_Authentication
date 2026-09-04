"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHead, PageHeader } from "@/components/frontendUi/index.js";
import useFocusZone from "@/hooks/useFocusZone";
import { REPORT_DEFINITIONS } from "@/lib/reports/reportDefinitions";
import ReportCard from "./ReportCard";

const REPORTS_LAST_CARD_KEY = "reports-last-card";
const REPORTS_RESTORE_FOCUS_KEY = "reports-restore-focus";

export default function ReportsWorkspace() {
  const router = useRouter();
  const focusList = useFocusZone({
  count: REPORT_DEFINITIONS.length,
  orientation: "grid",
  columns: 3,

  onEnter: (index, event) => {
    event.preventDefault();

    const report = REPORT_DEFINITIONS[index];

    if (report?.route) {
      router.push(report.route);
    }
  },
});

  useEffect(() => {
    const shouldRestore = sessionStorage.getItem(REPORTS_RESTORE_FOCUS_KEY) === "true";
    if (!shouldRestore) return;

    const lastCard = sessionStorage.getItem(REPORTS_LAST_CARD_KEY);
    const index = REPORT_DEFINITIONS.findIndex((report) => report.id === lastCard);
    focusList.setCurrentIndex(index >= 0 ? index : 0);
    sessionStorage.removeItem(REPORTS_RESTORE_FOCUS_KEY);
  }, [focusList]);

  return (
    <div className="animate-slide">
      <PageHeader title="Reports" sub="Complete business insights in one place." />

      <Card style={{ marginBottom: 20 }}>
        <CardHead
          title="Report Cards"
          sub="ArrowLeft / ArrowRight to move between cards. Enter opens the selected report route."
        />
        <CardBody>
          <div id="reports-grid" className="reports-card-grid ">
            {REPORT_DEFINITIONS.map((report, index) => (
              <ReportCard
                key={report.id}
                report={report}
                selected={focusList.currentIndex === index}
                focused={focusList.currentIndex === index}
                {...focusList.getItemProps(index, {
                  sectionEntry: index === 0,
                  onClick: () => router.push(report.route),
                })}
              />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
