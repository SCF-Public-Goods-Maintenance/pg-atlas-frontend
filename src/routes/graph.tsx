import { lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";

const Graph = lazy(() => import("../pages/Graph"));

export const graphRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/graph",
  component: Graph,
});
