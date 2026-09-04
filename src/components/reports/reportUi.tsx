import type { ComponentType, CSSProperties, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import * as FrontendUi from "@/components/frontendUi/index.js";
import LegacyReportLayout, {
  ReportListCard as LegacyReportListCard,
  ReportSummaryCard as legacyReportSummaryCard,
  ReportTableCard as LegacyReportTableCard,
  fmt,
  fmtShort,
} from "@/components/reports/ReportLayout.jsx";
import type { ReportDefinition, ReportState, ReportSummary } from "@/lib/reports/types";

type CommonProps = {
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
  [key: string]: unknown;
};

type ButtonProps = CommonProps & {
  variant?: string;
  size?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  title?: string;
  tabIndex?: number;
};

type FieldProps = CommonProps & {
  label?: string;
  value?: string | number;
  options?: Array<string | { label: string; value: string }>;
  placeholder?: string;
  type?: string;
};

type KpiCardProps = CommonProps & {
  label: string;
  value: string | number;
  sub?: string;
  trend?: string;
  trendUp?: boolean;
};

type PageHeaderProps = {
  title: string;
  sub?: string;
  right?: ReactNode;
};

type ReportContext = {
  reportState: ReportState;
  fromDate: string;
  toDate: string;
  partyFilter: string;
  categoryFilter: string;
  setFromDate: (value: string) => void;
  setToDate: (value: string) => void;
  setPartyFilter: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  clearBaseFilters: () => void;
  parties: Array<{ name: string }>;
  categories: string[];
};

type ReportLayoutProps = {
  report: ReportDefinition;
  renderContent: {
    stickyFilters?: boolean;
    filters?: (context: ReportContext) => ReactNode;
    actions?: (context: ReportContext) => ReactNode;
    summary?: (context: ReportContext) => ReportSummary[];
    body: (context: ReportContext) => ReactNode;
  };
};

type ReportTableCardProps = {
  title: string;
  sub?: string;
  focusId?: string;
  cols: Array<Record<string, unknown>>;
  rows: Array<Record<string, unknown>>;
  emptyMsg?: string;
  onRowClick?: (row: Record<string, unknown>) => void;
  right?: ReactNode;
};

type ReportListCardProps = {
  title: string;
  sub?: string;
  children: ReactNode;
  right?: ReactNode;
};

export const Button = FrontendUi.Button as ForwardRefExoticComponent<ButtonProps & RefAttributes<any>>;
export const Card = FrontendUi.Card as ComponentType<CommonProps>;
export const CardBody = FrontendUi.CardBody as ComponentType<CommonProps>;
export const CardHead = FrontendUi.CardHead as ComponentType<PageHeaderProps>;
export const FormGrid = FrontendUi.FormGrid as ComponentType<CommonProps & { cols?: number }>;
export const Input = FrontendUi.Input as ForwardRefExoticComponent<FieldProps & RefAttributes<any>>;
export const KpiCard = FrontendUi.KpiCard as ComponentType<KpiCardProps>;
export const PageHeader = FrontendUi.PageHeader as ComponentType<PageHeaderProps>;
export const Select = FrontendUi.Select as ForwardRefExoticComponent<FieldProps & RefAttributes<any>>;

export const ReportLayout = LegacyReportLayout as ComponentType<ReportLayoutProps>;
export const ReportListCard = LegacyReportListCard as ComponentType<ReportListCardProps>;
export const ReportTableCard = LegacyReportTableCard as ComponentType<ReportTableCardProps>;
export const ReportSummaryCard = legacyReportSummaryCard as (summary: ReportSummary) => ReportSummary;

export { fmt, fmtShort };
