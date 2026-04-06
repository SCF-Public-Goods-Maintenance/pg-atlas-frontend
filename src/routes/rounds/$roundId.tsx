import { lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";

const Round = lazy(() => import("../../pages/Round"));

export const roundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rounds/$roundId",
  component: Round,
});
