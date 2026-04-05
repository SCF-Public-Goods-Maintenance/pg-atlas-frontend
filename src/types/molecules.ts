export interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

export interface FinancialDistributionChartProps {
  data: ChartDataPoint[];
  title: string;
}
