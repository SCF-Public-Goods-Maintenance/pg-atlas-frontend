import { lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";

const Repos = lazy(() => import("../../pages/Repos"));

export const reposIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/repos",
  component: Repos,
});
