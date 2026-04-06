import { lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";

const Rounds = lazy(() => import("../../pages/Rounds"));

export const roundsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rounds",
  component: Rounds,
});
