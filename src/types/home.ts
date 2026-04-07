import type { DashboardOverview } from "../services/dashboardService";

export type Overview = DashboardOverview | undefined;

// Props simplified as components now handle their own data fetching
export interface HomeHeaderProps {
  overview: Overview;
  isLoading?: boolean;
}

export interface RoundRow {
  roundId: string | number;
  label: string;
  isCurrent: boolean;
}

export interface PieLabelRenderProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}
