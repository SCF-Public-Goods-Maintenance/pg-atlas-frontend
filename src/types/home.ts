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
