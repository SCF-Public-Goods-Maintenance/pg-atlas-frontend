import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import Graph from "../pages/Graph/Graph";

export const graphRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/graph",
  component: Graph,
});
