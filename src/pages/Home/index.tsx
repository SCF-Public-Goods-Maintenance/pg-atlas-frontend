import { Suspense } from "react";

import DataTransparencyPanel, {
  DataTransparencyPanelFallback,
} from "./components/DataTransparencyPanel";

import CurrentRoundCard from "./components/CurrentRoundCard";
import { ErrorBoundary } from "../../components/atoms/ErrorBoundary";
// import HomeHeader from "./components/HomeHeader";

import MetricsGrid, {
  MetricsGridSkeleton,
  MetricsGridFallback,
} from "./components/MetricsGrid";

// NOTE: AllRoundsCard is temporarily hidden for the same reason as
// CurrentRoundSpotlight / AwardHealth / TrancheAvg — its rows come from
// the static round config (`src/data/rounds/*.json`) and the SDK has no
// `/rounds` endpoint. Re-enable once the backend ships round data
// (see `docs/BACKEND_GAPS.md`).
// import AllRoundsCard, {
//   AllRoundsCardFallback,
// } from "./components/AllRoundsCard";
import TopCriticalCard, {
  TopCriticalCardSkeleton,
  TopCriticalCardFallback,
} from "./components/TopCriticalCard";

import EcosystemHealthCard, {
  EcosystemHealthCardSkeleton,
  EcosystemHealthCardFallback,
} from "./components/EcosystemHealthCard";

// NOTE: AwardHealthCard and TrancheAvgCard are temporarily hidden. They
// currently source from the static round config in `src/data/rounds/*.json`,
// but the upstream intent is for the dashboard to render live backend data
// only. The SDK does not yet expose a usable awarded / tranche aggregate
// (see `docs/BACKEND_GAPS.md` G1/G6). Re-enable the imports and the row
// below once the backend ships a dedicated endpoint.
// import AwardHealthCard, {
//   AwardHealthCardFallback,
// } from "./components/AwardHealthCard";
// import TrancheAvgCard, {
//   TrancheAvgCardFallback,
// } from "./components/TrancheAvgCard";

export default function Home() {
  return (
    <div className="flex h-full flex-col overflow-x-hidden">
      {/* <HomeHeader /> */}

      <div
        className="grid gap-3 sm:gap-4 md:grid-cols-3 shrink-0"
        aria-label="Headline metrics"
      >
        <div className="md:col-span-2">
          <ErrorBoundary fallback={<MetricsGridFallback />}>
            <Suspense fallback={<MetricsGridSkeleton />}>
              <MetricsGrid />
            </Suspense>
          </ErrorBoundary>
        </div>

        <ErrorBoundary fallback={<EcosystemHealthCardFallback />}>
          <Suspense fallback={<EcosystemHealthCardSkeleton />}>
            <EcosystemHealthCard />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div
        className="mt-3 sm:mt-4 grid gap-3 sm:gap-4 md:grid-cols-2 items-stretch"
        aria-label="Critical metrics"
      >
        <div className="flex flex-col gap-3 sm:gap-4">
          <CurrentRoundCard showTotalRounds={true} />
          <ErrorBoundary fallback={<TopCriticalCardFallback />}>
            <Suspense fallback={<TopCriticalCardSkeleton />}>
              <TopCriticalCard />
            </Suspense>
          </ErrorBoundary>
        </div>
        {/*
          <ErrorBoundary fallback={<AllRoundsCardFallback />}>
            <AllRoundsCard />
          </ErrorBoundary>
        */}
        <ErrorBoundary fallback={<DataTransparencyPanelFallback />}>
          <DataTransparencyPanel />
        </ErrorBoundary>
      </div>

      {/*
        AwardHealth + TrancheAvg row — temporarily hidden. The SDK does
        not yet expose the awarded / tranche aggregates these cards need
        (see docs/BACKEND_GAPS.md G1/G6). Re-enable when the backend
        ships a round-scoped aggregate endpoint.

        <div className="mt-4 grid gap-4 lg:grid-cols-2 items-stretch">
          <ErrorBoundary fallback={<AwardHealthCardFallback />}>
            <AwardHealthCard />
          </ErrorBoundary>
          <ErrorBoundary fallback={<TrancheAvgCardFallback />}>
            <TrancheAvgCard />
          </ErrorBoundary>
        </div>
      */}
    </div>
  );
}
