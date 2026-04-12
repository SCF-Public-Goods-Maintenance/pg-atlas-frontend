import { lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";

const GitlogArtifacts = lazy(() => import("../../pages/GitlogArtifacts"));

export const gitlogIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gitlog",
  component: GitlogArtifacts,
});
