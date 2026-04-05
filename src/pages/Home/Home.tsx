import { useQuery } from "@tanstack/react-query";
import { getMockDashboardOverview } from "../../mocks/dashboardOverviewMock";
import type { DashboardOverviewMock } from "../../mocks/dashboardOverviewMock";
import HomeHeader from "./components/HomeHeader";
import MetricsGrid from "./components/MetricsGrid";
import EcosystemHealthCard from "./components/EcosystemHealthCard";
import TopCriticalCard from "./components/TopCriticalCard";
import AllRoundsCard from "./components/AllRoundsCard";
import AwardHealthCard from "./components/AwardHealthCard";
import TrancheAvgCard from "./components/TrancheAvgCard";

export default function Home() {
  const overviewQuery = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: async () => {
      return await getMockDashboardOverview();
    },
  });

  const overview = overviewQuery.data as DashboardOverviewMock | undefined;

  return (
    <div className="flex h-full flex-col">
      <HomeHeader overview={overview} />

      {(overviewQuery.isLoading || overviewQuery.isError) && (
        <div
          className="mb-3 text-sm text-surface-dark/70 dark:text-white/70"
          aria-live="polite"
        >
          {overviewQuery.isLoading && "Loading ecosystem overview..."}
          {overviewQuery.isError && "Unable to load dashboard overview."}
        </div>
      )}

      <div
        className="grid gap-4 lg:grid-cols-3 shrink-0"
        aria-label="Headline metrics"
      >
        <MetricsGrid overview={overview} />
        <EcosystemHealthCard overview={overview} />
      </div>

      <div className="mt-4 grid flex-1 min-h-0 gap-4 lg:grid-cols-3 items-stretch">
        <TopCriticalCard overview={overview} />
        <AllRoundsCard overview={overview} />
        <div className="flex flex-col gap-4 min-h-0">
          <AwardHealthCard overview={overview} />
          <TrancheAvgCard overview={overview} />
        </div>
      </div>
    </div>
  );
}
