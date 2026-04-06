import { lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";

const Contributor = lazy(() => import("../../pages/Contributor"));

export const contributorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contributors/$id",
  component: Contributor,
});
