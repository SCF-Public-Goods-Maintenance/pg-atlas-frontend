import type { DashboardOverviewMock } from "../mocks/dashboardOverviewMock";

type Overview = DashboardOverviewMock | undefined;

export interface HomeHeaderProps {
  overview: Overview;
}

export interface MetricsGridProps {
  overview: Overview;
}

export interface EcosystemHealthCardProps {
  overview: Overview;
}

export interface TopCriticalCardProps {
  overview: Overview;
}

export interface AllRoundsCardProps {
  overview: Overview;
}

export interface AwardHealthCardProps {
  overview: Overview;
}

export interface TrancheAvgCardProps {
  overview: Overview;
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
